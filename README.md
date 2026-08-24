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
 └── Administrador

Categoria

Noticia
 └── Comentario  (composição — comentário não existe sem a notícia)
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
  `Autor` e `Administrador`; o código que consome `Usuario` não precisa saber qual
  subclasse está tratando.
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
  middleware/              logger (toda requisição) + errorHandler (final)
  app.js                     Composição: middleware + rotas + error handler
  server.js                    Só o listen()
  seed.js                        Popula dados iniciais de demonstração
public/
  index.html         Página inicial (lista + filtro de notícias)
  noticia.html        Detalhe da notícia + comentários
  login.html          Login de jornalista/administrador
  admin.html           Painel de gestão de notícias e categorias (CRUD)
  js/
    config.js            URL base da API
    api.js               Camada HTTP (fetch + tratamento de erro/204)
    services/             Validação + chamada à api.js
    ui/                    Views: renderizam o DOM, não sabem de HTTP
    app.js / admin.js / noticia.js / login.js   Orquestradores (1 por página)
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

**Login de demonstração** (painel `/admin.html`):
- Administrador: `admin@ibiaranoticias.com.br` / `admin123`
- Autora: `maria@ibiaranoticias.com.br` / `autora123`

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/noticias` | Lista notícias publicadas (filtros: `categoriaId`, `todas`) |
| GET | `/api/noticias/:id` | Detalhe de uma notícia (incrementa visualizações) |
| POST | `/api/noticias` | Cria notícia |
| PUT | `/api/noticias/:id` | Atualiza notícia |
| DELETE | `/api/noticias/:id` | Remove notícia |
| POST | `/api/noticias/:id/comentarios` | Adiciona comentário |
| GET | `/api/categorias` | Lista categorias |
| POST | `/api/categorias` | Cria categoria |
| PUT | `/api/categorias/:id` | Atualiza categoria |
| DELETE | `/api/categorias/:id` | Remove categoria |
| POST | `/api/auth/login` | Autentica usuário (retorna papel e permissões) |

Regras de integridade aplicadas pelo banco (SQLite, `FOREIGN KEY` +
`PRAGMA foreign_keys = ON`): criar/editar notícia com `categoriaId`
inexistente → `422`; remover categoria com notícias vinculadas → `409`.

## Limitações conhecidas

Projeto acadêmico focado em POO e CRUD fullstack — por simplicidade, o login é
client-side (`sessionStorage`) e as rotas de escrita da API não exigem token de
sessão. Não recomendado para produção sem adicionar autenticação/autorização no
backend (ex.: JWT + middleware de proteção nas rotas de escrita).
