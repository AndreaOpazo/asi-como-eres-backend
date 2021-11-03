import { NextFunction, Response, Request } from 'express';
import { PRODUCT_IS_NOT_ADDED, PRODUCT_NOT_FOUND } from '../../constants';
import { CartService } from '../services/cart.service';
import { Cart } from '../types';

export class CartController {
  private cartService = new CartService();

  public getCartList = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cartList = await this.cartService.getCarts();
      cartList.forEach((cart: Cart) => {
        if (this.IsJsonString(cart.products)) cart.products = JSON.parse(cart.products as string);
      });
      res.status(200).json(cartList);
    } catch (error) {
      next(error);
    }
  }

  public getProductByCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productInCart = await this.cartService.getProductByCart(req.params.id);
      if (productInCart) {
        res.status(200).json(this.IsJsonString(productInCart) ? JSON.parse(productInCart) : productInCart);
      } else {
        res.status(404).json({ error: PRODUCT_NOT_FOUND })
      }
    } catch (error) {
      next(error);
    }
  }

  public addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params
      const productSaved = await this.cartService.addProductToCart(productId);
      if (productSaved) {
        res.status(200).json(productSaved);
      } else {
        res.status(404).json({ error: PRODUCT_IS_NOT_ADDED })
      }
    } catch (error) {
      next(error);
    }
  }

  public deleteCartProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartProductsDeleted = await this.cartService.deleteCartProducts(req.params.id);
      if (cartProductsDeleted) {
        res.status(200).json(cartProductsDeleted);
      } else {
        res.status(404).json({ error: PRODUCT_NOT_FOUND })
      }
    } catch (error) {
      next(error);
    }
  }

  private IsJsonString(value: any) {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
    return true;
  }
}
