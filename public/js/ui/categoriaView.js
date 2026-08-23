function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

const form = document.querySelector('#form-categoria');
const lista = document.querySelector('#lista-categorias');

function criarLinha(categoria, aoRemover) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';

  const texto = document.createElement('span');
  texto.textContent = `${categoria.nome} (${categoria.tipo})`;

  const btn = document.createElement('button');
  btn.className = 'btn btn-sm btn-outline-danger';
  btn.textContent = 'Remover';
  btn.addEventListener('click', () => aoRemover(categoria.id));

  li.append(texto, btn);
  return li;
}

export const categoriaView = {
  renderLista(categorias, aoRemover) {
    lista.innerHTML = '';
    if (categorias.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-muted">Nenhuma categoria ainda.</li>';
      return;
    }
    categorias.forEach((c) => lista.appendChild(criarLinha(c, aoRemover)));
  },

  preencherSelectNoticia(categorias, selectEl) {
    selectEl.innerHTML = categorias
      .map((c) => `<option value="${c.id}">${escapeHtml(c.nome)} (${c.tipo})</option>`)
      .join('');
  },

  limparForm() {
    form.reset();
  },

  onSubmit(callback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      callback({
        nome: document.querySelector('#cat-nome').value,
        tipo: document.querySelector('#cat-tipo').value,
      });
    });
  },
};
