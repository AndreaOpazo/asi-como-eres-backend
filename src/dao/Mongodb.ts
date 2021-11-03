import DaoInterface from '../interfaces/dao.interface';
import { Product, Resource } from '../types';
import mongoose, { Model } from 'mongoose';
import { productModel } from '../models/products';
import { cartModel } from '../models/cart';
import { PRODUCT_NOT_FOUND, ResourceNames } from '../../constants';
import { getActualDate } from '../utils';

export default class Mongodb implements DaoInterface {
  private model: Model<any>;

  constructor(resource: string, dbUrl: string) {
    this.model = resource === ResourceNames.CART ? cartModel : productModel;
    mongoose.connect(dbUrl);
  }

  async read(id?: number | string) {
    if (this.model === productModel) {
      if (id) return await this.model.findById(id);
    } else {
      if (id) {
        const cartList = await this.model.find();
        if (cartList.length > 0) {
          return cartList[0].products.find((product: Product) => product.id === id);
        }
        throw Error;
      }
    }
    return await this.model.find();
  }

  async addProductToCart(productId: number | string): Promise<Product> {
    const productToAdd = await productModel.findById(productId);
    if (!productToAdd) throw new Error(PRODUCT_NOT_FOUND);

    let carts = await this.read();
    let cart
    if (carts.length === 0) {
      cart = await this.model.create({ products: [] as Product[], date: getActualDate() });
    } else {
      cart = carts[0];
    };

    cart.products.push(productToAdd);

    await cartModel.findByIdAndUpdate(cart._id, cart);
    return cart; //muestra el cart actualizado
  }

  async create(resourceData: Resource): Promise<Resource | null> {
    try {
      const productToAdd = {...resourceData, date: getActualDate()};
      await this.model.create(productToAdd);
      return productToAdd;
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number | string, resourceData: Resource): Promise<Resource | null> {
    let product = await this.model.findById(id);
    if (!product) throw new Error(PRODUCT_NOT_FOUND);
    await this.model.findByIdAndUpdate(id, resourceData);
    return resourceData;
  }

  async delete(id: number | string): Promise<Resource | null> {
    if ( this.model === productModel) {
      const resourceToDelete = await this.model.findByIdAndDelete(id);
      return resourceToDelete; // muestra el product borrado
    }
    let carts = await this.read();
    const cart = carts[0];
    const existsProductInCart = cart.products.find((product: Product) => product.id === id);
    if (!existsProductInCart) throw new Error(PRODUCT_NOT_FOUND);
    cart.products = cart.products.filter((product: Product) => product.id !== id);
    await this.model.findByIdAndUpdate(cart._id, cart);
    return cart; //muestra el objeto cart actualizado
  }
}