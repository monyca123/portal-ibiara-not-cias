import configuracaoRepo from '../repositories/ConfiguracaoRepository.js';
import Configuracao from '../models/Configuracao.js';

export const configuracaoService = {
  obter() {
    return configuracaoRepo.obter();
  },

  atualizar({ canalYoutubeId, videoDestaqueId }) {
    const configuracao = new Configuracao({ canalYoutubeId, videoDestaqueId });
    return configuracaoRepo.salvar(configuracao);
  },
};
