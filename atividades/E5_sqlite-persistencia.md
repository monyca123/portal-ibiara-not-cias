# Encontro 5 — Persistência com SQLite

## O que mudou

Só a camada `repositories/` (o "model" do E3) foi reescrita com SQL puro,
usando o módulo nativo `node:sqlite`. **`services/`, `controllers/` e
`routes/` não mudaram uma linha** — essa é a prova viva do DIP: como as
camadas acima dependem apenas da interface do repositório (`listar`,
`buscarPorId`, `adicionar`, `atualizar`, `remover`, ...), trocar o array em
JSON por SQLite não teve efeito cascata.

## Schema (`src/db.js`)

- `categorias (id, nome, tipo)` — `tipo` restrito a `local`/`geral` via `CHECK`
- `usuarios (id, nome, email UNIQUE, senha_hash, papel, biografia)`
- `noticias (id, titulo, resumo, conteudo, categoria_id, autor_id, ...)` —
  `FOREIGN KEY (categoria_id) REFERENCES categorias(id)`
- `comentarios (id, noticia_id, autor_nome, texto, criado_em)` —
  `FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE`
  (reflete a composição Notícia→Comentário definida no E2: o comentário não
  sobrevive à notícia)

`PRAGMA foreign_keys = ON` habilita a integridade referencial (desligada por
padrão no SQLite). Todas as queries usam **prepared statements** (`?`) —
nenhuma concatenação de string, logo nenhuma superfície de SQL Injection.

## Node 22+ obrigatório

`node:sqlite` é experimental nesta versão do Node e exige a flag
`--experimental-sqlite`, já embutida nos scripts do `package.json`
(`npm start`, `npm run dev`, `npm run seed`).

## Testes realizados

| # | Teste | Resultado |
|---|---|---|
| 1 | CRUD completo de categorias e notícias | OK |
| 2 | Criar notícia com `categoriaId` inexistente | `422` (nova regra, alinhada ao padrão do E3) |
| 3 | Criar categoria com `tipo` inválido | `400` |
| 4 | Remover categoria **com** notícias vinculadas | `409` (FK real barra a exclusão) |
| 5 | Remover categoria **sem** notícias vinculadas | `204` |
| 6 | Remover notícia com comentário → comentário some junto | `204` (prova do `ON DELETE CASCADE`) |
| 7 | **Persistência**: matar o processo e subir de novo | dados idênticos antes/depois |
| 8 | CRUD completo pelo frontend do E4 (admin.html) | sem erros de console |

## Decisões de projeto

- **IDs continuam UUID (TEXT), não `AUTOINCREMENT`** — o domínio já usa
  `randomUUID()` desde o E1 (URLs como `noticia.html?id=<uuid>`); trocar
  para inteiros quebraria links existentes sem necessidade real.
- **`banco.db` no `.gitignore`** — só o schema (`db.js`) é versionado; o
  arquivo de dados é gerado localmente por `npm run seed`.
- Erros de violação de integridade (`FOREIGN KEY constraint failed`) são
  capturados no `service` e traduzidos para status HTTP corretos (`422`
  na criação, `409` na remoção) em vez de vazar a mensagem crua do SQLite.
