import { api } from '../api.js';

export const noticiaService = {
  listar(params) {
    return api.getNoticias(params);
  },

  buscarPorId(id) {
    return api.getNoticia(id);
  },

  async criar(dados) {
    if (!dados.titulo || dados.titulo.trim().length < 3) throw new Error('Titulo muito curto.');
    if (!dados.conteudo || dados.conteudo.trim().length < 10) throw new Error('Conteudo muito curto.');
    if (!dados.categoriaId) throw new Error('Selecione uma categoria.');
    return api.criarNoticia(dados);
  },

  async atualizar(id, dados) {
    if (!dados.titulo || dados.titulo.trim().length < 3) throw new Error('Titulo muito curto.');
    if (!dados.conteudo || dados.conteudo.trim().length < 10) throw new Error('Conteudo muito curto.');
    return api.atualizarNoticia(id, dados);
  },

  remover(id) {
    return api.removerNoticia(id);
  },

  async comentar(id, texto) {
    if (!texto || !texto.trim()) throw new Error('Escreva um comentario antes de enviar.');
    return api.comentarNoticia(id, { texto });
  },

  removerComentario(noticiaId, comentarioId) {
    return api.removerComentario(noticiaId, comentarioId);
  },
};
