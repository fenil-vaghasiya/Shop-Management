import { dbPromise } from './db';

export const addOfflineBill = async (bill: any) => {
  const db = await dbPromise;

  await db.add('bills', bill);

  await db.add('syncQueue', {
    type: 'ADD_BILL',
    payload: bill,
    createdAt: new Date().toISOString()
  });
};