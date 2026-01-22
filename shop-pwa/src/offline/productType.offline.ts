import { dbPromise } from './db';

export const getOfflineProductTypes = async () => {
  const db = await dbPromise;
  return await db.getAll('productTypes');
};

export const addOfflineProductType = async (type: { name: string }) => {
  const db = await dbPromise;

  await db.add('productTypes', type);

  await db.add('syncQueue', {
    type: 'ADD_PRODUCT_TYPE',
    payload: type,
    createdAt: new Date().toISOString()
  });
};
