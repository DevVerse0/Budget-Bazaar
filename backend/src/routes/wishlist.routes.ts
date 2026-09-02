import { Router } from 'express'; const r = Router(); r.get('/', (req,res)=>res.json({msg:'wishlist ok'})); export default r;
