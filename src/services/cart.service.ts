import { ResourceNames } from '../../constants';
import persistanceFactory from '../dao/persistanceFactory';
import DaoInterface from '../interfaces/dao.interface';

export class CartService  {
  private persistanceType = persistanceFactory(ResourceNames.CART) as DaoInterface;

  public getCarts = async () => {
    return await this.persistanceType.read();
  };

  public getProductByCart = async (id: number | string) => {
    return await this.persistanceType.read(id);
  };

  public addProductToCart = async (productId: number | string) => {
    return await this.persistanceType.addProductToCart(productId);
  };

  public deleteCartProducts = async (id: number | string) => {
    return await this.persistanceType.delete(id);
  };
}