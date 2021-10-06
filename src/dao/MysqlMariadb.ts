import DaoInterface from "../interfaces/dao.interface";
import { Product, Resource } from "../types";
import { Knex } from "knex";
import { optionsMaria, ResourceNames } from "../../constants";

const knex = require('knex')(optionsMaria);

export default class MysqlMariadb implements DaoInterface {
  private resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }
  
  async createTable() {
    const tableName = this.resource;
    const tableExists = await knex.schema.hasTable(tableName);
    if (tableName === ResourceNames.PRODUCTS && !tableExists) {
      await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
        table.string("name", 20).notNullable();
        table.string("description").notNullable();
        table.integer("code");
        table.string("image").notNullable();
        table.float("price");
        table.integer("stock");
        table.timestamp("date").defaultTo(knex.fn.now());
        table.increments("id", { primaryKey: true }).notNullable();
      });
    }
    if (tableName === ResourceNames.CART && !tableExists) {
      await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
        table.increments("id", { primaryKey: true }).notNullable();
        table.specificType("products", 'json');
        table.timestamp("date").defaultTo(knex.fn.now());
      });
    }
  }

  async read(id?: number) {
    const tableName = this.resource;
    try {
      await this.createTable();
      if (id) return await knex.from(tableName).where("id", id).first();
      return await knex.from(tableName).select("*");
    } catch (error) {
      console.error(error);
    };
  }

  async create(resourceData: Resource): Promise<Resource | null> {
    try {
      await knex(this.resource).insert(resourceData);
      return resourceData;
    } catch (error) {
      console.error(error);
      return null;
    };
  }

  async update(id: number, product: Product): Promise<Resource | null> {
    const tableName = this.resource;
    try {
      await knex(tableName).where("id", id).update(product);
      return await knex.from(tableName).where("id", id).first();
    } catch (error) {
      console.error(error);
      return null;
    };
  }

  async addProductToCart(cartId: number, productId: number): Promise<Product | null> {
    try {
      const tableCart = this.resource;
      const tableProducts = ResourceNames.PRODUCTS;
      const productToAdd = await knex.from(tableProducts).where("id", productId).first();
      const cart = await knex.from(tableCart).where("id", cartId).first();
      const jsonProducts = JSON.parse(cart.products);
      jsonProducts.push(productToAdd);
      await knex(tableCart).where("id", cartId).update({products: JSON.stringify(jsonProducts)});
      return productToAdd;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(id: number): Promise<Resource | null> {
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