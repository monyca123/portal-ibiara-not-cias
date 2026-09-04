import configuracaoRepo from '../repositories/ConfiguracaoRepository.js';
import Configuracao from '../models/Configuracao.js';
import { resolverCanalYoutube, canalEstaAoVivo, ultimoVideoDoCanal } from '../utils/youtube.js';

export const configuracaoService = {
  async obter() {
    const configuracao = configuracaoRepo.obter();

    // "ao vivo" e "ultimo video" nao sao dados salvos — sao calculados na
    // hora, direto do YouTube, porque o canal pode comecar/parar de
    // transmitir ou publicar um video novo sem ninguem mexer aqui.
    let aoVivo = false;
    let ultimoVideoId = '';
    if (!configuracao.videoDestaqueId && configuracao.canalYoutubeId) {
      aoVivo = await canalEstaAoVivo(configuracao.canalYoutubeId);
      if (!aoVivo) {
        ultimoVideoId = await ultimoVideoDoCanal(configuracao.canalYoutubeId);
      }
    }

    return { ...configuracao.toJSON(), aoVivo, ultimoVideoId };
  },

  async atualizar({ canalYoutubeId, videoDestaqueId }) {
    const canalResolvido = await resolverCanalYoutube(canalYoutubeId);
    const configuracao = new Configuracao({ canalYoutubeId: canalResolvido, videoDestaqueId });
    return configuracaoRepo.salvar(configuracao);
  },
};
