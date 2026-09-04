import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getWishlist, toggleWishlist, removeWishlist } from '../controllers/wishlist.controller.js';
const r = Router();
r.get('/', authMiddleware, getWishlist);
r.post('/toggle', authMiddleware, toggleWishlist);
r.delete('/:productId', authMiddleware, removeWishlist);
export default r;
