import { api } from '../api.js';

export const authService = {
  async login({ email, senha }) {
    if (!email || !senha) throw new Error('Preencha email e senha.');
    return api.login({ email, senha });
  },

  async registrarLeitor({ nome, email, senha }) {
    if (!nome || !email || !senha) throw new Error('Preencha nome, email e senha.');
    if (senha.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
    return api.registrarLeitor({ nome, email, senha });
  },
};
