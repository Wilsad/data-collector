import { openDB } from 'idb';

const DB_NAME = 'DataCollectorDB';
const STORE_NAME = 'entries';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // We use an auto-incrementing ID as the primary key
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        // Create an index to easily find unsynced data later
        store.createIndex('synced', 'synced');
      }
    },
  });
};

// Save a new entry locally
export const saveEntryLocally = async (formData) => {
  const db = await initDB();
  const newEntry = {
    ...formData,
    createdAt: new Date().toISOString(),
    EntryBy: "Rose", // Hardcoded for now, or pull from a 'user' variable
    synced: 0,       // 0 for No, 1 for Yes (IndexedDB likes numbers/booleans for indexes)
  };
  return db.add(STORE_NAME, newEntry);
};

// Get all entries to show in your "View" list
export const getAllLocalEntries = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Count total entries
export const getEntryCount = async () => {
  const db = await initDB();
  return db.count(STORE_NAME);
};

// Update sync status of an entry
export const updateEntrySyncStatus = async (id, synced) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const entry = await store.get(id);
  if (entry) {
    entry.synced = synced;
    await store.put(entry);
  }
  return tx.complete;
};

// Get entries by user who entered them
export const getEntriesByUser = async (entryBy) => {
  const db = await initDB();
  const allEntries = await db.getAll(STORE_NAME);
  return allEntries.filter(entry => entry.EntryBy === entryBy);
};

// Update an entry
export const updateEntry = async (id, updatedData) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const entry = await store.get(id);
  if (entry) {
    Object.assign(entry, updatedData);
    entry.synced = 0; // Mark as unsynced when edited
    await store.put(entry);
  }
  return tx.complete;
};

// Delete an entry
export const deleteEntry = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};