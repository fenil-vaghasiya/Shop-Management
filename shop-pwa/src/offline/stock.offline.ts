import { dbPromise } from './db';

export const addOfflineStock = async (stock: any) => {
  const db = await dbPromise;

  await db.add('stocks', {
    ...stock,
    quantity: Number(stock.quantity),
    purchasePrice: Number(stock.purchasePrice)
  });

  await db.add('syncQueue', {
    type: 'ADD_STOCK',
    payload: stock,
    createdAt: new Date().toISOString()
  });
};

export const getOfflineStockByProduct = async (productId: number) => {
  const db = await dbPromise;
  const all = await db.getAll('stocks');
  return all.filter(s => s.productId === productId);
};
