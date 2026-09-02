import { Router } from 'express'; const r = Router(); r.get('/', (req,res)=>res.json({msg:'review ok'})); export default r;
