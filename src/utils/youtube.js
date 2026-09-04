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
