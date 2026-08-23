function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

const tabela = document.querySelector('#tabela-noticias');
const selectCategoria = document.querySelector('#select-categoria');
const form = document.querySelector('#form-noticia');
const modalEl = document.querySelector('#modal-noticia');
const modal = new bootstrap.Modal(modalEl);

let categoriaPorId = {};

export const noticiaView = {
  setCategorias(categorias) {
    categoriaPorId = Object.fromEntries(categorias.map((c) => [c.id, c]));
    selectCategoria.innerHTML = categorias
      .map((c) => `<option value="${c.id}">${escapeHtml(c.nome)} (${c.tipo})</option>`)
      .join('');
  },

  renderTabela(noticias, aoEditar, aoRemover) {
    if (noticias.length === 0) {
      tabela.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Nenhuma noticia cadastrada.</td></tr>';
      return;
    }

    tabela.innerHTML = noticias
      .map((n) => {
        const categoria = categoriaPorId[n.categoriaId];
        return `
        <tr data-id="${n.id}">
          <td>${escapeHtml(n.titulo)}</td>
          <td>${escapeHtml(categoria ? categoria.nome : 'Sem categoria')}</td>
          <td>${escapeHtml(n.autorNome)}</td>
          <td>${n.visualizacoes}</td>
          <td><span class="badge ${n.publicada ? 'bg-success' : 'bg-secondary'}">${n.publicada ? 'Publicada' : 'Rascunho'}</span></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
            <button class="btn btn-sm btn-outline-danger btn-excluir">Excluir</button>
          </td>
        </tr>`;
      })
      .join('');

    tabela.querySelectorAll('tr').forEach((tr) => {
      const id = tr.dataset.id;
      const noticia = noticias.find((n) => n.id === id);
      tr.querySelector('.btn-editar')?.addEventListener('click', () => aoEditar(noticia));
      tr.querySelector('.btn-excluir')?.addEventListener('click', () => aoRemover(id));
    });
  },

  abrirParaCriar() {
    form.reset();
    form.elements.id.value = '';
    form.elements.publicada.checked = true;
    document.querySelector('#modal-noticia .modal-title').textContent = 'Nova notícia';
  },

  abrirParaEditar(noticia) {
    document.querySelector('#modal-noticia .modal-title').textContent = 'Editar notícia';
    form.elements.id.value = noticia.id;
    form.elements.titulo.value = noticia.titulo;
    form.elements.resumo.value = noticia.resumo;
    form.elements.conteudo.value = noticia.conteudo;
    form.elements.categoriaId.value = noticia.categoriaId;
    form.elements.imagemUrl.value = noticia.imagemUrl || '';
    form.elements.publicada.checked = noticia.publicada;
    modal.show();
  },

  fecharModal() {
    modal.hide();
  },

  onSubmit(callback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dados = Object.fromEntries(new FormData(form));
      dados.publicada = form.elements.publicada.checked;
      const id = dados.id;
      delete dados.id;
      callback(id || null, dados);
    });
  },

  onNovaNoticia(callback) {
    document.querySelector('#btn-nova-noticia').addEventListener('click', callback);
  },
};
