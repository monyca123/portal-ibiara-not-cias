// Resolve o que o admin colar (ID puro, link /channel/UC..., ou um
// @handle/link de @handle) para o ID real do canal (UC...). O YouTube nao
// tem endpoint publico simples pra isso sem API key, entao buscamos a
// pagina do canal e lemos o link canonico, que sempre aponta pro
// /channel/UC... de verdade.
export async function resolverCanalYoutube(entrada) {
  if (!entrada) return '';
  const texto = entrada.trim();
  if (!texto) return '';

  if (/^UC[\w-]{10,}$/.test(texto)) return texto;

  const porChannel = texto.match(/channel\/(UC[\w-]{10,})/);
  if (porChannel) return porChannel[1];

  let url = texto;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://www.youtube.com/${texto.startsWith('@') ? texto : `@${texto}`}`;
  }

  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resp.ok) return texto;
    const html = await resp.text();
    const m = html.match(/"channelId":"(UC[\w-]{10,})"/) || html.match(/channel\/(UC[\w-]{10,})/);
    return m ? m[1] : texto;
  } catch (_) {
    return texto; // sem internet ou o YouTube mudou algo — mantem o que a pessoa colou
  }
}

// Quando o canal NAO esta ao vivo, o embed de live_stream mostra um erro
// feio ("este video nao esta disponivel") em vez de avisar direito. Pra
// evitar isso, checamos antes: /channel/{id}/live redireciona pra um
// /watch?v=... de verdade só quando ha uma transmissao rolando agora.
// Cache de 60s pra nao bater no YouTube a cada visita na home.
const cacheAoVivo = new Map();

export async function canalEstaAoVivo(canalId) {
  if (!canalId) return false;

  const emCache = cacheAoVivo.get(canalId);
  if (emCache && emCache.expiraEm > Date.now()) return emCache.aoVivo;

  let aoVivo = false;
  try {
    const resp = await fetch(`https://www.youtube.com/channel/${canalId}/live`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    aoVivo = /\/watch\?v=/.test(resp.url);
  } catch (_) {
    aoVivo = false; // sem internet ou o YouTube fora do ar — assume que nao esta ao vivo
  }

  cacheAoVivo.set(canalId, { aoVivo, expiraEm: Date.now() + 60_000 });
  return aoVivo;
}

// Achar o ultimo video do canal quando ele nao esta ao vivo. O feed RSS
// publico do YouTube seria o jeito mais simples, mas alguns canais
// devolvem 404 nele (confirmado na pratica, sem explicacao clara do
// YouTube) — entao usamos o feed como primeira tentativa, mais rapida, e
// caimos pra ler a propria pagina "/videos" do canal quando ele falhar.
const cacheUltimoVideo = new Map();

export async function ultimoVideoDoCanal(canalId) {
  if (!canalId) return '';

  const emCache = cacheUltimoVideo.get(canalId);
  if (emCache && emCache.expiraEm > Date.now()) return emCache.videoId;

  const videoId = (await ultimoVideoViaFeed(canalId)) || (await ultimoVideoViaPaginaDeVideos(canalId));

  cacheUltimoVideo.set(canalId, { videoId, expiraEm: Date.now() + 5 * 60_000 });
  return videoId;
}

async function ultimoVideoViaFeed(canalId) {
  try {
    const resp = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${canalId}`);
    if (!resp.ok) return '';
    const xml = await resp.text();
    const m = xml.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/);
    return m ? m[1] : '';
  } catch (_) {
    return '';
  }
}

async function ultimoVideoViaPaginaDeVideos(canalId) {
  try {
    const resp = await fetch(`https://www.youtube.com/channel/${canalId}/videos`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!resp.ok) return '';
    const html = await resp.text();
    const m = html.match(/"videoId":"([\w-]{11})"/);
    return m ? m[1] : '';
  } catch (_) {
    return '';
  }
}
