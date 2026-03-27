import { useState, useEffect } from 'react';
import { getAllLocalEntries, getEntriesByUser, updateEntry, deleteEntry } from './db';
import { syncToFirebase } from './syncService';
import { exportToJSON, exportToCSV, importFromJSON } from './backupService';

const EntriesList = ({ currentUser, isAdmin, onRefresh }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'unsynced'

  useEffect(() => {
    loadEntries();
  }, [currentUser, filter, onRefresh]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      let allEntries;
      if (filter === 'my' && currentUser) {
        allEntries = await getEntriesByUser(currentUser);
      } else {
        allEntries = await getAllLocalEntries();
      }
      
      if (filter === 'unsynced') {
        allEntries = allEntries.filter(entry => entry.synced === 0);
      }
      
      // Non-admin users can only see their own entries
      if (!isAdmin && currentUser) {
        allEntries = allEntries.filter(entry => entry.EntryBy === currentUser);
      }
      
      setEntries(allEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditForm({
      firstName: entry.firstName,
      lastName: entry.lastName,
      phone: entry.phone,
      location: entry.location,
      invitedBy: entry.invitedBy,
      invitedPhone: entry.invitedPhone
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateEntry(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      loadEntries();
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(id);
        loadEntries();
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  const handleSync = async () => {
    const result = await syncToFirebase();
    if (result.success) {
      alert(`Synced ${result.synced} entries!`);
      loadEntries();
    } else {
      alert('Sync failed: ' + result.error);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const result = await importFromJSON(file);
      if (result.success) {
        alert(`Successfully imported ${result.count} entries!`);
        loadEntries();
      } else {
        alert('Import failed: ' + result.error);
      }
    } catch (error) {
      alert('Import failed: ' + error.message);
    }
    
    // Reset file input
    event.target.value = '';
  };

  const canEdit = (entry) => {
    if (isAdmin) {
      return true; // Admin can edit all entries
    }
    return currentUser === entry.EntryBy; // Users can only edit their own entries
  };

  if (loading) return <div className="loading">Loading entries...</div>;

  return (
    <div className="entries-container">
      <div className="entries-header">
        <h2>Entries ({entries.length})</h2>
        <div className="entries-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Entries</option>
            <option value="my">My Entries</option>
            <option value="unsynced">Unsynced Only</option>
          </select>
          {isAdmin && (
            <button onClick={handleSync} className="sync-btn">
              Sync Now
            </button>
          )}
          {isAdmin && (
            <button onClick={() => exportToJSON()} className="export-btn">
              Export JSON
            </button>
          )}
          {isAdmin && (
            <button onClick={() => exportToCSV()} className="export-btn">
              Export CSV
            </button>
          )}
          {isAdmin && (
            <label className="import-btn">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="no-entries">No entries found</p>
      ) : (
        <div className="entries-list">
          {entries.map((entry) => (
            <div key={entry.id} className={`entry-card ${entry.synced === 0 ? 'unsynced' : 'synced'}`}>
              {editingId === entry.id ? (
                <div className="edit-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Location"
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      value={editForm.invitedBy}
                      onChange={(e) => setEditForm({...editForm, invitedBy: e.target.value})}
                      placeholder="Invited By"
                    />
                    <input
                      type="tel"
                      value={editForm.invitedPhone}
                      onChange={(e) => setEditForm({...editForm, invitedPhone: e.target.value})}
                      placeholder="Inviter Phone"
                    />
                  </div>
                  <div className="edit-actions">
                    <button onClick={handleSaveEdit} className="save-btn">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="entry-content">
                  <div className="entry-header">
                    <h3>{entry.firstName} {entry.lastName}</h3>
                    <span className={`sync-status ${entry.synced === 0 ? 'unsynced' : 'synced'}`}>
                      {entry.synced === 0 ? '🔄 Unsynced' : '✅ Synced'}
                    </span>
                  </div>
                  <div className="entry-details">
                    <p><strong>Phone:</strong> {entry.phone}</p>
                    <p><strong>Location:</strong> {entry.location}</p>
                    <p><strong>Invited By:</strong> {entry.invitedBy} ({entry.invitedPhone})</p>
                    <p><strong>Entered By:</strong> {entry.EntryBy}</p>
                    <p><strong>Created:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
                  </div>
                  {canEdit(entry) && (
                    <div className="entry-actions">
                      <button onClick={() => handleEdit(entry)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(entry.id)} className="delete-btn">Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntriesList;
