import { dbPromise } from "./db";

/* ---------- GET ---------- */

export const getOfflineCustomers = async () => {
  const db = await dbPromise;
  return await db.getAll("customers");
};

/* ---------- ADD ---------- */

export const addOfflineCustomer = async (customer: any) => {
  const db = await dbPromise;

  const id = await db.add("customers", customer);

  await db.add("syncQueue", {
    type: "ADD_CUSTOMER",
    payload: { ...customer, id },
    createdAt: new Date().toISOString(),
  });
};

/* ---------- UPDATE ---------- */

export const updateOfflineCustomer = async (
  id: number,
  updatedCustomer: any
) => {
  const db = await dbPromise;

  await db.put("customers", {
    ...updatedCustomer,
    id,
  });

  await db.add("syncQueue", {
    type: "UPDATE_CUSTOMER",
    payload: { ...updatedCustomer, id },
    createdAt: new Date().toISOString(),
  });
};

/* ---------- DELETE ---------- */

export const deleteOfflineCustomer = async (id: number) => {
  const db = await dbPromise;

  await db.delete("customers", id);

  await db.add("syncQueue", {
    type: "DELETE_CUSTOMER",
    payload: { id },
    createdAt: new Date().toISOString(),
  });
};
