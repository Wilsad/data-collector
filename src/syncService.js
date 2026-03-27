import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAllLocalEntries, updateEntrySyncStatus } from './db';

export const syncToFirebase = async () => {
  try {
    const localEntries = await getAllLocalEntries();
    const unsyncedEntries = localEntries.filter(entry => entry.synced === 0);
    
    if (unsyncedEntries.length === 0) {
      console.log('No entries to sync');
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;
    
    for (const entry of unsyncedEntries) {
      try {
        const docRef = await addDoc(collection(db, 'entries'), {
          firstName: entry.firstName,
          lastName: entry.lastName,
          phone: entry.phone,
          location: entry.location,
          invitedBy: entry.invitedBy,
          invitedPhone: entry.invitedPhone,
          createdAt: entry.createdAt,
          entryBy: entry.EntryBy,
          localId: entry.id
        });
        
        await updateEntrySyncStatus(entry.id, 1);
        syncedCount++;
        console.log('Synced entry:', docRef.id);
      } catch (error) {
        console.error('Failed to sync entry:', entry.id, error);
      }
    }
    
    return { success: true, synced: syncedCount };
  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error: error.message };
  }
};

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const setupAutoSync = () => {
  window.addEventListener('online', () => {
    console.log('Back online, starting sync...');
    syncToFirebase();
  });
  
  setInterval(() => {
    if (checkOnlineStatus()) {
      syncToFirebase();
    }
  }, 30000); // Sync every 30 seconds when online
};
