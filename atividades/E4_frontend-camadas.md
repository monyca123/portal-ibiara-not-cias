# Encontro 4 — Frontend em camadas consumindo a API

## Arquitetura aplicada (mesmo padrão do backend)

```
public/js/
  config.js          URL base da API (unico lugar pra mudar)
  api.js             Camada HTTP: fetch + helper request() (erros + 204 sem corpo)
  services/
    categoriaService.js   valida e chama api.js
    noticiaService.js
    authService.js
  ui/
    categoriaView.js      renderiza lista/form de categorias, sem saber de API
    noticiaView.js         renderiza tabela/modal de noticias + dropdown de categoria
  app.js / admin.js / noticia.js / login.js   orquestradores (1 por pagina)
```

Evento (clique/submit) → orquestrador → service (valida) → api (fetch) →
API REST (E3) → retorno → view (re-renderiza o DOM).

## Entidades do Mãos à Obra

- **Categoria** (equivalente ao "Cliente" do tutorial): listar + criar + remover,
  no painel `/admin.html`.
- **Notícia** (equivalente à "Conta"): listar + criar + remover + **editar** +
  `<select>` que carrega as categorias — o mesmo relacionamento Conta→Cliente
  do exemplo do professor, só que Notícia→Categoria.

## CORS

Adicionado `cors()` no `app.js` do backend, antes das rotas, conforme pedido
no tutorial — mesmo o projeto rodando em **origem única** (ver abaixo).

## Por que não usei dois processos (`:5500` + `:3000`)?

O tutorial usa `http-server` na porta 5500 pro frontend e Express na 3000
pro backend, exigindo CORS pra eles conversarem. Neste projeto o Express já
serve o `public/` como estático (`express.static`) desde o Encontro 1 — ou
seja, frontend e API já vivem na **mesma origem** (`localhost:3000`), então
CORS não é estritamente necessário aqui. Mantive o `cors()` mesmo assim
(inofensivo e documenta a lição), mas não subi um segundo servidor porque
isso reintroduziria duas origens sem necessidade real para este projeto —
a arquitetura de camadas (que é o objetivo de aprendizagem do encontro) é
a mesma dos dois jeitos.

## Testado no navegador (DevTools)

- Categoria: criar "Cultura" (POST 201) → aparece na lista e no dropdown do
  formulário de notícia → removida (DELETE 204)
- Notícia: listagem, criação, edição e exclusão continuam funcionando após
  a troca de `fetch()` direto por `api.js`/`services/`
- Home e página de detalhe (incluindo comentários) testadas sem erros de
  console após o refactor
