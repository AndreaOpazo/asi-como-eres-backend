import { NextFunction, Response, Request } from 'express';
// import { Answer, AnswerInput, AnswerUpdateInput } from '../entities';
// import { AnswerService } from '../services';

export class ProductsController {
  // public answerService = new AnswerService();

  public getList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 123}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 456}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 7}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 8}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 9}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }
}
