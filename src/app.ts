import express from 'express';
import { Route } from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';

class App {
  private app: express.Application;
  private port: (string | number);
  // private env: boolean;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 8080;
    // this.env = process.env.NODE_ENV === 'production' ? true : false;
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => console.log(`App listening on the port ${this.port}`));
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
