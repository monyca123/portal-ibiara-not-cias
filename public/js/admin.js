const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || 'null');
if (!usuarioLogado) {
  window.location.href = 'login.html';
}

const tabelaNoticiasEl = document.getElementById('tabela-noticias');
const selectCategoriaEl = document.getElementById('select-categoria');
const formNoticiaEl = document.getElementById('form-noticia');
const modalNoticiaEl = new bootstrap.Modal(document.getElementById('modal-noticia'));
const usuarioLogadoEl = document.getElementById('usuario-logado');

usuarioLogadoEl.textContent = `${usuarioLogado.nome} (${usuarioLogado.papel})`;

document.getElementById('btn-sair').addEventListener('click', () => {
  sessionStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

document.getElementById('btn-nova-noticia').addEventListener('click', () => {
  formNoticiaEl.reset();
  formNoticiaEl.elements.id.value = '';
  formNoticiaEl.elements.publicada.checked = true;
  document.querySelector('#modal-noticia .modal-title').textContent = 'Nova notícia';
});

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

let categorias = [];

async function carregarCategorias() {
  const resp = await fetch('/api/categorias');
  categorias = await resp.json();
  selectCategoriaEl.innerHTML = categorias
    .map((c) => `<option value="${c.id}">${escapeHtml(c.nome)} (${c.tipo})</option>`)
    .join('');
}

function nomeCategoria(categoriaId) {
  return categorias.find((c) => c.id === categoriaId)?.nome ?? 'Sem categoria';
}

async function carregarNoticias() {
  const resp = await fetch('/api/noticias?todas=1');
  const noticias = await resp.json();

  if (noticias.length === 0) {
    tabelaNoticiasEl.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Nenhuma notícia cadastrada.</td></tr>';
    return;
  }

  tabelaNoticiasEl.innerHTML = noticias
    .map(
      (n) => `
      <tr>
        <td>${escapeHtml(n.titulo)}</td>
        <td>${escapeHtml(nomeCategoria(n.categoriaId))}</td>
        <td>${escapeHtml(n.autorNome)}</td>
        <td>${n.visualizacoes}</td>
        <td><span class="badge ${n.publicada ? 'bg-success' : 'bg-secondary'}">${n.publicada ? 'Publicada' : 'Rascunho'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${n.id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${n.id}">Excluir</button>
        </td>
      </tr>`
    )
    .join('');

  tabelaNoticiasEl.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', () => abrirEdicao(btn.dataset.id, noticias));
  });
  tabelaNoticiasEl.querySelectorAll('.btn-excluir').forEach((btn) => {
    btn.addEventListener('click', () => excluirNoticia(btn.dataset.id));
  });
}

function abrirEdicao(id, noticias) {
  const noticia = noticias.find((n) => n.id === id);
  if (!noticia) return;
  document.querySelector('#modal-noticia .modal-title').textContent = 'Editar notícia';
  formNoticiaEl.elements.id.value = noticia.id;
  formNoticiaEl.elements.titulo.value = noticia.titulo;
  formNoticiaEl.elements.resumo.value = noticia.resumo;
  formNoticiaEl.elements.conteudo.value = noticia.conteudo;
  formNoticiaEl.elements.categoriaId.value = noticia.categoriaId;
  formNoticiaEl.elements.imagemUrl.value = noticia.imagemUrl || '';
  formNoticiaEl.elements.publicada.checked = noticia.publicada;
  modalNoticiaEl.show();
}

async function excluirNoticia(id) {
  if (!confirm('Excluir esta notícia? Essa ação não pode ser desfeita.')) return;
  const resp = await fetch(`/api/noticias/${id}`, { method: 'DELETE' });
  if (resp.ok) carregarNoticias();
}

formNoticiaEl.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(formNoticiaEl));
  dados.publicada = formNoticiaEl.elements.publicada.checked;
  const id = dados.id;
  delete dados.id;

  const url = id ? `/api/noticias/${id}` : '/api/noticias';
  const metodo = id ? 'PUT' : 'POST';

  if (!id) {
    dados.autorId = usuarioLogado.id;
    dados.autorNome = usuarioLogado.nome;
  }

  const resp = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (resp.ok) {
    modalNoticiaEl.hide();
    carregarNoticias();
  } else {
    const erro = await resp.json();
    alert(erro.erro || 'Erro ao salvar notícia.');
  }
});

carregarCategorias().then(carregarNoticias);
