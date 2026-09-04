import { randomUUID } from 'node:crypto';

export default class Comentario {
  #id;
  #leitorId;
  #autorNome;
  #texto;
  #criadoEm;

  constructor({ leitorId, autorNome, texto, id = randomUUID(), criadoEm = new Date().toISOString() }) {
    if (!texto || texto.trim().length === 0) {
      throw new Error('Comentario nao pode ser vazio.');
    }
    if (!leitorId) {
      throw new Error('Comentario precisa de um leitor autenticado.');
    }
    this.#id = id;
    this.#leitorId = leitorId;
    this.#autorNome = autorNome || 'Leitor';
    this.#texto = texto.trim();
    this.#criadoEm = criadoEm;
  }

  get id() { return this.#id; }
  get leitorId() { return this.#leitorId; }
  get autorNome() { return this.#autorNome; }
  get texto() { return this.#texto; }
  get criadoEm() { return this.#criadoEm; }

  toJSON() {
    return {
      id: this.#id,
      leitorId: this.#leitorId,
      autorNome: this.#autorNome,
      texto: this.#texto,
      criadoEm: this.#criadoEm,
    };
  }
}
