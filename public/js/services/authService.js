import { api } from '../api.js';

export const authService = {
  async login({ email, senha }) {
    if (!email || !senha) throw new Error('Preencha email e senha.');
    return api.login({ email, senha });
  },
};
