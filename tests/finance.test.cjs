const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, { id, style: {}, value: '', innerHTML: '', textContent: '', addEventListener() {} });
  return elements.get(id);
}
const store = new Map();
const context = vm.createContext({
  console,
  Intl,
  Date,
  Math,
  Number,
  String,
  Object,
  Array,
  JSON,
  Set,
  Map,
  RegExp,
  crypto: require('node:crypto').webcrypto,
  localStorage: {
    getItem(key) { return store.get(key) ?? null; },
    setItem(key, value) { store.set(key, value); },
  },
  document: {
    querySelector(selector) { return selector === '#trend-chart' ? null : element(selector); },
    querySelectorAll() { return []; },
    addEventListener() {},
  },
  window: { addEventListener() {} },
  requestAnimationFrame(callback) { callback(); },
  confirm() { return true; },
  prompt() { return null; },
  setTimeout,
});
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
vm.runInContext(source, context, { filename: 'app.js' });
const run = expression => vm.runInContext(expression, context);

test('converte valores monetários para centavos inteiros', () => {
  assert.equal(run('cents(12.34)'), 1234);
  assert.equal(run('cents(0.1 + 0.2)'), 30);
});

test('separa receitas, despesas liquidadas e despesas pendentes', () => {
  const totals = run(`txTotals([
    {type:'income',status:'received',amount:10000},
    {type:'expense',status:'paid',amount:3500},
    {type:'expense',status:'pending',amount:1200},
    {type:'expense',status:'forecast',amount:900}
  ])`);
  assert.deepEqual(JSON.parse(JSON.stringify(totals)), { income: 10000, expense: 3500, pending: 1200 });
});

test('aplica e reverte impactos de saldo sem contar transferências', () => {
  run(`state.settings.currency='USD';state.accounts=[{id:'a',balance:10000,currency:'USD'}]`);
  run(`balanceImpact({accountId:'a',type:'expense',status:'paid',amount:2500},1)`);
  assert.equal(run('state.accounts[0].balance'), 7500);
  run(`balanceImpact({accountId:'a',type:'expense',status:'paid',amount:2500},-1)`);
  run(`balanceImpact({accountId:'a',type:'income',status:'received',amount:5000},1)`);
  run(`balanceImpact({accountId:'a',type:'income',status:'received',amount:5000,transfer:true},1)`);
  assert.equal(run('state.accounts[0].balance'), 15000);
});

test('não soma saldos de moedas diferentes', () => {
  run(`state.settings.currency='USD';state.accounts=[
    {balance:10000,currency:'USD'}, {balance:70000,currency:'BRL'}, {balance:5000}
  ]`);
  assert.equal(run('availableBalance()'), 15000);
});

test('deduplica alertas da mesma ocorrência', () => {
  run(`state.notifications=[];addNotification('Limite','80% utilizado','normal','budget-x');addNotification('Limite','80% utilizado','normal','budget-x')`);
  assert.equal(run('state.notifications.length'), 1);
});
