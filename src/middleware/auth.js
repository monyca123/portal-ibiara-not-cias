import { verificarToken } from '../utils/token.js';
import usuarioRepo from '../repositories/UsuarioRepository.js';

export function exigirLogin(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Faca login para continuar.' });
  }
  try {
    const dados = verificarToken(token);
    const usuario = usuarioRepo.buscarPorId(dados.id);
    if (!usuario) throw new Error('usuario nao existe mais');
    req.usuario = usuario;
    next();
  } catch (e) {
    res.status(401).json({ erro: 'Sessao invalida ou expirada. Faca login novamente.' });
  }
}

export function exigirAdmin(req, res, next) {
  if (req.usuario?.papel() !== 'administrador') {
    return res.status(403).json({ erro: 'Apenas administradores podem fazer isso.' });
  }
  next();
}
