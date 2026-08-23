import { randomUUID } from 'node:crypto';

const TIPOS_VALIDOS = ['local', 'geral'];

export default class Categoria {
  #id;
  #nome;
  #tipo;

  constructor(nome, tipo, id = randomUUID()) {
    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw new Error(`Tipo de categoria invalido: ${tipo}. Use 'local' ou 'geral'.`);
    }
    this.#id = id;
    this.#nome = nome;
    this.#tipo = tipo;
  }

  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get tipo() { return this.#tipo; }

  set nome(valor) {
    if (!valor || valor.trim().length < 2) {
      throw new Error('Nome de categoria invalido.');
    }
    this.#nome = valor.trim();
  }

  toJSON() {
    return { id: this.#id, nome: this.#nome, tipo: this.#tipo };
  }
}
