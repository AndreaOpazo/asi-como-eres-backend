import mongoose from 'mongoose';
import { productModel, productsSchema } from './products'; 

const cartsCollection = 'carts';
const cartsSchema = new mongoose.Schema({
  products: {
    type: [productsSchema],
    // require: true,
  },
  date: {
    type: String,
    require: true,
    max: 50,
  }
});

export const cartModel = mongoose.model(cartsCollection, cartsSchema);