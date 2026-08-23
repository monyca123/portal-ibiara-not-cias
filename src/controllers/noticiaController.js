import { noticiaService } from '../services/noticiaService.js';

export const noticiaController = {
  listarTodas(req, res) {
    const noticias = noticiaService.listar(req.query);
    res.json(noticias.map((n) => n.toJSON()));
  },

  buscarPorId(req, res) {
    const noticia = noticiaService.buscarPorId(req.params.id);
    res.json(noticia.toJSON());
  },

  criar(req, res) {
    const noticia = noticiaService.criar(req.body);
    res.status(201).json(noticia.toJSON());
  },

  atualizar(req, res) {
    const noticia = noticiaService.atualizar(req.params.id, req.body);
    res.json(noticia.toJSON());
  },

  remover(req, res) {
    noticiaService.remover(req.params.id);
    res.status(204).end();
  },

  adicionarComentario(req, res) {
    const comentario = noticiaService.adicionarComentario(req.params.id, req.body);
    res.status(201).json(comentario.toJSON());
  },
};
