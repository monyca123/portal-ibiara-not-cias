import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import JsonRepository from './JsonRepository.js';
import Noticia from '../models/Noticia.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAMINHO = join(__dirname, '..', 'data', 'noticias.json');

export class NoticiaRepository extends JsonRepository {
  constructor() {
    super(CAMINHO, (dados) => new Noticia(dados));
  }

  listarPorCategoria(categoriaId) {
    return this.listar().filter((n) => n.categoriaId === categoriaId);
  }

  listarPublicadas() {
    return this.listar().filter((n) => n.publicada);
  }
}

// Singleton usado pela camada de service (papel do "model" do E3: dados + acesso)
export default new NoticiaRepository();
