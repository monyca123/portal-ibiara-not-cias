import { Router } from 'express';
import CategoriaRepository from '../repositories/CategoriaRepository.js';
import Categoria from '../models/Categoria.js';

const router = Router();
const categoriaRepo = new CategoriaRepository();

router.get('/', (req, res) => {
  res.json(categoriaRepo.listar().map((c) => c.toJSON()));
});

router.get('/:id', (req, res) => {
  const categoria = categoriaRepo.buscarPorId(req.params.id);
  if (!categoria) return res.status(404).json({ erro: 'Categoria nao encontrada.' });
  res.json(categoria.toJSON());
});

router.post('/', (req, res) => {
  try {
    const categoria = new Categoria(req.body.nome, req.body.tipo);
    categoriaRepo.adicionar(categoria);
    res.status(201).json(categoria.toJSON());
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.put('/:id', (req, res) => {
  const categoria = categoriaRepo.buscarPorId(req.params.id);
  if (!categoria) return res.status(404).json({ erro: 'Categoria nao encontrada.' });
  try {
    if (req.body.nome) categoria.nome = req.body.nome;
    categoriaRepo.atualizar(categoria.id, categoria);
    res.json(categoria.toJSON());
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

router.delete('/:id', (req, res) => {
  const removido = categoriaRepo.remover(req.params.id);
  if (!removido) return res.status(404).json({ erro: 'Categoria nao encontrada.' });
  res.status(204).send();
});

export default router;
