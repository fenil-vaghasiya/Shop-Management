import { dbPromise } from "./db";

export async function exportBackup() {
  const db = await dbPromise;

  const backup = {
    meta: {
      app: "Shop Management System",
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      notes: "Manual backup"
    },
    data: {
      customers: await db.getAll("customers"),
      productTypes: await db.getAll("productTypes"),
      products: await db.getAll("products"),
      stocks: await db.getAll("stocks"),
      bills: await db.getAll("bills"),
      syncQueue: await db.getAll("syncQueue")
    }
  };

  return backup;
}
