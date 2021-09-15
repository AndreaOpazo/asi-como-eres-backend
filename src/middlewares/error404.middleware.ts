import { Request, Response, NextFunction } from 'express';

const error404Middleware = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ error: -2, description: 'Ruta no implementada' });
};

export default error404Middleware;