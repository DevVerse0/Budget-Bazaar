import { Router } from 'express'; const r = Router(); r.get('/', (req,res)=>res.json({msg:'campaign ok'})); export default r;
