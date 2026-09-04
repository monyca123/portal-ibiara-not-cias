import { authService } from './services/authService.js';
import { salvarSessaoStaff } from './sessao.js';

const formLoginEl = document.getElementById('form-login');
const alertaErroEl = document.getElementById('alerta-erro');

if (sessionStorage.getItem('usuario')) {
  window.location.href = 'admin.html';
}

formLoginEl.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  alertaErroEl.classList.add('d-none');
  const dados = Object.fromEntries(new FormData(formLoginEl));

  try {
    const usuario = await authService.login(dados);
    salvarSessaoStaff(usuario);
    window.location.href = 'admin.html';
  } catch (err) {
    alertaErroEl.textContent = err.message;
    alertaErroEl.classList.remove('d-none');
  }
});
