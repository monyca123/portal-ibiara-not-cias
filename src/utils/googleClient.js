import { OAuth2Client } from 'google-auth-library';

// O redirect URI e montado a partir do host da propria requisicao (nao
// fixo em env), porque cadastramos DOIS URIs no Google Console (localhost
// e o dominio de producao) — funciona nos dois sem precisar trocar config
// entre ambientes, desde que os dois estejam registrados no Google Cloud.
export function criarClienteGoogle(req) {
  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
}

export function googleConfigurado() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
