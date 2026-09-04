// Um unico lugar pra saber quem esta logado, seja jornalista/admin
// (sessionStorage, some ao fechar a aba) ou leitor comum (localStorage,
// persiste — nao faz sentido pedir login de novo so pra comentar).
export function obterSessao() {
  const staff = sessionStorage.getItem('usuario');
  if (staff) return JSON.parse(staff);
  const leitor = localStorage.getItem('leitorSessao');
  if (leitor) return JSON.parse(leitor);
  return null;
}

export function salvarSessaoStaff(usuario) {
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
}

export function salvarSessaoLeitor(usuario) {
  localStorage.setItem('leitorSessao', JSON.stringify(usuario));
}

export function encerrarSessao() {
  sessionStorage.removeItem('usuario');
  localStorage.removeItem('leitorSessao');
}
