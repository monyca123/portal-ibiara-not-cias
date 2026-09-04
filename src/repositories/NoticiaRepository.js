import { db } from '../db.js';
import Noticia from '../models/Noticia.js';

function buscarComentarios(noticiaId) {
  return db
    .prepare('SELECT * FROM comentarios WHERE noticia_id = ? ORDER BY criado_em ASC')
    .all(noticiaId)
    .map((c) => ({ id: c.id, leitorId: c.leitor_id, autorNome: c.autor_nome, texto: c.texto, criadoEm: c.criado_em }));
}

function paraModelo(row) {
  return new Noticia({
    id: row.id,
    titulo: row.titulo,
    resumo: row.resumo,
    conteudo: row.conteudo,
    categoriaId: row.categoria_id,
    autorId: row.autor_id,
    autorNome: row.autor_nome,
    imagemUrl: row.imagem_url,
    publicada: !!row.publicada,
    visualizacoes: row.visualizacoes,
    criadoEm: row.criado_em,
    comentarios: buscarComentarios(row.id),
  });
}

// Comentarios sao compostos pela noticia (E2): ao salvar, o conjunto atual
// substitui o anterior por completo — mais simples que rastrear diffs, e
// correto porque Noticia so expoe adicionarComentario(), nunca remocao.
function sincronizarComentarios(noticia) {
  db.prepare('DELETE FROM comentarios WHERE noticia_id = ?').run(noticia.id);
  const inserir = db.prepare(
    'INSERT INTO comentarios (id, noticia_id, leitor_id, autor_nome, texto, criado_em) VALUES (?, ?, ?, ?, ?, ?)'
  );
  noticia.comentarios.forEach((c) => {
    inserir.run(c.id, noticia.id, c.leitorId, c.autorNome, c.texto, c.criadoEm);
  });
}

export class NoticiaRepository {
  listar() {
    return db.prepare('SELECT * FROM noticias').all().map(paraModelo);
  }

  listarPublicadas() {
    return db.prepare('SELECT * FROM noticias WHERE publicada = 1').all().map(paraModelo);
  }

  listarPorCategoria(categoriaId) {
    return db.prepare('SELECT * FROM noticias WHERE categoria_id = ?').all(categoriaId).map(paraModelo);
  }

  buscarPorId(id) {
    const row = db.prepare('SELECT * FROM noticias WHERE id = ?').get(id);
    return row ? paraModelo(row) : null;
  }

  adicionar(noticia) {
    db.prepare(
      `INSERT INTO noticias
        (id, titulo, resumo, conteudo, categoria_id, autor_id, autor_nome, imagem_url, publicada, visualizacoes, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      noticia.id,
      noticia.titulo,
      noticia.resumo,
      noticia.conteudo,
      noticia.categoriaId,
      noticia.autorId ?? null,
      noticia.autorNome ?? null,
      noticia.imagemUrl ?? '',
      noticia.publicada ? 1 : 0,
      noticia.visualizacoes,
      noticia.criadoEm
    );
    sincronizarComentarios(noticia);
    return noticia;
  }

  atualizar(id, noticia) {
    const r = db
      .prepare(
        `UPDATE noticias
         SET titulo = ?, resumo = ?, conteudo = ?, categoria_id = ?, imagem_url = ?, publicada = ?, visualizacoes = ?
         WHERE id = ?`
      )
      .run(
        noticia.titulo,
        noticia.resumo,
        noticia.conteudo,
        noticia.categoriaId,
        noticia.imagemUrl ?? '',
        noticia.publicada ? 1 : 0,
        noticia.visualizacoes,
        id
      );
    if (r.changes === 0) return null;
    sincronizarComentarios(noticia);
    return noticia;
  }

  remover(id) {
    return db.prepare('DELETE FROM noticias WHERE id = ?').run(id).changes > 0;
  }
}

export default new NoticiaRepository();
