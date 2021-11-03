import DaoInterface from '../interfaces/dao.interface';
import { Product, Resource } from '../types';
import firestore from '../firebaseConnection';
import { ResourceNames, PRODUCT_NOT_FOUND } from '../../constants';
import { getActualDate } from '../utils';

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
    try {
      if (this.resource === ResourceNames.PRODUCTS) {
        if (id) {
          const productSnapshot = await firestore.collection(this.resource).doc(id as string).get();
          if (!productSnapshot.data()) throw new Error;
          return this.mapProduct(productSnapshot);
        }
      } else {
        if (id) {
          const cartSnapshot = await firestore.collection(this.resource).limit(1).get();
          const cart = cartSnapshot.docs[0].data();
          if (cart.products.length === 0) throw new Error;
          return cart.products.find((product: Product) => product.id === id);
        }
      }
      const snapshot = await firestore.collection(this.resource).get();
      return snapshot.docs.map(this.mapProduct);
    } catch (error) {
      console.error(error);
    }
  }

  async addProductToCart(productId: number | string): Promise<Product> {
    const productSnapshotToAdd = await firestore.collection(ResourceNames.PRODUCTS).doc(productId as string).get();
    const productData = this.mapProduct(productSnapshotToAdd); 
    
    if (!productData) throw new Error(PRODUCT_NOT_FOUND);
    
    const cartSnapshot = await firestore.collection(ResourceNames.CART).limit(1).get();
    let cartData = cartSnapshot.docs[0].data();
    
    //si cart no existe, me crea un cart
    if (!cartData) cartData = await this.create({ products: [] } as Resource);

    cartData.products.push(productData);

    await this.update(cartData.id, cartData as Resource);

    return productData as Product;
  }

  async create(resourceData: Resource): Promise<Resource | null> {
    const createdDocument = await firestore.collection(this.resource).add({...resourceData, timestamp: getActualDate()});
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
      return productToDelete as Resource; // muestra el product borrado
    } else {
      const productCartToDelete = await this.read(id);
      if (!productCartToDelete) throw new Error(PRODUCT_NOT_FOUND);
      const cartSnapshot = await firestore.collection(this.resource).limit(1).get();
      const cart = cartSnapshot.docs[0].data();
      cart.products = cart.products.filter((product: Product) => product.id !== productCartToDelete.id);
      await this.update(cart.id, cart as Resource);
      return cart as Resource; // muestra el cart actualizado
    }
  }
}