// import 'dotenv/config';
import App from './app';
import { ProductsRoute } from './routes/products.route';
import { ChartRoute } from './routes/chart.route';

const app = new App([
  new ProductsRoute(),
  new ChartRoute(),
]);

app.listen();
