# Encontro 3 — Testes da API em camadas

Testado via `curl` (alternativa explicitamente aceita pelo tutorial do E3
para quem prefere terminal em vez de Thunder Client/Postman).

| # | Método | Rota | Esperado | Obtido |
|---|---|---|---|---|
| 1 | GET | `/` | 200 | 200 |
| 2 | GET | `/api/noticias` | 200 | 200 |
| 3 | GET | `/api/categorias` | 200 | 200 |
| 4 | GET | `/api/noticias/id-invalido` | 404 | 404 |
| 5 | POST | `/api/categorias` (válida) | 201 | 201 |
| 6 | POST | `/api/noticias` (título curto) | 400 | 400 |
| 7 | POST | `/api/categorias` (tipo inválido) | 400 | 400 |
| 8 | DELETE | `/api/categorias/:id` | 204 | 204 |
| 9 | POST | `/api/auth/login` (credenciais corretas) | 200 | 200 |
| 10 | POST | `/api/auth/login` (credenciais erradas) | 401 | 401 |

Os testes 6, 7 e 10 confirmam que os **erros lançados pelos services** (com
`err.status`) chegam corretos ao cliente através do `errorHandler`
centralizado — sem nenhum `try/catch` dentro dos controllers.

## Arquitetura aplicada

```
Route  (src/routes/*.js)        → só mapeia URL + verbo HTTP para o controller
Controller (src/controllers/*)  → lê req, chama o service, monta a resposta
Service (src/services/*.js)     → regras de negócio, lança erros com status
Repository (src/repositories/*) → papel do "model" do tutorial: dados + acesso
Middleware (src/middleware/*)   → logger (toda requisição) + errorHandler (final)
```

`app.js` monta tudo (composição); `server.js` só chama `listen()`.
