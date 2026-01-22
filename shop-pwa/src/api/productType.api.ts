import api from './axios';

export type ProductTypePayload = {
  name: string;
};

export const getProductTypes = async () => {
  const res = await api.get('/product-types');
  return res.data;
};

export const addProductType = async (data: ProductTypePayload) => {
  const res = await api.post('/product-types', data);
  return res.data;
};
