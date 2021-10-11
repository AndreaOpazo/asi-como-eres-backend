import { Knex } from "knex";
import { ResourceNames } from "../../constants";

export default class RelationalDB {
  protected async checkTables(knex: Knex) {
    const tableCart = ResourceNames.CART;
    const tableProducts = ResourceNames.PRODUCTS;
    const tableProductsExists = await knex.schema.hasTable(tableProducts);
    if (!tableProductsExists) {
      await knex.schema.createTable(tableProducts, (table: Knex.TableBuilder) => {
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
    const tableCartExists = await knex.schema.hasTable(tableCart);
    if (!tableCartExists) {
      await knex.schema.createTable(tableCart, (table: Knex.TableBuilder) => {
        table.increments("id", { primaryKey: true }).notNullable();
        table.specificType("products", 'json');
        table.timestamp("date").defaultTo(knex.fn.now());
      });
    }
  }
};