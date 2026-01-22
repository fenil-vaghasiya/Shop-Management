import { dbPromise } from './db';

export const getOfflineProducts = async () => {
  const db = await dbPromise;
  return await db.getAll('products');
};

export const addOfflineProduct = async (product: any) => {
  const db = await dbPromise;

  await db.add('products', product);

  await db.add('syncQueue', {
    type: 'ADD_PRODUCT',
    payload: product,
    createdAt: new Date().toISOString()
  });
};
