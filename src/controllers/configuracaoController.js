import { configuracaoService } from '../services/configuracaoService.js';

export const configuracaoController = {
  obter(req, res) {
    res.json(configuracaoService.obter().toJSON());
  },

  async atualizar(req, res) {
    const configuracao = await configuracaoService.atualizar(req.body);
    res.json(configuracao.toJSON());
  },
};
