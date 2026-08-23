import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import JsonRepository from './JsonRepository.js';
import Categoria from '../models/Categoria.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAMINHO = join(__dirname, '..', 'data', 'categorias.json');

export default class CategoriaRepository extends JsonRepository {
  constructor() {
    super(CAMINHO, (dados) => new Categoria(dados.nome, dados.tipo, dados.id));
  }
}
