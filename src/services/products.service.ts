import fs from 'fs/promises';
import { Product } from '../types';

export class ProductsService {
  private getProductList = async () => {
    try {
      const productListFileContent = await fs.readFile('src/data/products.txt', 'utf-8');
      return JSON.parse(productListFileContent);
    } catch (error) {
      return [];
    }
  }

  public getProducts = async () => {
    try {
      return await this.getProductList();
    } catch (error) {
      console.log(error);
      return [];
    };
  };

  public getProductById = async (id: number) => {
    try {
      const productList = await this.getProductList();
      return productList.find((product: Product) => product.id === id)
    } catch (error) {
      console.log(error);
      return null;
    };
  };

  public addProduct = async (product: Product) => {
    try {
      let id = 1;
      const productList = await this.getProductList();
      if (productList.length) {
        const productIds = productList.map((product: Product) => product.id);
        id = Math.max(...productIds) + 1;
      }
      product['id'] = id;
      product['timestamp'] = Date.now();
      productList.push(product);
      await fs.writeFile('src/data/products.txt', JSON.stringify(productList));
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public updateProduct = async (id: number, product: Product) => {
    try {
      const productList = await this.getProductList();
      const productIndexToUpdate = productList.findIndex((productToFind: Product) => productToFind.id === id);
      const timestamp = productList[productIndexToUpdate].timestamp;
      if (productIndexToUpdate !== -1) {
        productList[productIndexToUpdate] = {...product, id, timestamp };
        await fs.writeFile('src/data/products.txt', JSON.stringify(productList));
        return product;
      } else {
        return null;
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public deleteProduct = async (id: number) => {
    try {
      const productList = await this.getProductList();
      const productIndexToDelete = productList.findIndex((productToFind: Product) => productToFind.id === id);
      
      if (productIndexToDelete !== -1) {
        const productToDelete = productList[productIndexToDelete];
        productList.splice(productIndexToDelete, 1);
        await fs.writeFile('src/data/products.txt', JSON.stringify(productList));
        return productToDelete;
      } else {
        throw Error;
      };
    } catch (error) {
      return null;
    }
  }
};