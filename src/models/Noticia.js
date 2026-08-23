import { randomUUID } from 'node:crypto';
import Comentario from './Comentario.js';

export default class Noticia {
  #id;
  #titulo;
  #resumo;
  #conteudo;
  #categoriaId;
  #autorId;
  #autorNome;
  #imagemUrl;
  #publicada;
  #visualizacoes;
  #criadoEm;
  #comentarios;

  constructor({
    titulo,
    resumo,
    conteudo,
    categoriaId,
    autorId,
    autorNome,
    imagemUrl = '',
    publicada = true,
    visualizacoes = 0,
    id = randomUUID(),
    criadoEm = new Date().toISOString(),
    comentarios = [],
  }) {
    if (!titulo || titulo.trim().length < 3) {
      throw new Error('Titulo da noticia invalido.');
    }
    if (!conteudo || conteudo.trim().length < 10) {
      throw new Error('Conteudo da noticia muito curto.');
    }
    this.#id = id;
    this.#titulo = titulo.trim();
    this.#resumo = (resumo || conteudo.slice(0, 140)).trim();
    this.#conteudo = conteudo.trim();
    this.#categoriaId = categoriaId;
    this.#autorId = autorId;
    this.#autorNome = autorNome;
    this.#imagemUrl = imagemUrl;
    this.#publicada = publicada;
    this.#visualizacoes = visualizacoes;
    this.#criadoEm = criadoEm;
    this.#comentarios = comentarios.map((c) =>
      c instanceof Comentario ? c : new Comentario(c.autorNome, c.texto, c.id, c.criadoEm)
    );
  }

  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get resumo() { return this.#resumo; }
  get conteudo() { return this.#conteudo; }
  get categoriaId() { return this.#categoriaId; }
  get autorId() { return this.#autorId; }
  get autorNome() { return this.#autorNome; }
  get imagemUrl() { return this.#imagemUrl; }
  get publicada() { return this.#publicada; }
  get visualizacoes() { return this.#visualizacoes; }
  get criadoEm() { return this.#criadoEm; }
  get comentarios() { return [...this.#comentarios]; }

  atualizar({ titulo, resumo, conteudo, categoriaId, imagemUrl, publicada }) {
    if (titulo) this.#titulo = titulo.trim();
    if (conteudo) this.#conteudo = conteudo.trim();
    if (resumo) this.#resumo = resumo.trim();
    if (categoriaId) this.#categoriaId = categoriaId;
    if (imagemUrl !== undefined) this.#imagemUrl = imagemUrl;
    if (publicada !== undefined) this.#publicada = publicada;
  }

  incrementarVisualizacao() {
    this.#visualizacoes += 1;
  }

  adicionarComentario(autorNome, texto) {
    const comentario = new Comentario(autorNome, texto);
    this.#comentarios.push(comentario);
    return comentario;
  }

  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      resumo: this.#resumo,
      conteudo: this.#conteudo,
      categoriaId: this.#categoriaId,
      autorId: this.#autorId,
      autorNome: this.#autorNome,
      imagemUrl: this.#imagemUrl,
      publicada: this.#publicada,
      visualizacoes: this.#visualizacoes,
      criadoEm: this.#criadoEm,
      comentarios: this.#comentarios.map((c) => c.toJSON()),
    };
  }
}
