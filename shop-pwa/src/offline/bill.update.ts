import { dbPromise } from './db';

export const updateOfflineBillPayment = async (
  billId: number,
  addAmount: number
) => {
  const db = await dbPromise;
  const tx = db.transaction('bills', 'readwrite');
  const store = tx.objectStore('bills');

  const bill = await store.get(billId);
  if (!bill) throw new Error('Bill not found');

  bill.paidAmount += addAmount;

  if (bill.paidAmount >= bill.totalAmount) {
    bill.paymentStatus = 'PAID';
    bill.paidAmount = bill.totalAmount;
  }

  await store.put(bill);
  await tx.done;

  return bill;
};
