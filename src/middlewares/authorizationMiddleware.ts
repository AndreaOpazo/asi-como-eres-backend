import { NextFunction, Response, Request } from 'express';
import HttpException from '../exceptions/HttpException';
import { MiddlewareParams } from '../types';

const isAdmin = true;

export const authorizationMiddleware = ({ path, method }: MiddlewareParams) => (req: Request, _res: Response, next: NextFunction) => {
  if (!isAdmin) {
    return next(
      new HttpException(403, `Ruta ${path} metodo ${method} no autorizada`)
    );
  }
  next();
};
