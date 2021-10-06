import fs from 'fs/promises';
import DaoInterface from "../interfaces/dao.interface";
import { Cart, Product, Resource } from "../types";
import { ResourceNames } from "../../constants";

export default class Fs implements DaoInterface {
  private resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  async read(id?: number): Promise<any> {
    try {
      const listFileContent = await fs.readFile(`src/data/${this.resource}.txt`, 'utf-8');
      const list = JSON.parse(listFileContent);
      if (id) {
        return list.find((resource: { id: number; }) => resource.id === id)
      };
      return list;
    } catch (error) {
      return [];
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

  async update(id: number, resourceData: Resource): Promise<Resource | null> {
    try {
      const productList = await this.read();
      const productIndexToUpdate = productList.findIndex((productToFind: Product) => productToFind.id === id);
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

  async addProductToCart(cartId: number, productId: number): Promise<Product | null> {
    try {
      const cartList = await this.read();

      const productListFileContent = await fs.readFile('src/data/products.txt', 'utf-8');
      const productList = JSON.parse(productListFileContent);

      const productToAdd = productList.find((product: Product) => product.id === productId);
      if (!productToAdd) throw Error;

      const cart = cartList.find((cart: Cart) => cart.id === cartId);
      if (!cart) throw Error;

      cart.products.push(productToAdd); 

      await fs.writeFile('src/data/cart.txt', JSON.stringify(cartList))

      return productToAdd;
    } catch (error) {
      console.log(error);
      return null;
    };
  }

  async delete(id: number): Promise<Resource | null> {
    try {
      const list = await this.read();

      if (this.resource === ResourceNames.CART) {
        const cart = list.find((cart: Cart) => cart.id === id);
        if (!cart) throw Error;
  
        cart.products = [];
  
        await fs.writeFile('src/data/cart.txt', JSON.stringify(list));
  
        return cart; // muestra el cart actualizado, es decir, con los productos borrados. 
      }

      const productIndexToDelete = list.findIndex((productToFind: Product) => productToFind.id === id);
      if (productIndexToDelete !== -1) {
        const productToDelete = list[productIndexToDelete];
        list.splice(productIndexToDelete, 1);
        await fs.writeFile('src/data/products.txt', JSON.stringify(list));
        return productToDelete; // muestra el producto borrado
      } else {
        throw Error;
      };
    } catch (error) {
      console.log(error);
      return null;
    };
  }
}