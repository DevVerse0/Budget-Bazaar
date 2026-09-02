import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controllers/otp.controller.js';
const r = Router();
r.post('/request', requestOtp);
r.post('/verify', verifyOtp);
export default r;
