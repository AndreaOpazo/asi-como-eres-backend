import { ResourceNames } from '../../constants';
import persistanceFactory from '../dao/persistanceFactory';
import DaoInterface from '../interfaces/dao.interface';
import { Product } from '../types';

export class ProductsService {
  private persistanceType = persistanceFactory(ResourceNames.PRODUCTS) as DaoInterface;

  public getProducts = async () => {
    return await this.persistanceType.read();
  };

  public getProductById = async (id: number) => {
    return await this.persistanceType.read(id);
  };

  public addProduct = async (product: Product) => {
    return await this.persistanceType.create(product);
  };

  public updateProduct = async (id: number, product: Product) => {
    return await this.persistanceType.update(id, product);
  };

  public deleteProduct = async (id: number) => {
    return await this.persistanceType.delete(id);
  };
}
