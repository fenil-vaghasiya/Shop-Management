import { dbPromise } from "./db";

type BackupFile = {
  meta: {
    app: string;
    version: string;
    createdAt: string;
  };
  data: Record<string, any[]>;
};

export async function importBackup(fileData: BackupFile) {
  // ✅ BASIC VALIDATION
  if (fileData.meta?.app !== "Shop Management System") {
    throw new Error("Invalid backup file");
  }

  const db = await dbPromise;

  // 🔥 CLEAR EXISTING DATA
  const stores = [
    "customers",
    "productTypes",
    "products",
    "stocks",
    "bills",
    "syncQueue"
  ];

  const txClear = db.transaction(stores, "readwrite");
  for (const store of stores) {
    await txClear.objectStore(store).clear();
  }
  await txClear.done;

  // ♻ RESTORE DATA
  const tx = db.transaction(stores, "readwrite");

  for (const [storeName, rows] of Object.entries(fileData.data)) {
    if (!rows || !Array.isArray(rows)) continue;

    const store = tx.objectStore(storeName);
    for (const row of rows) {
      await store.add(row);
    }
  }

  await tx.done;
}
