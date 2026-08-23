import { authService } from '../services/authService.js';

export const authController = {
  login(req, res) {
    const usuario = authService.login(req.body);
    res.json(usuario);
  },
};
