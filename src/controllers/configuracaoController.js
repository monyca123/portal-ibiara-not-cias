import { configuracaoService } from '../services/configuracaoService.js';

export const configuracaoController = {
  obter(req, res) {
    res.json(configuracaoService.obter().toJSON());
  },

  atualizar(req, res) {
    const configuracao = configuracaoService.atualizar(req.body);
    res.json(configuracao.toJSON());
  },
};
