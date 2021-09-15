import { NextFunction, Response, Request } from 'express';
// import { Answer, AnswerInput, AnswerUpdateInput } from '../entities';
// import { AnswerService } from '../services';

export class ChartController {
  // public answerService = new AnswerService();

  public getChartList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 1}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public getProductsByChartId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 2}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public addProductToChart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 3}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public deleteChartProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const answers: Answer[] = await this.answerService.findAllAnswers();
      const productList = [{asd: 4}];
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }
}
