import { ResourceNames } from '../../constants';
import persistanceFactory from '../dao/persistanceFactory';
import DaoInterface from '../interfaces/dao.interface';
import { Product } from '../types';

export class ProductsService {
  private persistanceType = persistanceFactory(ResourceNames.PRODUCTS) as DaoInterface;

  public getProducts = async (queryParams: any) => {
    let productList = await this.persistanceType.read();
    const { name, code, priceMin, priceMax, stockMin, stockMax } = queryParams;
    if (productList.length !== 0 ) {
      if (name) {
        productList = productList.filter((product: Product) => product.name === name);
      };
      if (code) {
        productList = productList.filter((product: Product) => product.code === Number(code));
      };
      if (priceMin) {
        productList = productList.filter((product: Product) => product.price >= Number(priceMin));
      };
      if (priceMax) {
        productList = productList.filter((product: Product) => product.price <= Number(priceMax));
      };
      if (stockMin) {
        productList = productList.filter((product: Product) => product.stock >= Number(stockMin));
      };
      if (stockMax) {
        productList = productList.filter((product: Product) => product.stock <= Number(stockMax));
      };
    }
    return productList;
  };

  public getProductById = async (id: number | string) => {
    return await this.persistanceType.read(id);
  };

  public addProduct = async (product: Product) => {
    return await this.persistanceType.create(product);
  };

  public updateProduct = async (id: number | string, product: Product) => {
    return await this.persistanceType.update(id, product);
  };

  public deleteProduct = async (id: number | string) => {
    return await this.persistanceType.delete(id);
  };
}
