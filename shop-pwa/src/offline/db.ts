import { openDB } from "idb";

export const dbPromise = openDB("shop-db", 6, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("customers")) {
      db.createObjectStore("customers", {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains("productTypes")) {
      db.createObjectStore("productTypes", {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains("syncQueue")) {
      db.createObjectStore("syncQueue", {
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains("products")) {
      db.createObjectStore("products", {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains("stocks")) {
      db.createObjectStore("stocks", {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains("bills")) {
      db.createObjectStore("bills", {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  },
});