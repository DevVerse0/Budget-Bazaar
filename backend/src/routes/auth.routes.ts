import { Router } from 'express';
import { me, forgotPassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const r = Router();
r.get('/me', authMiddleware, me);
r.post('/forgot', forgotPassword);
export default r;
