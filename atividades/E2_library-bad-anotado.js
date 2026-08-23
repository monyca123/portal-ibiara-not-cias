// ============================================================
// library-bad.js — Mãos à Obra do Encontro 2 (Parte A)
// Sua tarefa: NÃO refatore. Apenas leia e marque os cheiros.
//   Use // SMELL: <nome>    para cada code smell que encontrar
//   Use // VIOLA: <S|O|L|I|D>  para cada princípio SOLID violado
// Há propositadamente cheiros suficientes para preencher a página.
// ============================================================

// SMELL: God Class — esta classe conhece livros, usuarios, emprestimos,
//        envio de email e geracao de relatorio. Motivos demais pra existir.
// VIOLA: S — mudar a regra de emprestimo, o texto do email ou o relatorio
//        sao 3 atores diferentes pedindo mudanca na MESMA classe.
class Library {
  constructor() {
    // SMELL: Nomes obscuros (bks, us, lns) — exige adivinhar o dominio
    this.bks = [];
    this.us = [];
    this.lns = [];
  }

  // SMELL: Long Function — um metodo so faz 4 coisas completamente diferentes
  // SMELL: Switch sobre tipo — if/else-if encadeado decidindo o comportamento
  // VIOLA: O — pra adicionar uma nova acao (ex: "renovar"), preciso EDITAR
  //        este metodo (mais um else if) em vez de so estender o sistema
  doStuff(book, userId, action) {
    if (action === 'add') {
      this.bks.push(book);
      console.log('Added: ' + book.t);
    } else if (action === 'lend') {
      // SMELL: Duplicate Code — este loop de "achar por id/titulo" se repete
      //        4 vezes no arquivo (aqui, no return e no overdue)
      // SMELL: Feature Envy — mexe direto nos campos internos de book/user
      //        em vez de esses objetos terem comportamento proprio
      var u = null;
      for (var i = 0; i < this.us.length; i++) {
        if (this.us[i].id === userId) { u = this.us[i]; }
      }
      var b = null;
      for (var j = 0; j < this.bks.length; j++) {
        if (this.bks[j].t === book.t) { b = this.bks[j]; }
      }
      if (u != null && b != null && b.cp > 0) {
        b.cp = b.cp - 1;
        // SMELL: Primitive Obsession — livro identificado pelo titulo (string
        //        crua) em vez de um id proprio; nada garante titulos unicos
        this.lns.push({ uid: userId, bt: book.t, d: new Date(), st: 1 });
        // SMELL: Magic Numbers/Strings — 1/2/3 sem nome, so explicados
        //        por um comentario ao lado (o comentario e sintoma do smell)
        // SMELL: Comments as deodorant — o comentario abaixo tenta compensar
        //        os numeros magicos em vez de o codigo resolver isso sozinho
        // 1 = active, 2 = returned, 3 = overdue

        // VIOLA: D — chama a API de email diretamente aqui dentro. Pra testar
        //        "emprestar livro" eu sou obrigada a bater numa API real.
        // SMELL: Dead Code — callback de sucesso vazio, nao faz nada
        fetch('http://email.api/send', {
          method: 'POST',
          body: JSON.stringify({ to: u.em, msg: 'Você pegou ' + book.t })
        }).then(r => { /* nada */ }).catch(e => {});
        // SMELL: Dead Code / erro silencioso — catch vazio engole qualquer
        //        falha de rede sem log nem tratamento (o "Knight Capital" do E2)
      }
    } else if (action === 'return') {
      // SMELL: Duplicate Code — de novo o mesmo padrao de loop + if de achar
      for (var k = 0; k < this.lns.length; k++) {
        if (this.lns[k].uid === userId && this.lns[k].bt === book.t && this.lns[k].st === 1) {
          this.lns[k].st = 2; // SMELL: Magic Number (status sem nome)
          for (var m = 0; m < this.bks.length; m++) {
            if (this.bks[m].t === book.t) { this.bks[m].cp = this.bks[m].cp + 1; }
          }
        }
      }
    } else if (action === 'overdue') {
      // SMELL: Duplicate Code — outra vez o mesmo loop de "achar usuario por id"
      for (var n = 0; n < this.lns.length; n++) {
        var diff = (new Date() - this.lns[n].d) / (1000 * 60 * 60 * 24);
        // SMELL: Magic Number — "7" (dias de tolerancia) solto no meio da logica
        if (this.lns[n].st === 1 && diff > 7) {
          this.lns[n].st = 3;
          var usr = null;
          for (var p = 0; p < this.us.length; p++) {
            if (this.us[p].id === this.lns[n].uid) { usr = this.us[p]; }
          }
          if (usr) {
            // VIOLA: D — de novo, dependencia direta e concreta da API de email
            fetch('http://email.api/send', {
              method: 'POST',
              body: JSON.stringify({ to: usr.em, msg: 'Atrasado: ' + this.lns[n].bt })
            });
          }
        }
      }
    }
  }

  // SMELL: Long Parameter List — 8 parametros posicionais, facil trocar a
  //        ordem por engano (ph com zp, por exemplo) sem o codigo reclamar
  // SMELL: Data Clumps — (addr, cty, st, zp) sempre andam juntos: é um
  //        Endereco disfarçado de 4 parametros soltos
  // SMELL: Primitive Obsession — email, telefone e cep sao strings cruas,
  //        sem validacao nem tipo proprio
  registerUser(n, e, ph, addr, cty, st, zp, isAdm) {
    this.us.push({ id: this.us.length + 1, n: n, em: e, ph: ph, addr: addr, cty: cty, st: st, zp: zp, isAdm: isAdm });
  }

  // SMELL: Switch sobre tipo — outro if/else-if fazendo o papel de um switch
  // SMELL: Magic Numbers — 1/2/3 aqui sao "tipos de relatorio" sem nome
  // VIOLA: O — todo novo tipo de relatorio exige editar este metodo
  report(type) {
    if (type === 1) {
      console.log('Total de livros: ' + this.bks.length);
    } else if (type === 2) {
      console.log('Total de usuários: ' + this.us.length);
    } else if (type === 3) {
      console.log('Total de empréstimos: ' + this.lns.length);
    }
  }
}

// Nao ha heranca neste arquivo, entao LSP nao se aplica diretamente aqui.
// ISP: qualquer codigo que so precise do report() (ex.: um dashboard) e
// obrigado a carregar a classe inteira — que tambem sabe emprestar livro,
// devolver, calcular atraso e mandar email. Um "cliente" read-only depende
// de metodos que nunca vai usar.

// Uso:
const lib = new Library();
lib.registerUser('Ana', 'ana@uepb.edu.br', '83999990000', 'Rua X, 10', 'Patos', 'PB', '58700-000', false);
lib.doStuff({ t: 'Clean Code', cp: 3 }, null, 'add');
lib.doStuff({ t: 'Clean Code' }, 1, 'lend');
lib.report(1);

// ============================================================
// Discussao da dupla: qual seria a 1a refatoracao?
//
// A de maior alavancagem: extrair os 4 ramos de doStuff() em metodos
// separados (adicionarLivro, emprestar, devolver, verificarAtraso) —
// ataca Long Function + God Class + a violacao de OCP de uma vez, e
// deixa duplicacao dos loops de busca visivel o suficiente pra depois
// virar um so metodo findUserById/findBookByTitle (Duplicate Code).
// Deixaria a injecao do cliente de email (DIP) pra um segundo passo,
// depois que a classe ja estiver dividida.
// ============================================================
