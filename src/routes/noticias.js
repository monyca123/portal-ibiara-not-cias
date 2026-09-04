import { Router } from 'express';
import { noticiaController } from '../controllers/noticiaController.js';
import { exigirLogin, exigirAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', noticiaController.listarTodas);
router.get('/:id', noticiaController.buscarPorId);
router.post('/', exigirLogin, noticiaController.criar);
router.put('/:id', exigirLogin, noticiaController.atualizar);
router.delete('/:id', exigirLogin, noticiaController.remover);
router.post('/:id/comentarios', exigirLogin, noticiaController.adicionarComentario);
router.delete('/:id/comentarios/:comentarioId', exigirLogin, exigirAdmin, noticiaController.removerComentario);

export default router;
