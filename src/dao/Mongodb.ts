import DaoInterface from '../interfaces/dao.interface';
import { Product, Resource } from '../types';
import mongoose, { Model } from 'mongoose';
import { productModel } from '../models/products';
import { cartModel } from '../models/cart';
import { CART_NOT_FOUND, PRODUCT_NOT_FOUND, ResourceNames } from '../../constants';
import { getActualDate } from '../utils';

export default class Mongodb implements DaoInterface {
  private model: Model<any>;

  constructor(resource: string, dbUrl: string) {
    this.model = resource === ResourceNames.CART ? cartModel : productModel;
    mongoose.connect(dbUrl);
  }

  async read(id?: number | string) {
    if (id) return await this.model.findById(id);
    return await this.model.find();
  }

  async addProductToCart(cartId: number | string, productId: number | string): Promise<Product> {
    const productToAdd = await productModel.findById(productId);
    if (!productToAdd) throw new Error(PRODUCT_NOT_FOUND);

    //si el card id no existe, crea un cart --> esto se realiza asi, ya que no hay ningun endpoint para crear un cart
    let cart = await cartModel.findById(cartId);
    if (!cart) cart = await this.model.create({ products: [] as Product[], date: getActualDate() });

    cart.products.push(productToAdd);

    await cartModel.findByIdAndUpdate(cart._id, { ...cart, products: cart.products });
    return cart; //muestra el objeto cart actualizado, corroborar en list para ver si se creo bien.
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
      return resourceToDelete;
    }
    let cart = await this.model.findById(id);
    if (!cart) throw new Error(CART_NOT_FOUND); 
    cart.products = [];
    await this.model.findByIdAndUpdate(id, cart);
    return cart;
  }
}