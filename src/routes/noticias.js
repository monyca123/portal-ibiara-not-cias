import { Router } from 'express';
import { noticiaController } from '../controllers/noticiaController.js';

const router = Router();

router.get('/', noticiaController.listarTodas);
router.get('/:id', noticiaController.buscarPorId);
router.post('/', noticiaController.criar);
router.put('/:id', noticiaController.atualizar);
router.delete('/:id', noticiaController.remover);
router.post('/:id/comentarios', noticiaController.adicionarComentario);

export default router;
