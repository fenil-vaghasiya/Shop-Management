import api from "./axios";

/* ---------- TYPES ---------- */

export type CustomerPayload = {
  name: string;
  phone: string;
  address?: string;
  gstNumber?: string;
};

/* ---------- GET ---------- */

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

/* ---------- ADD ---------- */

export const addCustomer = async (data: CustomerPayload) => {
  const res = await api.post("/customers", data);
  return res.data;
};

/* ---------- UPDATE ---------- */

export const updateCustomer = async (
  id: number,
  data: CustomerPayload
) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};

/* ---------- DELETE ---------- */

export const deleteCustomer = async (id: number) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};
