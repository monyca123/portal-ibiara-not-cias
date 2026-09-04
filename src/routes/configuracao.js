import { Router } from 'express';
import { configuracaoController } from '../controllers/configuracaoController.js';
import { exigirLogin, exigirAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', configuracaoController.obter);
router.put('/', exigirLogin, exigirAdmin, configuracaoController.atualizar);

export default router;
