import { Router } from 'express';
import { verificarSenha } from '../utils/senha.js';

// DIP: recebe o repositorio de usuarios pronto em vez de importar/instanciar
// a fonte de dados concreta dentro da rota.
export default function criarRotasAuth(usuarioRepo) {
  const router = Router();

  router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarioRepo.buscarPorEmail(email);
    if (!usuario || !verificarSenha(senha || '', usuario.senhaHash)) {
      return res.status(401).json({ erro: 'Email ou senha invalidos.' });
    }
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel(),
      permissoes: usuario.permissoes(),
    });
  });

  return router;
}
