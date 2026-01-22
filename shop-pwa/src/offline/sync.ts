import api from "../api/axios";
import { dbPromise } from "./db";

export const syncOfflineData = async () => {
  if (!navigator.onLine) return;

  const db = await dbPromise;
  const tx = db.transaction("syncQueue", "readwrite");
  const store = tx.objectStore("syncQueue");

  const allQueueItems = await store.getAll();

  for (const item of allQueueItems) {
    try {
      if (item.type === "ADD_CUSTOMER") {
        await api.post("/customers", item.payload);
      }
      if (item.type === "ADD_PRODUCT_TYPE") {
        await api.post("/product-types", item.payload);
      }
      if (item.type === "ADD_PRODUCT") {
        await api.post("/products", item.payload);
      }
      if (item.type === "ADD_STOCK") {
        await api.post("/stocks", item.payload);
      }
      if (item.type === "ADD_BILL") {
        await api.post("/bills", item.payload);
      }

      // remove synced item
      await store.delete(item.id);
    } catch (err) {
      console.warn("Sync failed, will retry later", err);
      break; // stop sync if backend fails
    }
  }

  await tx.done;
};
