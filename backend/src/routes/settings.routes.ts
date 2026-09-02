import { Router } from 'express'; const r = Router(); r.get('/', (req,res)=>res.json({msg:'settings ok'})); export default r;
