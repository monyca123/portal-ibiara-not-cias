import { db } from '../db.js';
import Categoria from '../models/Categoria.js';

function paraModelo(row) {
  return new Categoria(row.nome, row.tipo, row.id);
}

export class CategoriaRepository {
  listar() {
    return db.prepare('SELECT * FROM categorias').all().map(paraModelo);
  }

  buscarPorId(id) {
    const row = db.prepare('SELECT * FROM categorias WHERE id = ?').get(id);
    return row ? paraModelo(row) : null;
  }

  adicionar(categoria) {
    db.prepare('INSERT INTO categorias (id, nome, tipo) VALUES (?, ?, ?)')
      .run(categoria.id, categoria.nome, categoria.tipo);
    return categoria;
  }

  atualizar(id, categoria) {
    const r = db
      .prepare('UPDATE categorias SET nome = ?, tipo = ? WHERE id = ?')
      .run(categoria.nome, categoria.tipo, id);
    return r.changes > 0 ? categoria : null;
  }

  // true = removeu; lanca erro se houver noticias vinculadas (integridade referencial)
  remover(id) {
    const r = db.prepare('DELETE FROM categorias WHERE id = ?').run(id);
    return r.changes > 0;
  }
}

// Singleton usado pelos services (papel de "model" do E3/E5: dados + acesso)
export default new CategoriaRepository();
