import { authService } from '../services/authService.js';
import { criarClienteGoogle, googleConfigurado } from '../utils/googleClient.js';

export const authController = {
  login(req, res) {
    const usuario = authService.login(req.body);
    res.json(usuario);
  },

  registrar(req, res) {
    const usuario = authService.registrar(req.body);
    res.status(201).json(usuario);
  },

  registrarLeitor(req, res) {
    const usuario = authService.registrarLeitor(req.body);
    res.status(201).json(usuario);
  },

  googleRedirecionar(req, res) {
    if (!googleConfigurado()) {
      return res.status(503).send('Login com Google ainda nao foi configurado neste servidor.');
    }
    const client = criarClienteGoogle(req);
    const voltar = req.query.voltar || '/index.html';
    const url = client.generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
      state: Buffer.from(JSON.stringify({ voltar })).toString('base64url'),
    });
    res.redirect(url);
  },

  async googleCallback(req, res) {
    let voltar = '/index.html';
    try {
      const estado = JSON.parse(Buffer.from(req.query.state || '', 'base64url').toString());
      voltar = estado.voltar || voltar;
    } catch (_) {
      // sem state valido, usa o padrao
    }

    try {
      const client = criarClienteGoogle(req);
      const { tokens } = await client.getToken(req.query.code);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const usuario = authService.loginOuCriarComGoogle({ nome: payload.name, email: payload.email });

      // O token e os dados vao pela URL de redirecionamento (o navegador
      // do usuario, nao um fetch) — a pagina de destino le a query string
      // e salva a sessao. Simples de implementar; numa versao mais
      // rigorosa, trocaria por um codigo de uso unico resolvido depois
      // via fetch, pra nao deixar o token visivel no historico do navegador.
      const params = new URLSearchParams({
        token: usuario.token,
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        voltar,
      });
      res.redirect(`/leitor-oauth-concluido.html?${params.toString()}`);
    } catch (e) {
      res.redirect(`/leitor-entrar.html?erro=google&voltar=${encodeURIComponent(voltar)}`);
    }
  },
};
