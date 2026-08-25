# Relatório de Avaliação Heurística — Projeto 1

Autor: Monyca
Data: 24/06/2026
Score Lighthouse (Acessibilidade): *ver nota no final — rodar localmente*

## Problema 1
- Onde: Painel admin (`admin.html`), formulário "+ Nova categoria"
- O que observei: os campos de nome e tipo da categoria usam só `placeholder`,
  sem `<label>` associado. Quem usa leitor de tela não sabe o que cada campo
  representa assim que o placeholder some (ao digitar).
- Heurística violada: acessibilidade / #6 Reconhecer em vez de lembrar
- Gravidade: 3
- Correção proposta: adicionar `<label>` visível (ou `aria-label`) em cada
  campo do formulário de categoria, igual já é feito no formulário de notícia.
- Evidência: `public/admin.html`, linhas 30-43

## Problema 2
- Onde: Painel admin, botões de exclusão
- O que observei: o botão de remover **categoria** apaga direto, sem
  confirmação. Já o botão de excluir **notícia** pede confirmação
  (`confirm(...)`). Duas ações destrutivas parecidas, comportamentos
  diferentes.
- Heurística violada: #3 Controle e liberdade / #4 Consistência e padrões
- Gravidade: 3
- Correção proposta: pedir confirmação também antes de remover categoria.
- Evidência: `public/js/ui/categoriaView.js` (sem confirm) vs
  `public/js/admin.js`, função `removerNoticia` (com confirm)

## Problema 3
- Onde: Toda a aplicação (home, detalhe, admin)
- O que observei: ao criar, editar ou remover algo, o botão continua clicável
  e não existe nenhum indicador de "carregando" enquanto o `fetch` está em
  andamento. Numa conexão lenta, a pessoa não sabe se o clique funcionou e
  pode clicar de novo.
- Heurística violada: #1 Visibilidade do status (específico de SPA)
- Gravidade: 3
- Correção proposta: desabilitar o botão e mostrar um texto tipo
  "Salvando..." durante a requisição.
- Evidência: `public/js/admin.js`, funções `criarCategoria`, `salvarNoticia`

## Problema 4
- Onde: Listas dinâmicas (`#lista-noticias`, `#lista-categorias`,
  `#tabela-noticias`, `#lista-comentarios`)
- O que observei: nenhuma dessas listas tem `aria-live="polite"`. Quando o
  JavaScript atualiza a lista depois de criar/remover algo, um leitor de
  tela não é avisado da mudança.
- Heurística violada: acessibilidade (específico de SPA)
- Gravidade: 2
- Correção proposta: adicionar `aria-live="polite"` no contêiner de cada
  lista que é reescrita via JS.
- Evidência: `public/index.html`, `public/admin.html`, `public/noticia.html`

## Problema 5
- Onde: Painel admin, depois de remover uma notícia ou categoria
- O que observei: o foco do teclado não é reposicionado depois da remoção —
  o elemento que tinha foco (o botão "Excluir") é removido do DOM junto com
  a linha, e o navegador joga o foco de volta pro topo da página (`<body>`),
  sem aviso.
- Heurística violada: acessibilidade / gestão de foco (específico de SPA)
- Gravidade: 2
- Correção proposta: depois de remover um item, mover o foco pro título da
  seção ou pro próximo item da lista.
- Evidência: `public/js/admin.js`, funções `removerCategoria`/`removerNoticia`

## Problema 6
- Onde: `public/js/api.js`, tratamento de erro genérico
- O que observei: quando a API responde com erro sem um corpo JSON com a
  chave `erro` (ex.: falha de rede, erro 500 sem handler), a mensagem
  mostrada pro usuário é literalmente `"Erro 500"` — jargão técnico, sem
  explicação do que aconteceu ou o que fazer.
- Heurística violada: #2 Correspondência com o mundo real / #9 Reconhecer
  e resolver erros
- Gravidade: 2
- Correção proposta: trocar por uma mensagem genérica em linguagem humana,
  tipo "Algo deu errado, tente novamente em instantes."
- Evidência: `public/js/api.js`, função `request`

## Problema 7
- Onde: Toda a aplicação
- O que observei: não existe nenhum atalho de teclado ou ação em lote
  (ex.: publicar várias notícias de uma vez). Para quem usa o painel com
  frequência, cada ação exige vários cliques.
- Heurística violada: #7 Flexibilidade e eficiência de uso
- Gravidade: 1 (cosmético/menor — não é bloqueante)
- Correção proposta: fora do escopo do Projeto 1; anotar como melhoria
  futura, não prioritária agora.
- Evidência: observação geral da interface

## Resumo
- Total de problemas: 7
- Problemas de gravidade 3 (prioritários): 3 (labels ausentes, confirmação
  inconsistente ao excluir, ausência de loading state)
- Score de acessibilidade (Lighthouse): não medido automaticamente neste
  relatório — para gerar, abra `http://localhost:3000` no Chrome, F12 →
  aba **Lighthouse** → marque **Accessibility** → *Analyze page load*
- Os 3 que vou corrigir primeiro (na versão React do Projeto 2, E8/E9):
  1. Adicionar `<label>` em todos os campos de formulário
  2. Confirmação consistente antes de qualquer exclusão
  3. Estado de carregando visível durante requisições à API
