import { Router } from 'express';
import { Route } from '../interfaces/routes.interface';
import { ChartController } from '../controllers/chart.controller';
// import { AnswerController } from '../controllers';
// import { UserRole } from '../entities';
// import { authMiddleware } from '../middlewares/auth.middleware';
// import { authorizationMiddleware } from '../middlewares/authorization.middleware';

export class ChartRoute implements Route {
  public path = '/chart';
  public router = Router();
  private chartController = new ChartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/list`, this.chartController.getChartList);
    this.router.get(`${this.path}/list/:id`, this.chartController.getProductsByChartId);
    this.router.post(`${this.path}/add/:productId`, this.chartController.addProductToChart);
    this.router.delete(`${this.path}/delete/:id`, this.chartController.deleteChartProducts);
  }
}
