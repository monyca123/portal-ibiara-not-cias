import { API_URL } from './config.js';
import { obterSessao } from './sessao.js';

// Helper central: monta a requisicao, anexa o token de quem estiver
// logado, checa erros e trata o 204 (sem corpo).
async function request(caminho, opcoes = {}) {
  const sessao = obterSessao();
  const headers = { 'Content-Type': 'application/json', ...opcoes.headers };
  if (sessao?.token) headers.Authorization = `Bearer ${sessao.token}`;

  const resp = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });

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
  getNoticias(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/api/noticias${query ? `?${query}` : ''}`);
  },
  getNoticia(id) { return request(`/api/noticias/${id}`); },
  criarNoticia(dados) { return request('/api/noticias', { method: 'POST', body: JSON.stringify(dados) }); },
  atualizarNoticia(id, dados) { return request(`/api/noticias/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
  removerNoticia(id) { return request(`/api/noticias/${id}`, { method: 'DELETE' }); },
  comentarNoticia(id, dados) { return request(`/api/noticias/${id}/comentarios`, { method: 'POST', body: JSON.stringify(dados) }); },
  removerComentario(noticiaId, comentarioId) {
    return request(`/api/noticias/${noticiaId}/comentarios/${comentarioId}`, { method: 'DELETE' });
  },

  getCategorias() { return request('/api/categorias'); },
  criarCategoria(dados) { return request('/api/categorias', { method: 'POST', body: JSON.stringify(dados) }); },
  removerCategoria(id) { return request(`/api/categorias/${id}`, { method: 'DELETE' }); },

  login(dados) { return request('/api/auth/login', { method: 'POST', body: JSON.stringify(dados) }); },
  registrarLeitor(dados) { return request('/api/auth/registro-leitor', { method: 'POST', body: JSON.stringify(dados) }); },

  getConfiguracao() { return request('/api/configuracao'); },
  atualizarConfiguracao(dados) { return request('/api/configuracao', { method: 'PUT', body: JSON.stringify(dados) }); },
};
