import { db } from '../db.js';
import Autor from '../models/Autor.js';
import Administrador from '../models/Administrador.js';
import Leitor from '../models/Leitor.js';

function paraModelo(row) {
  if (row.papel === 'administrador') {
    return new Administrador(row.nome, row.email, row.senha_hash, row.id);
  }
  if (row.papel === 'leitor') {
    return new Leitor(row.nome, row.email, row.senha_hash, row.id);
  }
  return new Autor(row.nome, row.email, row.senha_hash, row.biografia, row.id);
}

export class UsuarioRepository {
  listar() {
    return db.prepare('SELECT * FROM usuarios').all().map(paraModelo);
  }

  buscarPorId(id) {
    const row = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
    return row ? paraModelo(row) : null;
  }

  buscarPorEmail(email) {
    const row = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    return row ? paraModelo(row) : null;
  }

  adicionar(usuario) {
    db.prepare(
      'INSERT INTO usuarios (id, nome, email, senha_hash, papel, biografia) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(usuario.id, usuario.nome, usuario.email, usuario.senhaHash, usuario.papel(), usuario.biografia ?? null);
    return usuario;
  }

  remover(id) {
    return db.prepare('DELETE FROM usuarios WHERE id = ?').run(id).changes > 0;
  }
}

export default new UsuarioRepository();
