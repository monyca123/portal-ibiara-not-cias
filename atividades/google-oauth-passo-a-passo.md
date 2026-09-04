# Passo a passo: credenciais do Google (login social)

Uns 5 minutos. No fim você vai ter duas informações (Client ID e Client
Secret) que vão direto no arquivo `.env` do projeto — nunca precisa me
mandar elas por aqui no chat.

## Passo 1 — Criar o projeto no Google Cloud

1. Acesse **https://console.cloud.google.com/** e faça login com sua conta
   Google (pode ser a mesma de sempre, não precisa ser a acadêmica).
2. No topo, clique no seletor de projeto (ao lado de "Google Cloud") →
   **"Novo projeto"**.
3. Dê um nome, tipo `ibiara-noticias`, e clique em **Criar**.
4. Espere uns segundos e selecione esse projeto recém-criado no mesmo
   seletor do topo (importante — se continuar em outro projeto, os
   próximos passos não vão funcionar).

## Passo 2 — Configurar a "tela de consentimento"

Essa é a telinha que aparece pro usuário perguntando "permitir que
Ibiara Notícias acesse seu email do Google?".

1. No menu à esquerda (ou busque na barra de pesquisa do topo):
   **"APIs e serviços" → "Tela de permissão OAuth"**.
2. Tipo de usuário: escolha **"Externo"** → Criar.
3. Preencha:
   - Nome do app: `Ibiara Notícias`
   - Email de suporte do usuário: seu email
   - Email de contato do desenvolvedor: seu email
   - Se aparecer o campo **"Domínios autorizados"**, adicione:
     `ibiaranoticias.com`
4. Clique **Salvar e continuar** nas telas seguintes (Escopos e Usuários
   de teste) sem precisar mexer em nada — pode deixar tudo padrão.
5. No resumo final, clique em **Voltar ao painel**.

> Enquanto o app estiver em modo "Teste" (padrão), só emails que você
> adicionar como "Usuários de teste" conseguem logar. Pra qualquer
> pessoa poder usar, depois você clica em **"Publicar app"** nessa mesma
> tela — não exige revisão da Google pra esse tipo de permissão básica
> (nome, email, foto), só clicar num botão.

## Passo 3 — Criar as credenciais (Client ID e Secret)

1. No menu à esquerda: **"APIs e serviços" → "Credenciais"**.
2. Clique em **"+ Criar credenciais"** → **"ID do cliente OAuth"**.
3. Tipo de aplicativo: **"Aplicativo da Web"**.
4. Nome: `Ibiara Notícias - Web` (só um rótulo, não aparece pro usuário).
5. Em **"URIs de redirecionamento autorizados"**, clique em **+ Adicionar
   URI** duas vezes e cole, uma em cada linha:
   ```
   http://localhost:3000/api/auth/google/callback
   https://www.ibiaranoticias.com/api/auth/google/callback
   ```
   (o primeiro é pra testar no seu computador; o segundo é o domínio real
   do site — assim o login com Google funciona nos dois lugares.)
6. Clique em **Criar**.
7. Vai abrir uma janela mostrando **Client ID** e **Client Secret** —
   não feche ainda.

## Passo 4 — Colocar no projeto (você mesma, direto no arquivo)

1. No VS Code, abra o arquivo **`.env`** na raiz do projeto (se não
   existir, copie o `.env.example` e renomeie pra `.env`).
2. Preencha essas duas linhas com os valores que apareceram no Passo 3:
   ```
   GOOGLE_CLIENT_ID=cole-aqui-o-client-id
   GOOGLE_CLIENT_SECRET=cole-aqui-o-client-secret
   ```
3. Salve o arquivo.

Feito isso, é só me avisar **"coloquei as credenciais do Google"** (sem
precisar colar os valores aqui no chat) que eu termino de plugar o botão
"Entrar com Google" no código, usando o que já está salvo no `.env`.

---

## Por que fazer assim (e não me mandar os valores aqui)?

O Client Secret funciona como uma senha da sua aplicação — não é sua
senha pessoal do Google, mas ainda assim é melhor prática não colar
esse tipo de credencial em conversas. Como o arquivo `.env` já está no
`.gitignore` (não vai pro GitHub) e você mesma edita ele direto no
VS Code, eu consigo usar o valor sem nunca precisar vê-lo.
