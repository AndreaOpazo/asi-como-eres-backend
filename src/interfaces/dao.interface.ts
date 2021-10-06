import { Product, Resource } from "../types";

export default interface DaoInterface {
  read(id?: number): any;
  create(resourceData: Resource): Promise<Resource | null>;
  update(id: number, resourceData: Resource): Promise<Resource | null>;
  delete(id: number): Promise<Resource | null>;
  addProductToCart(cartId: number, productId: number): Promise<Product | null>;
}