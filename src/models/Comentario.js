import { randomUUID } from 'node:crypto';

export default class Comentario {
  #id;
  #autorNome;
  #texto;
  #criadoEm;

  constructor(autorNome, texto, id = randomUUID(), criadoEm = new Date().toISOString()) {
    if (!texto || texto.trim().length === 0) {
      throw new Error('Comentario nao pode ser vazio.');
    }
    this.#id = id;
    this.#autorNome = autorNome || 'Anonimo';
    this.#texto = texto.trim();
    this.#criadoEm = criadoEm;
  }

  get id() { return this.#id; }
  get autorNome() { return this.#autorNome; }
  get texto() { return this.#texto; }
  get criadoEm() { return this.#criadoEm; }

  toJSON() {
    return { id: this.#id, autorNome: this.#autorNome, texto: this.#texto, criadoEm: this.#criadoEm };
  }
}
