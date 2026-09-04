import configuracaoRepo from '../repositories/ConfiguracaoRepository.js';
import Configuracao from '../models/Configuracao.js';
import { resolverCanalYoutube } from '../utils/youtube.js';

export const configuracaoService = {
  obter() {
    return configuracaoRepo.obter();
  },

  async atualizar({ canalYoutubeId, videoDestaqueId }) {
    const canalResolvido = await resolverCanalYoutube(canalYoutubeId);
    const configuracao = new Configuracao({ canalYoutubeId: canalResolvido, videoDestaqueId });
    return configuracaoRepo.salvar(configuracao);
  },
};
