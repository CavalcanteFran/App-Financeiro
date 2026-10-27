# Roadmap — Horizonte

## Estado atual

- Aplicação estática em HTML/CSS/JavaScript; os dados do app ainda são lidos e gravados no `localStorage`.
- Foi iniciado um cliente Supabase no navegador e o SDK está referenciado via CDN.
- `supabase-client.js` contém a URL e a chave publicável do projeto; a API Auth e a leitura de diagnóstico responderam com sucesso.
- `.env` está vazio. Como a aplicação não tem bundler/backend, esse arquivo não é carregado pelo navegador.
- A conexão ao REST e uma leitura da tabela `connection_check` foram confirmadas (HTTP 200).
- O banco já contém `accounts` e `transactions` com tenant `space_id`, IDs `text` e dinheiro em centavos. A migration genérica baseada em `user_id` não se aplica e está marcada como rascunho incompatível.
- RLS está habilitada em `accounts`, `transactions`, `finance_space_members` e `finance_spaces`. As políticas limitam criação ao usuário autenticado e administração aos proprietários; as funções de checagem usam `SECURITY DEFINER`, `search_path` vazio e `auth.uid()`. As FKs garantem que contas pertençam a espaços e que transações apontem para conta/cartão do mesmo espaço. Ainda falta testar isolamento entre dois usuários.
- O app agora mostra login Supabase antes de qualquer dashboard, separa o `localStorage` por usuário e inclui solicitação de link de recuperação e atualização da senha após retorno pelo link. Contas, lançamentos e outros dados financeiros continuam locais, sem sincronização.
- A tela de Configurações inclui diagnóstico do banco, cadastro/login/logout e leitura/seleção de espaços. O usuário confirmou “Conexão com o banco confirmada”; o cadastro foi criado, mas a imagem mostrava que a sessão ainda não estava autenticada.

## Etapas

### 1. Confirmar projeto e conexão Supabase

1. No Supabase Dashboard, confirme que o projeto associado ao `Project URL` exibido em `supabase-client.js` existe e está ativo.
2. Nas configurações/API do projeto, copie o **Project URL** e a **Publishable key** (ou a chave `anon` pública de projetos antigos).
3. No arquivo local `supabase-client.js`, coloque cada valor no campo correspondente. O URL é parecido com `https://<project-ref>.supabase.co`; a chave publicável é uma chave longa, não uma rota `/rest/v1/`.
4. Nunca coloque no frontend uma `service_role` key ou secret key. A chave publicável só pode ser usada com RLS habilitado e políticas corretas.
5. Rode a aplicação por um servidor local HTTP e use um teste `select` de uma tabela de diagnóstico para confirmar rede, URL, chave e resposta do banco. Não considere a conexão validada apenas porque o cliente foi criado sem erro.

O script de diagnóstico sem dados financeiros está em `supabase/migrations/202610270001_connection_check.sql`. Execute esse SQL no SQL Editor do projeto antes do teste de leitura.

**Critério de conclusão:** concluído: endpoint Auth respondeu HTTP 200, `connection_check` retornou HTTP 200 e o usuário confirmou o mesmo resultado pelo app. Nenhuma chave administrativa foi adicionada ao cliente.

### 2. Auditar e documentar o esquema e a segurança existentes

Não executar a migration genérica `202610270002_core_schema.sql` neste banco. Inspecionar relações entre espaços, membros, contas e transações, e políticas RLS existentes. Adaptar o app ao modelo `space_id`, `text` e `*_cents` que já existe.

**Critério:** confirmar por testes que cada usuário só vê e modifica espaços autorizados, inclusive via chamadas diretas à API.

### 3. Autenticação e sessão

A tela de login agora é a primeira tela; o restante do app permanece oculto sem sessão. Cadastro, login, logout, restauração da sessão, listagem de espaços e o fluxo de redefinição de senha estão implementados. Próximo passo: permitir a URL de retorno em Supabase Authentication → URL Configuration e testar e-mail de recuperação, nova senha, login e dois usuários.

### 4. Persistência Supabase

Substituir progressivamente o `localStorage` como fonte principal por consultas autenticadas. Começar por contas e transações; depois orçamentos e metas. Definir uma importação de dados locais que apresente prévia e não duplique registros.

### 5. Integridade financeira

Formalizar estados previsto/pendente/liquidado, pagamentos parciais, estornos, transferências com conta de origem e destino, pagamentos de faturas sem duplicação, recorrências sem duplicatas e parcelas alocadas à fatura correta. Fazer operações relacionadas em transações SQL/RPC quando precisarem ser atômicas.

### 6. Recursos complementares

Completar fluxo de caixa de 30/60/90 dias, filtros por conta/cartão/categoria, alertas configuráveis, exportações e importação com revisão. Avaliar Excel/PDF/OCR separadamente, com confirmação dos dados extraídos.

### 7. Validação e publicação

Criar testes de regras financeiras e políticas RLS; verificar os fluxos de autenticação, CRUD, importação e isolamento entre usuários em navegador; configurar variáveis de ambiente por ambiente; revisar logs, backup, recuperação e deploy HTTPS.

## Como vamos conduzir

Vamos concluir uma etapa por vez. Conexão básica e auditoria inicial das políticas estão feitas; agora falta testar a tela de autenticação e a leitura dos espaços no app. Não envie chaves secretas no chat.
