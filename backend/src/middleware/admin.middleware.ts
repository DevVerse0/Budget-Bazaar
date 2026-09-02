import { Request, Response, NextFunction } from 'express';
export function adminMiddleware(req:Request,res:Response,next:NextFunction){
  const profile = (req as any).profile;
  if(!profile || profile.role !== 'admin') return res.status(403).json({ error:'Admin only' });
  next();
}
