import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import criarRotasNoticias from './routes/noticias.js';
import criarRotasCategorias from './routes/categorias.js';
import criarRotasAuth from './routes/auth.js';
import NoticiaRepository from './repositories/NoticiaRepository.js';
import CategoriaRepository from './repositories/CategoriaRepository.js';
import UsuarioRepository from './repositories/UsuarioRepository.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Composition root (DIP): as unicas linhas do projeto que sabem que a
// persistencia e feita em arquivos JSON. Se um dia trocarmos para outro
// banco, so este bloco muda — rotas e modelos continuam intocados.
const noticiaRepo = new NoticiaRepository();
const categoriaRepo = new CategoriaRepository();
const usuarioRepo = new UsuarioRepository();

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

app.use('/api/noticias', criarRotasNoticias(noticiaRepo));
app.use('/api/categorias', criarRotasCategorias(categoriaRepo));
app.use('/api/auth', criarRotasAuth(usuarioRepo));

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

app.listen(PORT, () => {
  console.log(`Ibiara Noticias rodando em http://localhost:${PORT}`);
});
