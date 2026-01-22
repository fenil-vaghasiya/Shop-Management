import api from './axios';

export type StockPayload = {
  productId: number;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
};

export const addStock = async (data: StockPayload) => {
  const res = await api.post('/stocks', data);
  return res.data;
};

export const getStockByProduct = async (productId: number) => {
  const res = await api.get(`/stocks/product/${productId}`);
  return res.data;
};
