import { ResourceNames } from "../../constants";
import DaoInterface from "../interfaces/dao.interface";
import { Resource, Product, Cart } from "../types";
import { products, carts } from "../data/memory";

export default class Memory implements DaoInterface {
  private resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  read(id?: string | number) {
    try {
      if (this.resource === ResourceNames.PRODUCTS) {
        if (id) return products.find(product => Number(product.id) === Number(id));
        return products;
      } else {
        if (id) return (carts[0].products as Product[]).find(product => Number(product.id) === Number(id));
        return carts;
      };
    } catch (error) {
      console.error(error);
    };
  }

  async create(resourceData: Resource): Promise<Resource | null> {
    try {
      let id = 1;
      if (products.length > 0) {
        const productIds = products.map((product: Product) => Number(product.id));
        id = Math.max(...productIds) + 1;
      }
      resourceData.id = id;
      resourceData.timestamp = Date.now();
      products.push(resourceData as Product);
      return resourceData;
    } catch (error) {
      console.log(error);
      return null;
    };
  }

  async update(id: string | number, resourceData: Resource): Promise<Resource | null> {
    try {
      const productList = this.read() as Product[];
      const productIndexToUpdate = productList.findIndex((productToFind: Product) => Number(productToFind.id) === Number(id));
      const timestamp = productList[productIndexToUpdate].timestamp;
      if (productIndexToUpdate !== -1) {
        productList[productIndexToUpdate] = {...resourceData, id: Number(id), timestamp } as Product;
        return resourceData; // muestra el producto actualizado
      } else {
        return null;
      };
    } catch (error) {
      console.log(error);
      return null;
    };
  }

  async delete(id: string | number): Promise<Resource | null> {
    try {
      const list = this.read() as Product[] | Cart[];

      if (this.resource === ResourceNames.CART) {
        const cart = list[0] as Cart
        cart.products = (cart.products as Product[]).filter((product: Product) => product.id !== Number(id));
        return list[0]; // muestra el carrito actualizado
      } else {
        const productIndexToDelete = (list as Product[]).findIndex((productToFind: Product) => Number(productToFind.id) === Number(id));
        if (productIndexToDelete !== -1) {
          const productToDelete = list[productIndexToDelete];
          list.splice(productIndexToDelete, 1);
          return productToDelete; // muestra el producto borrado
        } else {
          throw Error;
        };
      };
    } catch (error) {
      console.log(error);
      return null;
    };
  }

  async addProductToCart(productId: string | number): Promise<Product> {
    try {
      const cartList = this.read() as Cart[];
      const productToAdd = products.find(product => Number(product.id) === Number(productId));
      if (!productToAdd) throw Error;
      if (cartList.length > 0) {
        (cartList[0].products as Product[]).push(productToAdd); 
      } else {
        cartList.push({id: 1, products: [productToAdd], timestamp: Date.now()} as Cart);
      };
      
      return productToAdd; // muestra el producto agregado
    } catch (error) {
      console.log(error);
      return null;
    };
  }
}