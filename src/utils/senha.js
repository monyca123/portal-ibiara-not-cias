import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export function gerarHash(senhaTextoPlano) {
  const sal = randomBytes(16).toString('hex');
  const hash = scryptSync(senhaTextoPlano, sal, 64).toString('hex');
  return `${sal}:${hash}`;
}

export function verificarSenha(senhaTextoPlano, senhaHash) {
  const [sal, hashArmazenado] = senhaHash.split(':');
  const hashCalculado = scryptSync(senhaTextoPlano, sal, 64);
  const bufferArmazenado = Buffer.from(hashArmazenado, 'hex');
  if (bufferArmazenado.length !== hashCalculado.length) return false;
  return timingSafeEqual(bufferArmazenado, hashCalculado);
}
