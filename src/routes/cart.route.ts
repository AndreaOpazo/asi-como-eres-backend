import { Router } from 'express';
import { Route } from '../interfaces/routes.interface';
import { CartController } from '../controllers/cart.controller';

export class CartRoute implements Route {
  public path = '/cart';
  public router = Router();
  private cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/list`, this.cartController.getCartList);
    this.router.get(`${this.path}/list/:id`, this.cartController.getProductsByCartId);
    this.router.post(`${this.path}/add/:productId/:cartId`, this.cartController.addProductToCart);
    this.router.delete(`${this.path}/delete/:id`, this.cartController.deleteCartProducts);
  }
}
