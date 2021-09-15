import { Router } from 'express';
import { Route } from '../interfaces/routes.interface';
import { ProductsController } from '../controllers/products.controller';
import { authorizationMiddleware } from '../middlewares/authorizationMiddleware';

export class ProductsRoute implements Route {
  public path = '/products';
  public router = Router();
  private productsController = new ProductsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/list`, this.productsController.getList);
    this.router.get(`${this.path}/list/:id`, this.productsController.getProductById);
    this.router.post(
      `${this.path}/add`,
      authorizationMiddleware({ path: `${this.path}/add`, method: 'addProduct' }),
      this.productsController.addProduct
    );
    this.router.put(
      `${this.path}/update/:id`,
      authorizationMiddleware({ path: `${this.path}/update/:id`, method: 'updateProduct' }),
      this.productsController.updateProduct
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      authorizationMiddleware({ path: `${this.path}/delete/:id`, method: 'deleteProduct' }),
      this.productsController.deleteProduct
    );
  }
}
