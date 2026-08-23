import Usuario from './Usuario.js';

export default class Autor extends Usuario {
  #biografia;

  constructor(nome, email, senhaHash, biografia = '', id) {
    super(nome, email, senhaHash, id);
    this.#biografia = biografia;
  }

  get biografia() { return this.#biografia; }

  papel() {
    return 'autor';
  }

  permissoes() {
    return ['criar_noticia', 'editar_propria_noticia', 'excluir_propria_noticia'];
  }

  podeEditar(noticia) {
    return noticia.autorId === this.id;
  }

  toJSON() {
    return { ...super.toJSON(), biografia: this.#biografia };
  }
}
