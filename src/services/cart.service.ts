import { ResourceNames } from '../../constants';
import persistanceFactory from '../dao/persistanceFactory';
import DaoInterface from '../interfaces/dao.interface';

export class CartService  {
  private persistanceType = persistanceFactory(ResourceNames.CART) as DaoInterface;

  public getCarts = async () => {
    return await this.persistanceType.read();
  };

  public getCartById = async (id: number) => {
    return await this.persistanceType.read(id);
  };

  public addProductToCart = async (cartId: number, productId: number) => {
    return await this.persistanceType.addProductToCart(cartId, productId);
  };

  public deleteCartProducts = async (id: number) => {
    return await this.persistanceType.delete(id);
  };
}