import categoriaRepo from '../repositories/CategoriaRepository.js';
import Categoria from '../models/Categoria.js';

function erro(mensagem, status) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

export const categoriaService = {
  listar() {
    return categoriaRepo.listar();
  },

  buscarPorId(id) {
    const categoria = categoriaRepo.buscarPorId(id);
    if (!categoria) throw erro('Categoria nao encontrada.', 404);
    return categoria;
  },

  criar({ nome, tipo }) {
    try {
      const categoria = new Categoria(nome, tipo);
      return categoriaRepo.adicionar(categoria);
    } catch (e) {
      throw erro(e.message, 400);
    }
  },

  atualizar(id, { nome }) {
    const categoria = categoriaRepo.buscarPorId(id);
    if (!categoria) throw erro('Categoria nao encontrada.', 404);
    try {
      if (nome) categoria.nome = nome;
    } catch (e) {
      throw erro(e.message, 400);
    }
    return categoriaRepo.atualizar(categoria.id, categoria);
  },

  remover(id) {
    const removido = categoriaRepo.remover(id);
    if (!removido) throw erro('Categoria nao encontrada.', 404);
  },
};
