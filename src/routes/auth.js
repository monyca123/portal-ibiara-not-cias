import { Router } from 'express';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { verificarSenha } from '../utils/senha.js';

const router = Router();
const usuarioRepo = new UsuarioRepository();

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

export default router;
