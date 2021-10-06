import DaoInterface from "../interfaces/dao.interface";
import { Product, Resource } from "../types";

export default class MongoDbaas implements DaoInterface {
  private resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }
  addProductToCart(cartId: number, productId: number): Promise<Product> {
    throw new Error("Method not implemented.");
  }
  
  read(id?: number) {
    throw new Error("Method not implemented.");
  }
  create(resourceData: Resource): Promise<Resource | null> {
    throw new Error("Method not implemented.");
  }
  update(id: number, product: Product): Promise<Resource | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<Resource | null> {
    throw new Error("Method not implemented.");
  }
}