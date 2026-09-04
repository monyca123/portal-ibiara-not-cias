import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);
router.post('/registro', authController.registrar);
router.post('/registro-leitor', authController.registrarLeitor);

export default router;
