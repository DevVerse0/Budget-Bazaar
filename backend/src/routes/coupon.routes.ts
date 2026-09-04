import { Router } from 'express';
import { validateCoupon } from '../controllers/coupon.controller.js';
const r = Router();
r.post('/validate', validateCoupon);
r.get('/', (req,res)=>res.json({msg:'coupon ok'}));
export default r;
