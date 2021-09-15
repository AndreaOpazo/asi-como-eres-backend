export type MiddlewareParams = {
  path: string;
  method: string;
};

export type Product = {
  id: number;
  timestamp: number;
  name: string;
  description: string;
  code: number;
  image: string;
  price: number;
  stock: number;
};

export type Cart = {
  id: number;
  products: Product[];
  timestamp: number;
};