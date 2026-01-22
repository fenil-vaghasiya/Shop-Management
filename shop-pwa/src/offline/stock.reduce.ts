import { dbPromise } from './db';

export const reduceOfflineStock = async (
  consumed: { stockId: number; usedQty: number }[]
) => {
  const db = await dbPromise;
  const tx = db.transaction('stocks', 'readwrite');
  const store = tx.objectStore('stocks');

  for (const c of consumed) {
    const stock = await store.get(c.stockId);
    if (!stock) continue;

    stock.quantity -= c.usedQty;

    if (stock.quantity <= 0) {
      await store.delete(c.stockId);
    } else {
      await store.put(stock);
    }
  }

  await tx.done;
};
