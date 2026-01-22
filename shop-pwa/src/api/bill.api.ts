import api from './axios';

export type BillItemPayload = {
  productId: number;
  quantity: number;
  sellingPrice: number;
};

export type BillPayload = {
  customerId: number;
  paymentMode: 'CASH' | 'ONLINE';
  paymentStatus: 'PAID' | 'PENDING';
  items: BillItemPayload[];
};

export type BillExtendedPayload = BillPayload & {
  profit: number;
  createdAt: string;
  totalAmount: number;
  paidAmount: number;
};

export const createBill = async (data: BillPayload) => {
  const res = await api.post('/bills', data);
  return res.data;
};
