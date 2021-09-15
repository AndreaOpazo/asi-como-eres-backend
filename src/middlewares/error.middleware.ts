import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = (error: HttpException, _req: Request, res: Response, _next: NextFunction) => {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  res.status(status).json({ error: -1, description: message });
}

export default errorMiddleware;
