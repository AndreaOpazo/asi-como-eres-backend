import DaoInterface from '../interfaces/dao.interface';
import { Product, Resource } from '../types';
import firestore from '../firebaseConnection';
import { ResourceNames, PRODUCT_NOT_FOUND, CART_NOT_FOUND } from '../../constants';
import { getActualDate } from '../utils';
import { threadId } from 'worker_threads';

export default class Firebase implements DaoInterface {
  private resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  private mapProduct(document: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) {
    const data = document.data();
    const id = document.id;
    return { ...data, id } as Resource;
  }

  async read(id?: number | string) {
    if (id) {
      const productSnapshot = await firestore.collection(this.resource).doc(id as string).get();
      if (!productSnapshot.data()) throw new Error(PRODUCT_NOT_FOUND);
      return this.mapProduct(productSnapshot);
    }
    const snapshot = await firestore.collection(this.resource).get();
    return snapshot.docs.map(this.mapProduct);
  }

  async addProductToCart(cartId: number | string, productId: number | string): Promise<Product> {
    const productSnapshotToAdd = await firestore.collection(ResourceNames.PRODUCTS).doc(productId as string).get();
    const productData = productSnapshotToAdd.data() as Product;
    
    if (!productData) throw new Error(PRODUCT_NOT_FOUND);
    
    const cartSnapshot = await firestore.collection(ResourceNames.CART).doc(cartId as string).get();
    let cartData = cartSnapshot.data();
    
    if (!cartData) cartData = await this.create({ products: [], timestamp: getActualDate() } as Resource);

    cartData.products.push(productData);

    await this.update(cartData.id, cartData as Resource);

    return productData;
  }

  async create(resourceData: Resource): Promise<Resource | null> {
    const createdDocument = await firestore.collection(this.resource).add(resourceData);
    const createdDocumentData = await createdDocument.get();
    return this.mapProduct(createdDocumentData);
  }

  async update(id: number | string, resource: Resource): Promise<Resource | null> {
    await firestore.collection(this.resource).doc(id as string).update(resource);
    return resource;
  }

  async delete(id: number | string): Promise<Resource | null> {
    if (this.resource === ResourceNames.PRODUCTS) {
      const productToDelete = await this.read(id);
      if (!productToDelete) throw new Error(PRODUCT_NOT_FOUND);
      const resourceReference = firestore.collection(this.resource).doc(id as string);
      await resourceReference.delete();
      return productToDelete as Resource;
    } else {
      const cart = await this.read(id);
      if (!cart) throw new Error(CART_NOT_FOUND);
      await firestore.collection(this.resource).doc(id as string).update({ products: []});
      return cart as Resource;
    }
  }
}