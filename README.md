# Horizonte — Finanças pessoais

Aplicação web de controle financeiro pessoal em português, criada para funcionar sem instalar dependências. A interface usa HTML, CSS e JavaScript; os dados ficam no `localStorage` do navegador.

## Executar

Inicie o servidor local incluído:

```sh
node dev-server.mjs
```

Depois acesse `http://localhost:3000`. O servidor escuta apenas no loopback local (`localhost`) e serve os arquivos estáticos do app.

## O que está implementado

- Dashboard com receitas, despesas pagas, valores pendentes, saldo das contas, disponibilidade mensal, taxa de poupança, próximos vencimentos e gráficos calculados pelos lançamentos.
- Cadastro, edição, filtros, busca, ordenação e exclusão de transações; data, vencimento, conta, cartão, categoria, status, recorrência e notas.
- Contas, cartões e limites de cartão, orçamentos por categoria, metas financeiras e relatórios mensais.
- Alertas com deduplicação local para marcos de orçamento, vencimentos e uso elevado do limite do cartão.
- Prévia de importação CSV, ignorando duplicatas óbvias; exportação CSV, resumo mensal CSV e backup/restauração JSON.
- Moeda principal configurável em USD, BRL ou EUR; datas no formato americano ou brasileiro.
- Tela inicial bloqueada por autenticação Supabase; login/cadastro por e-mail, recuperação de senha, logout e lista de espaços da sessão.
- Diagnóstico de leitura do banco; dados locais separados por usuário autenticado neste navegador.
- Layout responsivo para desktop e celular.

Os registros demonstrativos aparecem na primeira abertura e podem ser removidos pelo botão **Limpar demonstração**. Depois que os dados demonstrativos forem removidos, o aplicativo inicia com coleções vazias.

## Modelo financeiro e limites desta edição

Valores monetários são armazenados em centavos inteiros. O saldo de cada conta é um valor informado pelo usuário e é atualizado quando novas transações liquidadas são lançadas, pagas, recebidas ou excluídas. Compras no cartão são despesas e não reduzem o saldo bancário até que o usuário registre uma movimentação de pagamento; não há módulo de faturas com pagamento parcial nesta edição. Transferências podem ser marcadas para não aparecer como receita/despesa, mas o cadastro ainda não oferece uma segunda conta de destino para movimentar ambos os saldos.

Recorrências são identificadas, mas não geram automaticamente ocorrências futuras. A importação implementada é CSV com vírgulas e colunas de descrição, valor e data. Não há suporte a XLSX, PDF/OCR, exportação PDF, conversão cambial, integração bancária ou geração automática de parcelas. A autenticação Supabase já foi iniciada, mas contas, transações e os demais dados financeiros ainda não leem nem gravam no Supabase; eles continuam locais.

O dashboard e os dados financeiros só ficam visíveis depois de autenticar. Para recuperação de senha funcionar, o endereço do app precisa estar permitido em Supabase Authentication → URL Configuration. Os dados financeiros locais não são sincronizados e não têm criptografia gerenciada; a separação por usuário vale somente neste navegador. A chave publicável Supabase fica no cliente por projeto, mas nunca se deve colocar uma chave `service_role`/secret no frontend. Até concluir a persistência remota e testes completos de isolamento, esta edição não deve ser usada como serviço financeiro multiusuário nem para guardar credenciais bancárias ou números completos de cartões.

## Verificação

Execute `node --test tests/finance.test.cjs` para verificar arredondamento em centavos, cálculo de totais, impactos no saldo, separação de moedas e deduplicação de alertas. `node --check app.js` verifica a sintaxe do aplicativo. Como não há framework nem dependências, não existe processo de build ou lint configurado.
