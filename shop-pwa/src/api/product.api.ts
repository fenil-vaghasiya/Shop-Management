import api from './axios';

export type ProductPayload = {
  name: string;
  productTypeId: number;
  companyName?: string;
  avgSellingPrice?: number;
};

export const getProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const addProduct = async (data: ProductPayload) => {
  const res = await api.post('/products', data);
  return res.data;
};
