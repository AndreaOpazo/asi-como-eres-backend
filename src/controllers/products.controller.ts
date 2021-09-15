import { NextFunction, Response, Request } from 'express';
import { ProductsService } from '../services/products.service';

export class ProductsController {
  private productsService = new ProductsService();

  public getList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productList = await this.productsService.getProducts();
      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productsService.getProductById(Number(req.params.id));
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: 'Product not found.' })
      }
    } catch (error) {
      next(error);
    }
  }

  public addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productAdded = await this.productsService.addProduct(req.body);
      if (productAdded) {
        res.status(200).json(productAdded);
      } else {
        res.status(404).json({ error: 'The product could not be added.' })
      }
    } catch (error) {
      next(error);
    }
  }

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productUpdated = await this.productsService.updateProduct(Number(req.params.id), req.body);
      if (productUpdated) {
        res.status(200).json(productUpdated);
      } else {
        res.status(404).json({ error: 'Product not found.' })
      }
    } catch (error) {
      next(error);
    }
  }

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productDeleted = await this.productsService.deleteProduct(Number(req.params.id));
      if (productDeleted) {
        res.status(200).json(productDeleted);
      } else {
        res.status(404).json({ error: 'Product not found.' })
      }
    } catch (error) {
      next(error);
    }
  }
}
