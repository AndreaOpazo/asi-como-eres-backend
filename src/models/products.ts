import mongoose from 'mongoose';

const productsCollection = 'products';
export const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    max: 50,
  },
  description: {
    type: String,
    require: true,
    max: 250,
  },
  code: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
    require: true,
    max: 150,
  },
  price: {
    type: Number,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  date: {
    type: String,
    require: true,
    max: 50,
  },
});

export const productModel = mongoose.model(productsCollection, productsSchema);