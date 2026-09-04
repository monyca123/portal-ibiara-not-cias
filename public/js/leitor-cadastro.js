import { authService } from './services/authService.js';
import { salvarSessaoLeitor, obterSessao } from './sessao.js';

const formEl = document.getElementById('form-cadastro');
const alertaEl = document.getElementById('alerta-erro');
const btnEl = document.getElementById('btn-cadastrar');

const params = new URLSearchParams(window.location.search);
const voltar = params.get('voltar') || 'index.html';

document.getElementById('link-entrar').href = `leitor-entrar.html?voltar=${encodeURIComponent(voltar)}`;
document.getElementById('link-google').href = `/api/auth/google?voltar=${encodeURIComponent(voltar)}`;

if (obterSessao()) {
  window.location.href = voltar;
}

formEl.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  alertaEl.classList.add('d-none');
  const dados = Object.fromEntries(new FormData(formEl));

  btnEl.disabled = true;
  btnEl.textContent = 'Criando conta...';
  try {
    const usuario = await authService.registrarLeitor(dados);
    salvarSessaoLeitor(usuario);
    window.location.href = voltar;
  } catch (err) {
    alertaEl.textContent = err.message;
    alertaEl.classList.remove('d-none');
  } finally {
    btnEl.disabled = false;
    btnEl.textContent = 'Criar conta';
  }
});
