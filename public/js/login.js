const formLoginEl = document.getElementById('form-login');
const alertaErroEl = document.getElementById('alerta-erro');

if (sessionStorage.getItem('usuario')) {
  window.location.href = 'admin.html';
}

formLoginEl.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  alertaErroEl.classList.add('d-none');
  const dados = Object.fromEntries(new FormData(formLoginEl));

  const resp = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!resp.ok) {
    const erro = await resp.json();
    alertaErroEl.textContent = erro.erro || 'Falha no login.';
    alertaErroEl.classList.remove('d-none');
    return;
  }

  const usuario = await resp.json();
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
  window.location.href = 'admin.html';
});
