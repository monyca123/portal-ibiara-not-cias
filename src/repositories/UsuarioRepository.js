import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import JsonRepository from './JsonRepository.js';
import Autor from '../models/Autor.js';
import Administrador from '../models/Administrador.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAMINHO = join(__dirname, '..', 'data', 'usuarios.json');

function fabricarUsuario(dados) {
  if (dados.papel === 'administrador') {
    return new Administrador(dados.nome, dados.email, dados.senhaHash, dados.id);
  }
  return new Autor(dados.nome, dados.email, dados.senhaHash, dados.biografia, dados.id);
}

export class UsuarioRepository extends JsonRepository {
  constructor() {
    super(CAMINHO, fabricarUsuario);
  }

  buscarPorEmail(email) {
    return this.listar().find((u) => u.email === email) ?? null;
  }
}

export default new UsuarioRepository();
