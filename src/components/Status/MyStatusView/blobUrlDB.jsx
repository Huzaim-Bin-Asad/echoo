// blobUrlDB.js
import { openDB } from 'idb';

const DB_NAME = 'StatusBlobDB';
const STORE_NAME = 'blobUrls';
const DB_VERSION = 1;

export const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveBlobToDB = async (key, blob) => {
  const db = await initDB();
  await db.put(STORE_NAME, blob, key);
};

export const getBlobFromDB = async (key) => {
  const db = await initDB();
  const blob = await db.get(STORE_NAME, key);
  return blob;
};

export const deleteBlobFromDB = async (key) => {
  const db = await initDB();
  await db.delete(STORE_NAME, key);
};
