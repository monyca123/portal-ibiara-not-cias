function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

const lista = document.querySelector('#lista-moderacao');

export const moderacaoView = {
  renderLista(comentarios, aoRemover) {
    if (comentarios.length === 0) {
      lista.innerHTML = '<p class="text-muted mb-0">Nenhum comentário ainda.</p>';
      return;
    }

    lista.innerHTML = comentarios
      .map(
        (c) => `
        <div class="list-group-item d-flex justify-content-between align-items-start gap-3 flex-wrap">
          <div>
            <div class="small text-muted">
              Em "${escapeHtml(c.noticiaTitulo)}" — ${escapeHtml(c.autorNome)} — ${new Date(c.criadoEm).toLocaleString('pt-BR')}
            </div>
            <div>${escapeHtml(c.texto)}</div>
          </div>
          <button class="btn btn-sm btn-outline-danger flex-shrink-0" data-noticia-id="${c.noticiaId}" data-comentario-id="${c.id}">
            Excluir
          </button>
        </div>`
      )
      .join('');

    lista.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => aoRemover(btn.dataset.noticiaId, btn.dataset.comentarioId));
    });
  },
};
