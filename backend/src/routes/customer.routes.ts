import { Router } from 'express'; const r = Router(); r.get('/', (req,res)=>res.json({msg:'customer ok'})); export default r;
