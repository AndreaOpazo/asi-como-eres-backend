import fs from 'fs/promises';
import DaoInterface from "../interfaces/dao.interface";
import { Product, Resource } from "../types";
import { ResourceNames } from "../../constants";

export default class Fs implements DaoInterface {
  private resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  async read(id?: number | string): Promise<any> {
    try {
      const listFileContent = await fs.readFile(`src/data/${this.resource}.txt`, 'utf-8');
      if (!listFileContent && !id) return [];
      const list = JSON.parse(listFileContent);
      if (this.resource === ResourceNames.PRODUCTS) {
        if (id) return list.find((product: Product) => Number(product.id) === Number(id));
      } else {
        if (id) return list[0].products.find((product: Product) => Number(product.id) === Number(id));
      };
      return list;
    } catch (error) {
      console.error(error);
    }
  }

  async create(resourceData: Resource): Promise<Resource | null> {
    try {
      let id = 1;
      const productList = await this.read();
      if (productList.length > 0) {
        const productIds = productList.map((product: Product) => product.id);
        id = Math.max(...productIds) + 1;
      }
      resourceData['id'] = id;
      resourceData['timestamp'] = Date.now();
      productList.push(resourceData);
      await fs.writeFile('src/data/products.txt', JSON.stringify(productList));
      return resourceData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(id: number | string, resourceData: Resource): Promise<Resource | null> {
    try {
      const productList = await this.read();
      const productIndexToUpdate = productList.findIndex((productToFind: Product) => Number(productToFind.id) === Number(id));
      const timestamp = productList[productIndexToUpdate].timestamp;
      if (productIndexToUpdate !== -1) {
        productList[productIndexToUpdate] = {...resourceData, id, timestamp };
        await fs.writeFile('src/data/products.txt', JSON.stringify(productList));
        return resourceData;
      } else {
        return null;
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addProductToCart(productId: number): Promise<Product | null> {
    try {
      const cartList = await this.read();

      const productListFileContent = await fs.readFile('src/data/products.txt', 'utf-8');
      const productList = JSON.parse(productListFileContent);

      const productToAdd = productList.find((product: Product) => Number(product.id) === Number(productId));
      if (!productToAdd) throw Error;

      if (cartList.length > 0) {
        cartList[0].products.push(productToAdd);
      } else {
        cartList.push({id: 1, products: [productToAdd], timestamp: Date.now()});
      }

      await fs.writeFile('src/data/cart.txt', JSON.stringify(cartList))

      return productToAdd;
    } catch (error) {
      console.log(error);
      return null;
    };
  }

  async delete(id: number | string): Promise<Resource | null> {
    try {
      const list = await this.read();

      if (this.resource === ResourceNames.CART) {
        const productToRemove = list[0].products.find((product: Product) => Number(product.id) === Number(id));
        if (!productToRemove) throw Error;
        
        list[0].products = list[0].products.filter((product: Product) => Number(product.id) !== Number(id));

        await fs.writeFile('src/data/cart.txt', JSON.stringify(list));
  
        return list; // muestra el cart actualizado, es decir, con el producto borrado. 
      } else {
        const productIndexToDelete = list.findIndex((productToFind: Product) => Number(productToFind.id) === Number(id));
        if (productIndexToDelete !== -1) {
          const productToDelete = list[productIndexToDelete];
          list.splice(productIndexToDelete, 1);
          await fs.writeFile('src/data/products.txt', JSON.stringify(list));
          return productToDelete; // muestra el producto borrado
        } else {
          throw Error;
        };
      }
    } catch (error) {
      console.log(error);
      return null;
    };
  }
}