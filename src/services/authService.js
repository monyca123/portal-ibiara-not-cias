import usuarioRepo from '../repositories/UsuarioRepository.js';
import Autor from '../models/Autor.js';
import Leitor from '../models/Leitor.js';
import { verificarSenha, gerarHash } from '../utils/senha.js';
import { gerarToken } from '../utils/token.js';

function erro(mensagem, status) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

function paraPublico(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel(),
    permissoes: usuario.permissoes(),
    token: gerarToken(usuario),
  };
}

function validarCadastro({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw erro('Preencha nome, email e senha.', 400);
  }
  if (senha.length < 6) {
    throw erro('A senha precisa ter pelo menos 6 caracteres.', 400);
  }
  if (usuarioRepo.buscarPorEmail(email)) {
    throw erro('Ja existe uma conta com este email.', 409);
  }
}

export const authService = {
  login({ email, senha }) {
    const usuario = usuarioRepo.buscarPorEmail(email);
    if (!usuario || !verificarSenha(senha || '', usuario.senhaHash)) {
      throw erro('Email ou senha invalidos.', 401);
    }
    return paraPublico(usuario);
  },

  registrar({ nome, email, senha }) {
    validarCadastro({ nome, email, senha });
    const autor = new Autor(nome, email, gerarHash(senha), '');
    usuarioRepo.adicionar(autor);
    return paraPublico(autor);
  },

  registrarLeitor({ nome, email, senha }) {
    validarCadastro({ nome, email, senha });
    const leitor = new Leitor(nome, email, gerarHash(senha));
    usuarioRepo.adicionar(leitor);
    return paraPublico(leitor);
  },
};
