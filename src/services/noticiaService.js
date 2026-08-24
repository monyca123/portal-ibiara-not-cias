import noticiaRepo from '../repositories/NoticiaRepository.js';
import categoriaRepo from '../repositories/CategoriaRepository.js';
import Noticia from '../models/Noticia.js';

function erro(mensagem, status) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

export const noticiaService = {
  listar({ categoriaId, todas } = {}) {
    let noticias = todas ? noticiaRepo.listar() : noticiaRepo.listarPublicadas();
    if (categoriaId) {
      noticias = noticias.filter((n) => n.categoriaId === categoriaId);
    }
    return noticias.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
  },

  buscarPorId(id) {
    const noticia = noticiaRepo.buscarPorId(id);
    if (!noticia) throw erro('Noticia nao encontrada.', 404);
    noticia.incrementarVisualizacao();
    noticiaRepo.atualizar(noticia.id, noticia);
    return noticia;
  },

  criar(dados) {
    if (!dados.categoriaId || !categoriaRepo.buscarPorId(dados.categoriaId)) {
      throw erro('Categoria informada nao existe.', 422);
    }
    try {
      const noticia = new Noticia(dados);
      return noticiaRepo.adicionar(noticia);
    } catch (e) {
      throw erro(e.message, 400);
    }
  },

  atualizar(id, dados) {
    const noticia = noticiaRepo.buscarPorId(id);
    if (!noticia) throw erro('Noticia nao encontrada.', 404);
    if (dados.categoriaId && !categoriaRepo.buscarPorId(dados.categoriaId)) {
      throw erro('Categoria informada nao existe.', 422);
    }
    try {
      noticia.atualizar(dados);
    } catch (e) {
      throw erro(e.message, 400);
    }
    return noticiaRepo.atualizar(noticia.id, noticia);
  },

  remover(id) {
    const removido = noticiaRepo.remover(id);
    if (!removido) throw erro('Noticia nao encontrada.', 404);
  },

  adicionarComentario(id, { autorNome, texto }) {
    const noticia = noticiaRepo.buscarPorId(id);
    if (!noticia) throw erro('Noticia nao encontrada.', 404);
    let comentario;
    try {
      comentario = noticia.adicionarComentario(autorNome, texto);
    } catch (e) {
      throw erro(e.message, 400);
    }
    noticiaRepo.atualizar(noticia.id, noticia);
    return comentario;
  },
};
