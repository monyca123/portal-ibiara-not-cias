import usuarioRepo from '../repositories/UsuarioRepository.js';
import { verificarSenha } from '../utils/senha.js';

function erro(mensagem, status) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

export const authService = {
  login({ email, senha }) {
    const usuario = usuarioRepo.buscarPorEmail(email);
    if (!usuario || !verificarSenha(senha || '', usuario.senhaHash)) {
      throw erro('Email ou senha invalidos.', 401);
    }
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel(),
      permissoes: usuario.permissoes(),
    };
  },
};
