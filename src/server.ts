import App from './app';
import { ProductsRoute } from './routes/products.route';
import { CartRoute } from './routes/cart.route';

const app = new App([
  new ProductsRoute(),
  new CartRoute(),
]);

app.listen();
