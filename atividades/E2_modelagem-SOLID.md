# Encontro 2 — Modelagem do Projeto 1 com SOLID em mente

## 1. Classes do domínio (recap do E1)

`Usuario` (abstrata) → `Autor`, `Administrador` · `Categoria` · `Noticia` → `Comentario`

## 2. SRP — um motivo para mudar, por classe

| Classe | Único motivo para mudar |
|---|---|
| `Usuario` / `Autor` / `Administrador` | Regras de identidade e permissão de quem publica |
| `Categoria` | Regras de classificação (nome, tipo local/geral) |
| `Noticia` | Regras de uma matéria (título, conteúdo, publicação, visualizações) |
| `Comentario` | Regra de um comentário isolado |
| `JsonRepository` | Como persistir/ler qualquer entidade em arquivo JSON |
| `NoticiaRepository` / `CategoriaRepository` / `UsuarioRepository` | Consultas específicas de cada entidade (ex.: `buscarPorEmail`) |
| `routes/*.js` | Tradução HTTP ↔ chamadas ao domínio (não sabe onde os dados são salvos) |
| `server.js` | *Composition root*: monta o app e decide **quais** implementações concretas usar |

Sem essa separação, uma mudança na regra de e-mail de login, no formato de
armazenamento e no formato da resposta HTTP cairiam todas na mesma classe —
exatamente o problema do `library-bad.js` (Parte A).

## 3. DIP — quem depende de quem (setas → abstrações)

```
routes/noticias.js  ──depende de──▶  "algo com listar/buscarPorId/adicionar/atualizar/remover"
routes/categorias.js ──depende de──▶  "algo com listar/buscarPorId/adicionar/atualizar/remover"
routes/auth.js        ──depende de──▶  "algo com buscarPorEmail"

server.js (composition root)
   cria NoticiaRepository, CategoriaRepository, UsuarioRepository
   injeta cada um dentro da rota correspondente
   └─▶ criarRotasNoticias(noticiaRepo)
   └─▶ criarRotasCategorias(categoriaRepo)
   └─▶ criarRotasAuth(usuarioRepo)
```

As rotas nunca fazem `import NoticiaRepository from '...'` nem `new
NoticiaRepository()` — elas recebem a instância pronta como parâmetro
(injeção via função de fábrica, já que JavaScript puro não tem interfaces).
Isso é o mesmo padrão do slide "DEPOIS" do DIP: se um dia trocarmos o JSON
por um banco relacional, só `server.js` muda — nenhuma rota, nenhum modelo.

**Antes desta refatoração** (Encontro 1), cada arquivo de rota fazia `new
NoticiaRepository()` na primeira linha — funcionava, mas violava DIP do
mesmo jeito que o slide 9 mostra (`require('./postgres-db')` direto na
classe de negócio). Ver commit `refactor: injeta repositorios via
composition root (DIP)`.

## 4. Fluxo de branches usado neste encontro

```
main
 └── develop
      └── feature/modelagem   (este documento + refatoração DIP)
```

PR aberto de `feature/modelagem` → `develop` com esta modelagem e o ajuste
de DIP nas rotas.
