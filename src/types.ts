export type MiddlewareParams = {
  path: string;
  method: string;
};

export type Product = {
  id: number | string;
  timestamp: number | string;
  name: string;
  description: string;
  code: number;
  image: string;
  price: number;
  stock: number;
};

export type Cart = {
  id: number | string;
  products: Product[] | string;
  timestamp: number | string;
};

export type Resource = Cart | Product;