import { Router } from 'express';
import Noticia from '../models/Noticia.js';

// DIP: a rota depende da forma do repositorio (listar/buscarPorId/adicionar/...),
// nao de uma implementacao concreta. Quem decide QUAL repositorio usar e o
// composition root (server.js), que injeta a instancia aqui dentro.
export default function criarRotasNoticias(noticiaRepo) {
  const router = Router();

  router.get('/', (req, res) => {
    const { categoriaId, todas } = req.query;
    let noticias = todas ? noticiaRepo.listar() : noticiaRepo.listarPublicadas();
    if (categoriaId) {
      noticias = noticias.filter((n) => n.categoriaId === categoriaId);
    }
    noticias = noticias.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    res.json(noticias.map((n) => n.toJSON()));
  });

  router.get('/:id', (req, res) => {
    const noticia = noticiaRepo.buscarPorId(req.params.id);
    if (!noticia) return res.status(404).json({ erro: 'Noticia nao encontrada.' });
    noticia.incrementarVisualizacao();
    noticiaRepo.atualizar(noticia.id, noticia);
    res.json(noticia.toJSON());
  });

  router.post('/', (req, res) => {
    try {
      const noticia = new Noticia(req.body);
      noticiaRepo.adicionar(noticia);
      res.status(201).json(noticia.toJSON());
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  });

  router.put('/:id', (req, res) => {
    const noticia = noticiaRepo.buscarPorId(req.params.id);
    if (!noticia) return res.status(404).json({ erro: 'Noticia nao encontrada.' });
    try {
      noticia.atualizar(req.body);
      noticiaRepo.atualizar(noticia.id, noticia);
      res.json(noticia.toJSON());
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  });

  router.delete('/:id', (req, res) => {
    const removido = noticiaRepo.remover(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Noticia nao encontrada.' });
    res.status(204).send();
  });

  router.post('/:id/comentarios', (req, res) => {
    const noticia = noticiaRepo.buscarPorId(req.params.id);
    if (!noticia) return res.status(404).json({ erro: 'Noticia nao encontrada.' });
    try {
      const comentario = noticia.adicionarComentario(req.body.autorNome, req.body.texto);
      noticiaRepo.atualizar(noticia.id, noticia);
      res.status(201).json(comentario.toJSON());
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  });

  return router;
}
