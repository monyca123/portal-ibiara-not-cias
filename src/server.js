import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import noticiasRouter from './routes/noticias.js';
import categoriasRouter from './routes/categorias.js';
import authRouter from './routes/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

app.use('/api/noticias', noticiasRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

app.listen(PORT, () => {
  console.log(`Ibiara Noticias rodando em http://localhost:${PORT}`);
});
