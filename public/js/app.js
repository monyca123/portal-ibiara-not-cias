const listaNoticiasEl = document.getElementById('lista-noticias');
const filtrosCategoriaEl = document.getElementById('filtros-categoria');

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

let categorias = [];
let filtroTipo = '';
let filtroCategoriaId = '';

async function carregarCategorias() {
  const resp = await fetch('/api/categorias');
  categorias = await resp.json();
  renderizarFiltrosCategoria();
}

function renderizarFiltrosCategoria() {
  const categoriasVisiveis = filtroTipo
    ? categorias.filter((c) => c.tipo === filtroTipo)
    : categorias;

  const botoes = categoriasVisiveis
    .map(
      (c) => `<button class="btn btn-sm btn-outline-secondary" data-categoria-id="${c.id}">${c.nome}</button>`
    )
    .join('');

  filtrosCategoriaEl.innerHTML =
    `<button class="btn btn-sm btn-outline-secondary ativo" data-categoria-id="">Todas as categorias</button>` +
    botoes;

  filtrosCategoriaEl.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      filtroCategoriaId = btn.dataset.categoriaId;
      filtrosCategoriaEl.querySelectorAll('button').forEach((b) => b.classList.remove('ativo', 'btn-secondary'));
      btn.classList.add('ativo', 'btn-secondary');
      carregarNoticias();
    });
  });
}

function imagemSegura(url) {
  if (url && /^https?:\/\//i.test(url)) return url;
  return 'https://placehold.co/600x300?text=Ibiara+Noticias';
}

function nomeCategoria(categoriaId) {
  return categorias.find((c) => c.id === categoriaId)?.nome ?? 'Sem categoria';
}

function tipoCategoria(categoriaId) {
  return categorias.find((c) => c.id === categoriaId)?.tipo ?? 'geral';
}

async function carregarNoticias() {
  listaNoticiasEl.innerHTML = '<div class="col-12 text-center text-muted py-5">Carregando notícias...</div>';
  const params = new URLSearchParams();
  if (filtroCategoriaId) params.set('categoriaId', filtroCategoriaId);
  const resp = await fetch(`/api/noticias?${params.toString()}`);
  let noticias = await resp.json();

  if (filtroTipo) {
    noticias = noticias.filter((n) => tipoCategoria(n.categoriaId) === filtroTipo);
  }

  if (noticias.length === 0) {
    listaNoticiasEl.innerHTML = '<div class="col-12 text-center text-muted py-5">Nenhuma notícia encontrada.</div>';
    return;
  }

  listaNoticiasEl.innerHTML = noticias.map(renderizarCard).join('');
}

function renderizarCard(noticia) {
  const tipo = tipoCategoria(noticia.categoriaId);
  const badgeClasse = tipo === 'local' ? 'badge-categoria-local' : 'badge-categoria-geral';
  const imagem = imagemSegura(noticia.imagemUrl);
  const data = new Date(noticia.criadoEm).toLocaleDateString('pt-BR');

  return `
    <div class="col-sm-6 col-lg-4">
      <a href="noticia.html?id=${encodeURIComponent(noticia.id)}" class="text-decoration-none text-dark">
        <div class="card h-100 card-noticia shadow-sm">
          <img src="${imagem}" class="card-img-top" alt="${escapeHtml(noticia.titulo)}" />
          <div class="card-body">
            <span class="badge ${badgeClasse} mb-2">${escapeHtml(nomeCategoria(noticia.categoriaId))}</span>
            <h5 class="card-title">${escapeHtml(noticia.titulo)}</h5>
            <p class="card-text text-muted small">${escapeHtml(noticia.resumo)}</p>
          </div>
          <div class="card-footer bg-transparent text-muted small d-flex justify-content-between">
            <span>${data}</span>
            <span>👁 ${noticia.visualizacoes}</span>
          </div>
        </div>
      </a>
    </div>
  `;
}

document.querySelectorAll('[data-filtro-tipo]').forEach((link) => {
  link.addEventListener('click', (evento) => {
    evento.preventDefault();
    filtroTipo = link.dataset.filtroTipo;
    filtroCategoriaId = '';
    document.querySelectorAll('[data-filtro-tipo]').forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
    renderizarFiltrosCategoria();
    carregarNoticias();
  });
});

carregarCategorias().then(carregarNoticias);
