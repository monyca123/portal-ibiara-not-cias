import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import noticiasRouter from './routes/noticias.js';
import categoriasRouter from './routes/categorias.js';
import authRouter from './routes/auth.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors()); // antes das rotas — middleware roda na ordem de registro
app.use(express.json());
app.use(logger);
app.use(express.static(join(__dirname, '..', 'public')));

app.use('/api/noticias', noticiasRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

// Error handler: sempre o ultimo app.use(). Captura os erros lancados
// pelos services (com err.status) e converte em resposta HTTP.
app.use(errorHandler);

export default app;
