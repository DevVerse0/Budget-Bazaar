import { Router } from 'express'; const r = Router(); r.get('/', (req,res)=>res.json({msg:'banner ok'})); export default r;
