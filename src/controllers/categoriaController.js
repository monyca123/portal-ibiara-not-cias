import { categoriaService } from '../services/categoriaService.js';

export const categoriaController = {
  listarTodas(req, res) {
    res.json(categoriaService.listar().map((c) => c.toJSON()));
  },

  buscarPorId(req, res) {
    const categoria = categoriaService.buscarPorId(req.params.id);
    res.json(categoria.toJSON());
  },

  criar(req, res) {
    const categoria = categoriaService.criar(req.body);
    res.status(201).json(categoria.toJSON());
  },

  atualizar(req, res) {
    const categoria = categoriaService.atualizar(req.params.id, req.body);
    res.json(categoria.toJSON());
  },

  remover(req, res) {
    categoriaService.remover(req.params.id);
    res.status(204).end();
  },
};
