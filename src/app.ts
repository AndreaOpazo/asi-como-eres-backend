import express from 'express';
import { Route } from './interfaces/routes.interface';
import error404Middleware from './middlewares/error404.middleware';
import errorMiddleware from './middlewares/error.middleware';

class App {
  private app: express.Application;
  private port: (string | number);

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => console.log(`App listening on the port ${this.port}`));
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
    this.app.use(error404Middleware);
  }
}

export default App;