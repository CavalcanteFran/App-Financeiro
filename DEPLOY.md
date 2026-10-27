# Publicar o Wonder Finances no GitHub Pages

O repositório configurado é `CavalcanteFran/App-Financeiro`, na branch `master`. O workflow `.github/workflows/deploy-pages.yml` publica somente `index.html`, `styles.css`, `app.js` e `supabase-client.js`; não publica migrations, documentação, testes ou o `.env`.

## Ativação

1. No GitHub, abra `CavalcanteFran/App-Financeiro` → **Settings** → **Pages**.
2. Em **Build and deployment**, selecione **GitHub Actions** como fonte.
3. Após a branch `master` receber o workflow, a publicação roda automaticamente. O endereço padrão esperado é `https://cavalcantefran.github.io/App-Financeiro/`.
4. Em Supabase → **Authentication** → **URL Configuration**, configure esse endereço como **Site URL** e inclua o mesmo endereço em **Redirect URLs**, para links de confirmação de e-mail voltarem ao app.
5. Aguarde o job `Deploy Wonder Finances to GitHub Pages` em **Actions** finalizar e abra a URL indicada pelo próprio deploy.

## Antes de usar

O link do GitHub Pages será público. O repositório pode permanecer privado conforme o plano do GitHub, mas a página publicada continua acessível publicamente. A chave `sb_publishable` é uma chave de cliente; nunca publique uma `service_role` ou secret key.

Esta versão ainda guarda contas, transações, cartões, orçamentos e metas no `localStorage`. O login e a seleção de espaço Supabase não sincronizam esses dados. Eles ficam no perfil do navegador usado e não aparecem automaticamente em outros dispositivos. Não use informações financeiras reais até concluirmos a persistência remota e os testes de isolamento.

## Publicação controlada

O workflow e esta documentação estão preparados localmente. Para publicar, será necessário enviar as alterações para a branch `master` e ativar GitHub Pages no repositório. Não execute o deploy até revisar e aprovar explicitamente a publicação.
