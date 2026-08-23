import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export default class JsonRepository {
  #caminhoArquivo;
  #fabrica;
  #itens;

  constructor(caminhoArquivo, fabrica) {
    this.#caminhoArquivo = caminhoArquivo;
    this.#fabrica = fabrica;
    this.#itens = [];
    this.#carregar();
  }

  #carregar() {
    const pasta = dirname(this.#caminhoArquivo);
    if (!existsSync(pasta)) mkdirSync(pasta, { recursive: true });
    if (!existsSync(this.#caminhoArquivo)) {
      writeFileSync(this.#caminhoArquivo, '[]', 'utf-8');
    }
    const bruto = readFileSync(this.#caminhoArquivo, 'utf-8');
    const dados = JSON.parse(bruto || '[]');
    this.#itens = dados.map((item) => this.#fabrica(item));
  }

  #persistir() {
    const serializado = JSON.stringify(this.#itens.map((item) => item.toJSON()), null, 2);
    writeFileSync(this.#caminhoArquivo, serializado, 'utf-8');
  }

  listar() {
    return [...this.#itens];
  }

  buscarPorId(id) {
    return this.#itens.find((item) => item.id === id) ?? null;
  }

  adicionar(item) {
    this.#itens.push(item);
    this.#persistir();
    return item;
  }

  atualizar(id, item) {
    const indice = this.#itens.findIndex((i) => i.id === id);
    if (indice === -1) return null;
    this.#itens[indice] = item;
    this.#persistir();
    return item;
  }

  remover(id) {
    const indice = this.#itens.findIndex((i) => i.id === id);
    if (indice === -1) return false;
    this.#itens.splice(indice, 1);
    this.#persistir();
    return true;
  }

  salvar() {
    this.#persistir();
  }
}
