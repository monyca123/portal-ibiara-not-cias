import { randomUUID } from 'node:crypto';

export default class Usuario {
  #id;
  #nome;
  #email;
  #senhaHash;

  constructor(nome, email, senhaHash, id = randomUUID()) {
    if (new.target === Usuario) {
      throw new Error('Usuario e uma classe abstrata e nao pode ser instanciada diretamente.');
    }
    this.#id = id;
    this.#nome = nome;
    this.#email = email;
    this.#senhaHash = senhaHash;
  }

  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get email() { return this.#email; }
  get senhaHash() { return this.#senhaHash; }

  set nome(valor) {
    if (!valor || valor.trim().length < 2) {
      throw new Error('Nome invalido.');
    }
    this.#nome = valor.trim();
  }

  permissoes() {
    throw new Error('Subclasses de Usuario devem implementar permissoes().');
  }

  papel() {
    throw new Error('Subclasses de Usuario devem implementar papel().');
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      senhaHash: this.#senhaHash,
      papel: this.papel(),
      permissoes: this.permissoes(),
    };
  }
}
