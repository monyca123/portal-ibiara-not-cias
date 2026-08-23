import { api } from '../api.js';

export const categoriaService = {
  listar() {
    return api.getCategorias();
  },

  async criar({ nome, tipo }) {
    if (!nome || !nome.trim()) throw new Error('Nome da categoria e obrigatorio.');
    if (!['local', 'geral'].includes(tipo)) throw new Error('Tipo deve ser "local" ou "geral".');
    return api.criarCategoria({ nome: nome.trim(), tipo });
  },

  remover(id) {
    return api.removerCategoria(id);
  },
};
