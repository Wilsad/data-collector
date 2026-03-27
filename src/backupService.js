import { getAllLocalEntries } from './db';

import { saveEntryLocally } from './db';

export const exportToJSON = async () => {
  try {
    const entries = await getAllLocalEntries();
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `data-collection-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    return { success: true, count: entries.length };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, error: error.message };
  }
};

export const exportToCSV = async () => {
  try {
    const entries = await getAllLocalEntries();
    
    if (entries.length === 0) {
      return { success: false, error: 'No entries to export' };
    }
    
    const headers = [
      'First Name',
      'Last Name', 
      'Phone',
      'Location',
      'Invited By',
      'Inviter Phone',
      'Created At',
      'Entered By',
      'Sync Status'
    ];
    
    const csvRows = [
      headers.join(','),
      ...entries.map(entry => [
        `"${entry.firstName || ''}"`,
        `"${entry.lastName || ''}"`,
        `"${entry.phone || ''}"`,
        `"${entry.location || ''}"`,
        `"${entry.invitedBy || ''}"`,
        `"${entry.invitedPhone || ''}"`,
        `"${new Date(entry.createdAt).toLocaleString()}"`,
        `"${entry.EntryBy || ''}"`,
        entry.synced === 1 ? 'Synced' : 'Unsynced'
      ].join(','))
    ];
    
    const csvStr = csvRows.join('\n');
    const dataBlob = new Blob([csvStr], { type: 'text/csv' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `data-collection-backup-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    return { success: true, count: entries.length };
  } catch (error) {
    console.error('CSV export failed:', error);
    return { success: false, error: error.message };
  }
};

export const importFromJSON = async (file) => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid file format');
    }
    
    let importedCount = 0;
    
    for (const entry of data) {
      try {
        await saveEntryLocally({
          firstName: entry.firstName,
          lastName: entry.lastName,
          phone: entry.phone,
          location: entry.location,
          invitedBy: entry.invitedBy,
          invitedPhone: entry.invitedPhone,
          EntryBy: entry.EntryBy || 'Imported'
        });
        importedCount++;
      } catch (error) {
        console.error('Failed to import entry:', error);
      }
    }
    
    return { success: true, count: importedCount };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, error: error.message };
  }
};
