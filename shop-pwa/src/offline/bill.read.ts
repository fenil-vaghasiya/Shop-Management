import { dbPromise } from './db';

export const getOfflineBills = async () => {
  const db = await dbPromise;
  return await db.getAll('bills');
};

export const getOfflineBillById = async (id: number) => {
  const db = await dbPromise;
  return await db.get('bills', id);
};
