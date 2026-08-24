import { categoriaService } from './services/categoriaService.js';
import { noticiaService } from './services/noticiaService.js';
import { categoriaView } from './ui/categoriaView.js';
import { noticiaView } from './ui/noticiaView.js';

const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || 'null');
if (!usuarioLogado) {
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
  sessionStorage.removeItem('usuario');
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
  try {
    await categoriaService.remover(id);
    await atualizarCategorias();
  } catch (err) {
    mostrarErro(err.message);
  }
}

async function atualizarNoticias() {
  const noticias = await noticiaService.listar({ todas: 1 });
  noticiaView.renderTabela(noticias, editarNoticia, removerNoticia);
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
