import { noticiaService } from './services/noticiaService.js';
import { obterSessao } from './sessao.js';

const conteudoEl = document.getElementById('noticia-conteudo');
const comentariosEl = document.getElementById('lista-comentarios');
const promptLoginEl = document.getElementById('prompt-login');
const formComentarioEl = document.getElementById('form-comentario');
const comentarioUsuarioEl = document.getElementById('comentario-usuario');
const comentarioErroEl = document.getElementById('comentario-erro');
const btnEnviarEl = document.getElementById('btn-enviar-comentario');

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function imagemSegura(url) {
  if (url && /^https?:\/\//i.test(url)) return url;
  return 'https://placehold.co/900x400?text=Ibiara+Noticias';
}

const params = new URLSearchParams(window.location.search);
const noticiaId = params.get('id');

const sessao = obterSessao();
if (sessao) {
  promptLoginEl.classList.add('d-none');
  formComentarioEl.classList.remove('d-none');
  comentarioUsuarioEl.textContent = sessao.nome;
} else {
  promptLoginEl.classList.remove('d-none');
  formComentarioEl.classList.add('d-none');
  const voltar = encodeURIComponent(window.location.pathname + window.location.search);
  document.getElementById('link-entrar').href = `leitor-entrar.html?voltar=${voltar}`;
  document.getElementById('link-cadastro').href = `leitor-cadastro.html?voltar=${voltar}`;
}

async function carregarNoticia() {
  if (!noticiaId) {
    conteudoEl.innerHTML = '<p class="text-danger">Notícia não encontrada.</p>';
    return;
  }

  let noticia;
  try {
    noticia = await noticiaService.buscarPorId(noticiaId);
  } catch (_) {
    conteudoEl.innerHTML = '<p class="text-danger">Notícia não encontrada.</p>';
    return;
  }

  document.title = `${noticia.titulo} — Ibiara Notícias`;

  const data = new Date(noticia.criadoEm).toLocaleString('pt-BR');
  conteudoEl.innerHTML = `
    <h1 class="mb-2">${escapeHtml(noticia.titulo)}</h1>
    <p class="text-muted small">Por ${escapeHtml(noticia.autorNome)} • ${data} • 👁 ${noticia.visualizacoes} visualizações</p>
    <img src="${imagemSegura(noticia.imagemUrl)}" class="img-fluid rounded my-3" alt="${escapeHtml(noticia.titulo)}" />
    <div class="fs-5" style="white-space: pre-line;">${escapeHtml(noticia.conteudo)}</div>
  `;

  renderizarComentarios(noticia.comentarios);
}

function renderizarComentarios(comentarios) {
  if (!comentarios || comentarios.length === 0) {
    comentariosEl.innerHTML = '<p class="text-muted">Seja o primeiro a comentar.</p>';
    return;
  }
  comentariosEl.innerHTML = comentarios
    .map(
      (c) => `
      <div class="border-bottom py-2">
        <strong>${escapeHtml(c.autorNome)}</strong>
        <span class="text-muted small ms-2">${new Date(c.criadoEm).toLocaleString('pt-BR')}</span>
        <p class="mb-0">${escapeHtml(c.texto)}</p>
      </div>`
    )
    .join('');
}

formComentarioEl.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  comentarioErroEl.classList.add('d-none');
  const texto = formComentarioEl.elements.texto.value;

  btnEnviarEl.disabled = true;
  btnEnviarEl.textContent = 'Enviando...';
  try {
    await noticiaService.comentar(noticiaId, texto);
    formComentarioEl.reset();
    await carregarNoticia();
  } catch (err) {
    comentarioErroEl.textContent = err.message;
    comentarioErroEl.classList.remove('d-none');
  } finally {
    btnEnviarEl.disabled = false;
    btnEnviarEl.textContent = 'Enviar comentário';
  }
});

carregarNoticia();
