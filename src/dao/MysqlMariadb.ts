import DaoInterface from "../interfaces/dao.interface";
import { Product, Resource } from "../types";
import { optionsMaria, PRODUCT_NOT_FOUND, ResourceNames } from "../../constants";
import RelationalDB from "./RelationalDB";

const knex = require('knex')(optionsMaria);

export default class MysqlMariadb extends RelationalDB implements DaoInterface {
  private resource: string;

  constructor(resource: string) {
    super();
    this.resource = resource;
  }
  
  async read(id?: number | string) {
    await super.checkTables(knex);
    const tableName = this.resource;
    try {
      if (id) return await knex.from(tableName).where("id", id).first();
      return await knex.from(tableName).select("*");
    } catch (error) {
      console.error(error);
    };
  }

  async create(resourceData: Resource): Promise<Resource | null> {
    await super.checkTables(knex);
    try {
      await knex(this.resource).insert(resourceData);
      return resourceData;
    } catch (error) {
      console.error(error);
      return null;
    };
  }

  async update(id: number | string, product: Product): Promise<Resource | null> {
    await super.checkTables(knex);
    const tableName = this.resource;
    try {
      await knex(tableName).where("id", id).update(product);
      return await knex.from(tableName).where("id", id).first();
    } catch (error) {
      console.error(error);
      return null;
    };
  }

  async addProductToCart(cartId: number | string, productId: number): Promise<Product | null> {
    await super.checkTables(knex);
    try {
      const tableCart = this.resource;
      const tableProducts = ResourceNames.PRODUCTS;
      const productToAdd = await knex.from(tableProducts).where("id", productId).first();
      if (!productToAdd) throw new Error(PRODUCT_NOT_FOUND); 
      let cart = await this.read(cartId);
      if (!cart) cart = await this.create({ products: '[]'} as Resource);
      const jsonProducts = JSON.parse(cart.products);
      jsonProducts.push(productToAdd);
      await knex(tableCart).where("id", cartId).update({products: JSON.stringify(jsonProducts)});
      return productToAdd;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(id: number | string): Promise<Resource | null> {
    await super.checkTables(knex);
    const tableName = this.resource;
    try {
      if (tableName === ResourceNames.PRODUCTS) {
        const productToDelete = await knex.from(tableName).where("id", id).first();
        await knex.from(tableName).where("id", id).del();
        if (productToDelete.length === 0) throw new Error();
        return productToDelete;
      }
      await knex(tableName).where("id", id).update({products: JSON.stringify([])});
      const cart = await knex.from(tableName).where("id", id).first();
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    };
  };
}