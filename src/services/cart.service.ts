import fs from 'fs/promises';
import { Cart, Product } from '../types';

export class CartService {

  public getCarts = async () => {
    try {
      const cartListFileContent = await fs.readFile('src/data/carts.txt', 'utf-8');
      return JSON.parse(cartListFileContent);
    } catch (error) {
      return [];
    };
  };

  public getCartById = async (id: number) => {
    try {
      const cartList = await this.getCarts();
      return cartList.find((cart: Cart) => cart.id === id)
    } catch (error) {
      console.log(error);
      return null;
    };
  };

  public addProductToCart = async (cartId: number, productId: number) => {
    try {
      const cartList = await this.getCarts();

      const productListFileContent = await fs.readFile('src/data/products.txt', 'utf-8');
      const productList = JSON.parse(productListFileContent);

      const productToAdd = productList.find((product: Product) => product.id === productId);
      if (!productToAdd) throw Error;

      const cart = cartList.find((cart: Cart) => cart.id === cartId);
      if (!cart) throw Error;

      cart.products.push(productToAdd); 

      await fs.writeFile('src/data/carts.txt', JSON.stringify(cartList))

      return productToAdd;
    } catch (error) {
      console.log(error);
      return null;
    };
  };

  public deleteCartProducts = async (id: number) => {
    try {
      const cartList = await this.getCarts();
      const cart = cartList.find((cart: Cart) => cart.id === id);
      if (!cart) throw Error;

      cart.products = [];

      await fs.writeFile('src/data/carts.txt', JSON.stringify(cartList));

      return cart;
    } catch (error) {
      console.log(error);
      return null;
    };
  };
};