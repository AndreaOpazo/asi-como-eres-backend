import { Product, Resource } from "../types";

export default interface DaoInterface {
  read(id?: number | string): any;
  create(resourceData: Resource): Promise<Resource | null>;
  update(id: number | string, resourceData: Resource): Promise<Resource | null>;
  delete(id: number | string): Promise<Resource | null>;
  addProductToCart(productId: number | string): Promise<Product | null>;
}