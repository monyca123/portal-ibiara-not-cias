# 📰 Ibiara Notícias

Portal de notícias locais (Ibiara/PB e região do Cariri) e gerais, desenvolvido como
**Projeto 1 — Fullstack Básico** da disciplina de Programação Web (UEPB, 2026.1).

Aplicação fullstack com API REST em Node.js/Express, persistência em **SQLite**
(SQL puro, sem ORM) e frontend em HTML/CSS/Bootstrap, construída em cima de um
modelo de domínio orientado a objetos que aplica os quatro pilares da POO.

## Sumário

- [Ideia do projeto](#ideia-do-projeto)
- [Modelagem do domínio](#modelagem-do-domínio)
- [Os quatro pilares da POO aplicados](#os-quatro-pilares-da-poo-aplicados)
- [Arquitetura](#arquitetura)
- [Como rodar](#como-rodar)
- [Rotas da API](#rotas-da-api)
- [Limitações conhecidas](#limitações-conhecidas)

## Ideia do projeto

Um portal de notícias para o município de Ibiara (PB) e região, com duas frentes de
conteúdo: notícias **locais** (Ibiara e Cariri paraibano) e notícias **gerais**
(política, economia, esportes nacionais). Jornalistas autenticados publicam e
gerenciam notícias por um painel administrativo; leitores navegam, filtram por
categoria/tipo e comentam nas matérias.

## Modelagem do domínio

```
Usuario (abstrata)
 ├── Autor
 ├── Administrador
 └── Leitor         (só permissão de comentar — cadastro público)

Categoria

Noticia
 └── Comentario  (composição — comentário não existe sem a notícia; e
                  exige um Leitor autenticado, papel(): 'leitor')
```

**Relações entre classes:**

| Relação | Exemplo | Tipo |
|---|---|---|
| Herança | `Autor` e `Administrador` herdam de `Usuario` | é-um |
| Composição | `Noticia` contém `Comentario`s | se a notícia é excluída, os comentários somem junto |
| Agregação | `Noticia` referencia uma `Categoria` | a categoria existe independente da notícia |
| Associação | `Noticia` referencia o `Autor` que a escreveu | ambos existem de forma independente |

## Os quatro pilares da POO aplicados

- **Encapsulamento** — todos os atributos dos modelos (`Usuario`, `Noticia`,
  `Categoria`, `Comentario`) são campos privados (`#campo`), acessados só por
  getters/métodos públicos. Veja [`src/models/Noticia.js`](src/models/Noticia.js).
- **Herança** — `Autor` e `Administrador` estendem `Usuario`, reaproveitando
  atributos (`nome`, `email`, `senhaHash`) e a serialização base.
- **Polimorfismo** — `permissoes()` e `papel()` têm implementações diferentes em
  `Autor`, `Administrador` e `Leitor`; o código que consome `Usuario` (como o
  middleware de autenticação) não precisa saber qual subclasse está tratando.
- **Abstração** — `Usuario` é uma classe abstrata: `new Usuario(...)` lança erro
  (verificado via `new.target`), só suas subclasses podem ser instanciadas.

## Arquitetura

```
src/
  db.js            Conexão SQLite (node:sqlite) + schema (CREATE TABLE)
  models/          Classes de domínio (POO)
  repositories/     SQL puro (prepared statements) — papel de "model" do E3/E5
  services/          Regras de negócio, lançam erros com status HTTP
  controllers/         Lê req, chama o service, monta a resposta
  routes/                Mapeamento URL + verbo HTTP → controller
  middleware/              logger + errorHandler + auth (exigirLogin/exigirAdmin)
  utils/token.js             Emite e verifica os tokens de login (JWT)
  utils/googleClient.js       Configura o OAuth2Client do login com Google
  app.js                     Composição: middleware + rotas + error handler
  server.js                    Só o listen()
  seed.js                        Popula dados iniciais de demonstração
public/
  index.html         Página inicial (lista + filtro de notícias)
  noticia.html        Detalhe da notícia + comentários (exige leitor logado)
  login.html          Login de jornalista/administrador
  leitor-entrar.html   Login de leitor (comentar)
  leitor-cadastro.html  Cadastro de leitor
  admin.html             Painel: notícias, categorias e moderação de comentários
  js/
    config.js            URL base da API
    api.js               Camada HTTP (fetch + token automático + erro/204)
    sessao.js             Onde fica salvo quem está logado (staff x leitor)
    services/              Validação + chamada à api.js
    ui/                     Views: renderizam o DOM, não sabem de HTTP
    app.js / admin.js / noticia.js / login.js / leitor-entrar.js / leitor-cadastro.js
```

## Como rodar

Pré-requisitos: **Node.js 22+** (`node --version`) — usa o módulo nativo
`node:sqlite`, ainda experimental (por isso os scripts já incluem a flag
`--experimental-sqlite`).

```bash
npm install
npm run seed    # cria banco.db e popula categorias, usuários e notícias de exemplo
npm start
```

Acesse `http://localhost:3000`. Os dados ficam em `banco.db` (SQLite, fora do
Git) — pare o servidor e suba de novo para confirmar que persistem.

Copie `.env.example` para `.env` antes de rodar em produção e gere uma
`JWT_SECRET` própria (o `.env` local de desenvolvimento já vem com uma
gerada automaticamente).

**Login de demonstração** (painel `/admin.html`):
- Administrador: `admin@ibiaranoticias.com.br` / `admin123`
- Autora: `maria@ibiaranoticias.com.br` / `autora123`

**Comentar** (`/leitor-cadastro.html`) é aberto a qualquer pessoa — cria
uma conta de leitor com email e senha.

## Rotas da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/noticias` | — | Lista notícias publicadas (filtros: `categoriaId`, `todas`) |
| GET | `/api/noticias/:id` | — | Detalhe de uma notícia (incrementa visualizações) |
| POST | `/api/noticias` | staff | Cria notícia |
| PUT | `/api/noticias/:id` | staff | Atualiza notícia |
| DELETE | `/api/noticias/:id` | staff | Remove notícia |
| POST | `/api/noticias/:id/comentarios` | leitor | Adiciona comentário (nome vem da conta logada) |
| DELETE | `/api/noticias/:id/comentarios/:comentarioId` | admin | Remove comentário (moderação) |
| GET | `/api/categorias` | — | Lista categorias |
| POST | `/api/categorias` | staff | Cria categoria |
| PUT | `/api/categorias/:id` | staff | Atualiza categoria |
| DELETE | `/api/categorias/:id` | staff | Remove categoria (409 se houver notícias vinculadas) |
| POST | `/api/auth/login` | — | Autentica (autor/administrador/leitor) e devolve um token |
| POST | `/api/auth/registro` | — | Cadastra um novo jornalista (papel `autor`) |
| POST | `/api/auth/registro-leitor` | — | Cadastra um novo leitor (só pode comentar) |
| GET | `/api/auth/google` | — | Redireciona para o login do Google |
| GET | `/api/auth/google/callback` | — | Volta do Google, cria/loga o leitor e emite o token |
| GET | `/api/configuracao` | — | Lê o vídeo em destaque atual (canal/vídeo do YouTube) |
| PUT | `/api/configuracao` | admin | Define o vídeo em destaque da home |

Rotas marcadas **staff** exigem `Authorization: Bearer <token>` de um
`autor`/`administrador`; **leitor** aceita qualquer papel autenticado;
**admin** exige especificamente `administrador`.

Regras de integridade aplicadas pelo banco (SQLite, `FOREIGN KEY` +
`PRAGMA foreign_keys = ON`): criar/editar notícia com `categoriaId`
inexistente → `422`; remover categoria com notícias vinculadas → `409`.

## Autenticação

Login real, verificado no servidor: `POST /api/auth/login` devolve um token
**JWT** assinado com `JWT_SECRET`, válido por 7 dias. O front guarda esse
token (`sessionStorage` para staff, `localStorage` para leitor — por isso o
leitor não precisa logar de novo a cada aba) e o `api.js` anexa
`Authorization: Bearer <token>` em toda chamada automaticamente. O
middleware `exigirLogin` valida o token e recarrega o usuário do banco a
cada requisição; `exigirAdmin` restringe ainda mais (usado na moderação).

## Login social

**Google já está ativo** — `GET /api/auth/google` leva ao consentimento do
Google; a volta (`/api/auth/google/callback`) acha ou cria a conta de
`Leitor` pelo email e emite o mesmo token JWT do login por senha. Precisa
de `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` no `.env` (veja
`atividades/google-oauth-passo-a-passo.md` para gerar as credenciais).

**Instagram** ainda não está — hoje passa pelo Meta/Facebook Login, que
exige **revisão do app pela Meta** (dias, com política de privacidade e
verificação de negócio) para funcionar com qualquer usuário público, não
só desenvolvedores/testadores cadastrados.

## Vídeo em destaque (YouTube)

A home mostra um vídeo do YouTube em destaque, configurável pelo admin em
`/admin.html` sem precisar mexer no código:

- **ID do canal** preenchido → mostra a **live atual do canal**
  automaticamente (`youtube.com/embed/live_stream?channel=...`) — ideal
  pra transmissão diária, nunca precisa atualizar na mão.
- **Vídeo específico** preenchido → esse vídeo aparece no lugar da live
  (o admin pode colar o link completo do YouTube; o ID é extraído
  automaticamente).
- Nenhum dos dois preenchido → a seção de vídeo simplesmente não aparece.

Guardado numa única linha da tabela `configuracoes` (sem tabela nova por
campo — é literalmente "configuração do site", não conteúdo do domínio).

## Limitações conhecidas

Projeto acadêmico evoluindo para um caso de uso real — autenticação e
autorização já são reais (JWT no backend), mas ainda não há: rate limiting
contra força bruta no login, envio de email (recuperação de senha,
confirmação de cadastro) nem upload de imagem (a notícia usa uma URL
externa em vez de arquivo).
