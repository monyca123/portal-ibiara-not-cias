# Roteiro do vídeo — Ibiara Notícias (Projeto 1)

Alvo: ~6 minutos. Antes de gravar: confirme que o servidor está rodando
(`npm start`) e deixe já abertas, em abas separadas do VS Code, estas 5
arquivos (assim você só clica na aba, sem precisar navegar procurando):

1. `src/models/Usuario.js`
2. `src/routes/noticias.js`
3. `src/controllers/noticiaController.js`
4. `src/services/noticiaService.js`
5. `src/repositories/NoticiaRepository.js`
6. `src/db.js`

---

## PARTE 1 — Abertura (20s)

Olhando pra tela do navegador (home do site):

> "Oi, esse é o meu Projeto 1: o Ibiara Notícias, um portal de notícias
> locais de Ibiara, Paraíba, e notícias gerais. É uma aplicação fullstack
> em Node.js com Express, banco SQLite, e frontend em HTML, CSS e
> Bootstrap. Vou mostrar a aplicação funcionando e depois o código."

## PARTE 2 — Demo da aplicação (1min30)

Só no navegador, sem abrir o VS Code ainda.

1. Filtre por "Local" e "Geral" no topo da home.
2. Abra uma notícia — mostre o número de visualizações e os comentários.
3. Escreva um comentário de teste e envie.
4. Volte, clique em "Área do jornalista", faça login
   (`admin@ibiaranoticias.com.br` / `admin123`).
5. No painel: crie uma categoria, crie uma notícia usando essa categoria
   no dropdown, edite algo, mostre o botão de excluir.

> "Isso aqui é a aplicação funcionando: dá pra ler, comentar, e — logada
> como jornalista — criar, editar e excluir notícias e categorias."

## PARTE 3 — Código: modelo de dados (45s)

**Aba: `src/models/Usuario.js`**

> "Agora o código. Aqui está a classe `Usuario`. Ela é abstrata — olha
> essa parte aqui —"

Aponte:
```js
if (new.target === Usuario) {
  throw new Error('Usuario e uma classe abstrata...');
}
```

> "— isso impede que alguém crie um `Usuario` genérico. Só dá pra criar
> um `Autor` ou um `Administrador`, que são as duas classes que herdam
> dessa aqui."

Aponte um campo privado, tipo `#nome`:

> "E todos os dados ficam guardados em campos privados, com esse `#` na
> frente — só posso acessar por fora através de métodos como `get nome()`.
> Isso protege os dados de serem alterados de qualquer jeito."

## PARTE 4 — Código: como a API está organizada (1min45)

Explique primeiro, sem trocar de aba ainda:

> "A API inteira segue o mesmo fluxo pra qualquer ação: a rota recebe o
> pedido, passa pro controller, o controller chama o service, e o service
> fala com o banco através do repositório. Vou mostrar isso rapidinho,
> arquivo por arquivo, seguindo uma única ação: criar uma notícia."

**Aba: `src/routes/noticias.js`**
> "Essa é a rota. Ela só diz: 'quando chegar um POST em `/api/noticias`,
> chama essa função aqui do controller.' Não tem lógica nenhuma."

**Aba: `src/controllers/noticiaController.js`** (mostre o método `criar`)
> "O controller é bem curto: pega o que veio na requisição, manda pro
> service, e devolve a resposta. Duas linhas."

**Aba: `src/services/noticiaService.js`** (mostre o método `criar`)
> "Aqui é onde ficam as regras de verdade. Por exemplo: antes de criar a
> notícia, eu confiro se a categoria escolhida existe no banco. Se não
> existir, dou um erro claro pro usuário."

**Aba: `src/repositories/NoticiaRepository.js`** (role até o final do arquivo)
> "E esse último arquivo é o único que sabe que existe um banco SQLite —
> ele é quem manda os comandos SQL. Reparem nessa linha aqui no final:"

Aponte:
```js
export default new NoticiaRepository();
```

> "O service nunca cria esse repositório na mão, ele só usa esse aqui
> já pronto. Isso significa que, se eu um dia trocar de banco de dados,
> só esse arquivo muda — nenhum dos outros três precisa ser mexido."

## PARTE 5 — Código: o banco de dados (45s)

**Aba: `src/db.js`**

> "Por fim, esse arquivo cria as tabelas do banco: categorias, usuários,
> notícias e comentários."

Aponte a linha de FOREIGN KEY dentro de `noticias`:
```sql
FOREIGN KEY (categoria_id) REFERENCES categorias(id)
```
> "Notícia tem uma chave estrangeira apontando pra categoria."

Aponte a linha de FOREIGN KEY dentro de `comentarios`:
```sql
FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE
```
> "E comentário aponta pra notícia, com esse `ON DELETE CASCADE` — se eu
> apagar a notícia, os comentários dela somem automaticamente, o próprio
> banco garante isso."

## PARTE 6 — Fechamento (20s)

> "Resumindo: usei os quatro pilares da POO no modelo de dados, organizei
> a API em camadas — rota, controller, service e repositório — e uso um
> banco SQLite de verdade, com chaves estrangeiras garantindo a
> integridade dos dados. O código está no GitHub. Obrigada!"

---

## Dicas rápidas

- Deixe as 6 abas já abertas antes de gravar (lista no topo)
- Grave a Parte 2 (demo) primeiro — é a mais fácil de acertar de primeira
- Errou uma frase? Pausa, respira, continua — dá pra cortar depois
