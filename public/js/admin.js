import { categoriaService } from './services/categoriaService.js';
import { noticiaService } from './services/noticiaService.js';
import { categoriaView } from './ui/categoriaView.js';
import { noticiaView } from './ui/noticiaView.js';
import { moderacaoView } from './ui/moderacaoView.js';
import { obterSessao, encerrarSessao } from './sessao.js';

const usuarioLogado = obterSessao();
if (!usuarioLogado || usuarioLogado.papel === 'leitor') {
  window.location.href = 'login.html';
}

const alerta = document.querySelector('#alerta-admin');
function mostrarErro(msg) {
  alerta.textContent = msg;
  alerta.classList.remove('d-none');
}
function limparErro() {
  alerta.classList.add('d-none');
  alerta.textContent = '';
}

document.querySelector('#usuario-logado').textContent = `${usuarioLogado.nome} (${usuarioLogado.papel})`;
document.querySelector('#btn-sair').addEventListener('click', () => {
  encerrarSessao();
  window.location.href = 'login.html';
});

async function atualizarCategorias() {
  const categorias = await categoriaService.listar();
  categoriaView.renderLista(categorias, removerCategoria);
  noticiaView.setCategorias(categorias);
  return categorias;
}

async function criarCategoria(dados) {
  limparErro();
  try {
    await categoriaService.criar(dados);
    categoriaView.limparForm();
    await atualizarCategorias();
  } catch (err) {
    mostrarErro(err.message);
  }
}

async function removerCategoria(id) {
  limparErro();
  if (!confirm('Remover esta categoria? Só é possível se não houver notícias vinculadas a ela.')) return;
  try {
    await categoriaService.remover(id);
    await atualizarCategorias();
  } catch (err) {
    mostrarErro(err.message);
  }
}

let ultimasNoticias = [];

async function atualizarNoticias() {
  ultimasNoticias = await noticiaService.listar({ todas: 1 });
  noticiaView.renderTabela(ultimasNoticias, editarNoticia, removerNoticia);
  atualizarModeracao();
}

function atualizarModeracao() {
  const comentarios = ultimasNoticias
    .flatMap((n) => n.comentarios.map((c) => ({ ...c, noticiaId: n.id, noticiaTitulo: n.titulo })))
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
  moderacaoView.renderLista(comentarios, removerComentario);
}

async function removerComentario(noticiaId, comentarioId) {
  limparErro();
  if (!confirm('Remover este comentário permanentemente?')) return;
  try {
    await noticiaService.removerComentario(noticiaId, comentarioId);
    await atualizarNoticias();
  } catch (err) {
    mostrarErro(err.message);
  }
}

function editarNoticia(noticia) {
  noticiaView.abrirParaEditar(noticia);
}

async function salvarNoticia(id, dados) {
  limparErro();
  try {
    if (!dados.autorId) {
      dados.autorId = usuarioLogado.id;
      dados.autorNome = usuarioLogado.nome;
    }
    if (id) {
      await noticiaService.atualizar(id, dados);
    } else {
      await noticiaService.criar(dados);
    }
    noticiaView.fecharModal();
    await atualizarNoticias();
  } catch (err) {
    mostrarErro(err.message);
  }
}

async function removerNoticia(id) {
  limparErro();
  if (!confirm('Excluir esta notícia? Essa ação não pode ser desfeita.')) return;
  try {
    await noticiaService.remover(id);
    await atualizarNoticias();
  } catch (err) {
    mostrarErro(err.message);
  }
}

categoriaView.onSubmit(criarCategoria);
noticiaView.onSubmit(salvarNoticia);
noticiaView.onNovaNoticia(() => noticiaView.abrirParaCriar());

async function iniciar() {
  try {
    await atualizarCategorias();
    await atualizarNoticias();
  } catch (err) {
    mostrarErro('Nao consegui falar com a API.');
  }
}
iniciar();
