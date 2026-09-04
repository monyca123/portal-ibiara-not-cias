import { salvarSessaoLeitor } from './sessao.js';

const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (token) {
  salvarSessaoLeitor({
    id: params.get('id'),
    nome: params.get('nome'),
    email: params.get('email'),
    papel: 'leitor',
    permissoes: ['comentar'],
    token,
  });
  window.location.href = params.get('voltar') || 'index.html';
} else {
  window.location.href = 'leitor-entrar.html?erro=google';
}
