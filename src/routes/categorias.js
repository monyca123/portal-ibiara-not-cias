import { Router } from 'express';
import { categoriaController } from '../controllers/categoriaController.js';
import { exigirLogin } from '../middleware/auth.js';

const router = Router();

router.get('/', categoriaController.listarTodas);
router.get('/:id', categoriaController.buscarPorId);
router.post('/', exigirLogin, categoriaController.criar);
router.put('/:id', exigirLogin, categoriaController.atualizar);
router.delete('/:id', exigirLogin, categoriaController.remover);

export default router;
