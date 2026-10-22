# Horizonte — Finanças pessoais

Aplicação web de controle financeiro pessoal em português, criada para funcionar sem instalar dependências. A interface usa HTML, CSS e JavaScript; os dados ficam no `localStorage` do navegador.

## Executar

Abra `index.html` em um navegador moderno. Para testar recursos como recarga e armazenamento local, também é possível servir a pasta por HTTP:

```sh
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## O que está implementado

- Dashboard com receitas, despesas pagas, valores pendentes, saldo das contas, disponibilidade mensal, taxa de poupança, próximos vencimentos e gráficos calculados pelos lançamentos.
- Cadastro, edição, filtros, busca, ordenação e exclusão de transações; data, vencimento, conta, cartão, categoria, status, recorrência e notas.
- Contas, cartões e limites de cartão, orçamentos por categoria, metas financeiras e relatórios mensais.
- Alertas com deduplicação local para marcos de orçamento, vencimentos e uso elevado do limite do cartão.
- Prévia de importação CSV, ignorando duplicatas óbvias; exportação CSV, resumo mensal CSV e backup/restauração JSON.
- Moeda principal configurável em USD, BRL ou EUR; datas no formato americano ou brasileiro.
- Layout responsivo para desktop e celular.

Os registros demonstrativos aparecem na primeira abertura e podem ser removidos pelo botão **Limpar demonstração**. Depois que os dados demonstrativos forem removidos, o aplicativo inicia com coleções vazias.

## Modelo financeiro e limites desta edição

Valores monetários são armazenados em centavos inteiros. O saldo de cada conta é um valor informado pelo usuário e é atualizado quando novas transações liquidadas são lançadas, pagas, recebidas ou excluídas. Compras no cartão são despesas e não reduzem o saldo bancário até que o usuário registre uma movimentação de pagamento; não há módulo de faturas com pagamento parcial nesta edição. Transferências podem ser marcadas para não aparecer como receita/despesa, mas o cadastro ainda não oferece uma segunda conta de destino para movimentar ambos os saldos.

Recorrências são identificadas, mas não geram automaticamente ocorrências futuras. A importação implementada é CSV com vírgulas e colunas de descrição, valor e data. Não há suporte a XLSX, PDF/OCR, exportação PDF, conversão cambial, integração bancária, sincronização ou geração automática de parcelas.

O armazenamento local não oferece login, sincronização, criptografia gerenciada, controle de acesso no servidor ou isolamento entre usuários. A versão atual serve como aplicativo pessoal local; não deve ser publicada como serviço multiusuário nem usada para armazenar credenciais ou dados completos de cartões. Um deployment multiusuário requer backend autenticado e banco de dados com políticas de isolamento (por exemplo, PostgreSQL com RLS), validação no servidor, gestão de segredos e revisão de segurança.

## Verificação

Execute `node --test tests/finance.test.cjs` para verificar arredondamento em centavos, cálculo de totais, impactos no saldo, separação de moedas e deduplicação de alertas. `node --check app.js` verifica a sintaxe do aplicativo. Como não há framework nem dependências, não existe processo de build ou lint configurado.
