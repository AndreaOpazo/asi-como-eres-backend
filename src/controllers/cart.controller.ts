import { NextFunction, Response, Request } from 'express';
import { CartService } from '../services/cart.service';

export class CartController {
  private cartService = new CartService();

  public getCartList = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cartList = await this.cartService.getCarts();
      res.status(200).json(cartList);
    } catch (error) {
      next(error);
    }
  }

  public getProductsByCartId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await this.cartService.getCartById(Number(req.params.id));
      if (cart) {
        res.status(200).json(cart.products);
      } else {
        res.status(404).json({ error: 'Cart not found.' })
      }
    } catch (error) {
      next(error);
    }
  }

  public addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId, productId } = req.params
      const productSaved = await this.cartService.addProductToCart(Number(cartId), Number(productId));
      if (productSaved) {
        res.status(200).json(productSaved);
      } else {
        res.status(404).json({ error: 'Product or Cart not found.' })
      }
    } catch (error) {
      next(error);
    }
  }

  public deleteCartProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartProductsDeleted = await this.cartService.deleteCartProducts(Number(req.params.id));
      if (cartProductsDeleted) {
        res.status(200).json(cartProductsDeleted);
      } else {
        res.status(404).json({ error: 'Product or Cart not found.' })
      }
    } catch (error) {
      next(error);
    }
  }
}
