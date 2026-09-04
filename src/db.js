import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const db = new DatabaseSync(join(__dirname, '..', 'banco.db'));

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id   TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('local', 'geral'))
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id         TEXT PRIMARY KEY,
    nome       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    papel      TEXT NOT NULL CHECK (papel IN ('autor', 'administrador', 'leitor')),
    biografia  TEXT
  );

  CREATE TABLE IF NOT EXISTS noticias (
    id            TEXT PRIMARY KEY,
    titulo        TEXT NOT NULL,
    resumo        TEXT NOT NULL,
    conteudo      TEXT NOT NULL,
    categoria_id  TEXT NOT NULL,
    autor_id      TEXT,
    autor_nome    TEXT,
    imagem_url    TEXT,
    publicada     INTEGER NOT NULL DEFAULT 1,
    visualizacoes INTEGER NOT NULL DEFAULT 0,
    criado_em     TEXT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS comentarios (
    id         TEXT PRIMARY KEY,
    noticia_id TEXT NOT NULL,
    leitor_id  TEXT NOT NULL,
    autor_nome TEXT NOT NULL,
    texto      TEXT NOT NULL,
    criado_em  TEXT NOT NULL,
    FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE,
    FOREIGN KEY (leitor_id) REFERENCES usuarios(id)
  );
`);
