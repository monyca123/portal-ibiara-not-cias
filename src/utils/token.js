import jwt from 'jsonwebtoken';

const SEGREDO = process.env.JWT_SECRET || 'dev-secret-troque-esta-chave-em-producao';
const VALIDADE = '7d';

if (!process.env.JWT_SECRET) {
  console.warn('[aviso] JWT_SECRET nao definido no .env — usando chave de desenvolvimento. Defina uma chave forte em producao.');
}

export function gerarToken(usuario) {
  return jwt.sign({ id: usuario.id, papel: usuario.papel() }, SEGREDO, { expiresIn: VALIDADE });
}

export function verificarToken(token) {
  return jwt.verify(token, SEGREDO);
}
