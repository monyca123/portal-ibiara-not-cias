import { configuracaoService } from '../services/configuracaoService.js';

export const configuracaoController = {
  async obter(req, res) {
    res.json(await configuracaoService.obter());
  },

  async atualizar(req, res) {
    const configuracao = await configuracaoService.atualizar(req.body);
    res.json(configuracao.toJSON());
  },
};
