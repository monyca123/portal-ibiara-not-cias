import { API_URL } from './config.js';

// Helper central: monta a requisicao, checa erros e trata o 204 (sem corpo).
async function request(caminho, opcoes = {}) {
  const resp = await fetch(`${API_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  if (!resp.ok) {
    let msg = `Erro ${resp.status}`;
    try {
      const corpo = await resp.json();
      if (corpo && corpo.erro) msg = corpo.erro;
    } catch (_) { /* resposta sem JSON */ }
    throw new Error(msg);
  }

  if (resp.status === 204) return null;
  return resp.json();
}

export const api = {
  // ---- Noticias ----
  getNoticias(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/api/noticias${query ? `?${query}` : ''}`);
  },
  getNoticia(id) { return request(`/api/noticias/${id}`); },
  criarNoticia(dados) { return request('/api/noticias', { method: 'POST', body: JSON.stringify(dados) }); },
  atualizarNoticia(id, dados) { return request(`/api/noticias/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
  removerNoticia(id) { return request(`/api/noticias/${id}`, { method: 'DELETE' }); },
  comentarNoticia(id, dados) { return request(`/api/noticias/${id}/comentarios`, { method: 'POST', body: JSON.stringify(dados) }); },

  // ---- Categorias ----
  getCategorias() { return request('/api/categorias'); },
  criarCategoria(dados) { return request('/api/categorias', { method: 'POST', body: JSON.stringify(dados) }); },
  removerCategoria(id) { return request(`/api/categorias/${id}`, { method: 'DELETE' }); },

  // ---- Auth ----
  login(dados) { return request('/api/auth/login', { method: 'POST', body: JSON.stringify(dados) }); },
};
