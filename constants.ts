export const CART_NOT_FOUND = 'Cart not found.';
export const PRODUCT_NOT_FOUND = 'Product not found.'
export const PRODUCT_IS_NOT_ADDED = 'The product could not be added.'

export const FS: number = 0;
export const MYSQL_MARIADB: number = 1;
export const SQLITE3: number = 2;
export const MONGODB: number = 3;
export const MONGODBAAS: number = 4;
export const FIREBASE: number = 5;

export const USED_PERSISTENCY_TYPE: number = MYSQL_MARIADB;

export enum ResourceNames {
  PRODUCTS = 'products',
  CART = 'cart'
}

export const optionsMaria = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ecommerce",
  },
};