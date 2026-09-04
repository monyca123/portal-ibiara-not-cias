import { api } from '../api.js';

// Aceita o ID puro ou qualquer link comum do YouTube e extrai so o ID
// do video (11 caracteres) — assim a pessoa pode colar o link inteiro.
export function extrairIdVideo(texto) {
  if (!texto) return '';
  const t = texto.trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  const m = t.match(/(?:v=|youtu\.be\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : t;
}

// Aceita o ID do canal (comeca com "UC...") ou um link tipo
// youtube.com/channel/UC.../ e extrai so o ID.
export function extrairIdCanal(texto) {
  if (!texto) return '';
  const t = texto.trim();
  const m = t.match(/channel\/([\w-]+)/);
  return m ? m[1] : t;
}

export const configuracaoService = {
  obter() {
    return api.getConfiguracao();
  },

  atualizar({ canalYoutubeId, videoDestaqueId }) {
    return api.atualizarConfiguracao({
      canalYoutubeId: extrairIdCanal(canalYoutubeId),
      videoDestaqueId: extrairIdVideo(videoDestaqueId),
    });
  },
};
