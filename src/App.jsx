import { useState, useEffect } from 'react';
import Login from './Login';
import UserManagement from './UserManagement';
import DataForm from './DataForm';
import EntriesList from './EntriesList';
import { getEntryCount } from './db';
import { setupAutoSync } from './syncService';
import { getCurrentUser, setCurrentUser } from './authService';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('form');
  const [entryCount, setEntryCount] = useState(0);
  const [currentUser, setCurrentUserState] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUserManagement, setShowUserManagement] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = getCurrentUser();
    if (storedUser) {
      setCurrentUserState(storedUser);
    }

    loadEntryCount();
    setupAutoSync();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadEntryCount();
    }
  }, [currentUser]);

  const loadEntryCount = async () => {
    try {
      const count = await getEntryCount();
      setEntryCount(count);
    } catch (error) {
      console.error('Failed to get entry count:', error);
    }
  };

  const handleLogin = (user) => {
    setCurrentUserState(user);
    setActiveView('form');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setActiveView('form');
  };

  const handleEntryAdded = () => {
    loadEntryCount();
    setRefreshKey(prev => prev + 1);
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // If no user is logged in, show login screen
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Data Collector</h1>
        <div className="header-stats">
          <span className="entry-count">Total Entries: {entryCount}</span>
          <div className="user-info">
            <span className="user-id">{currentUser.id}</span>
            <span className="user-name">{currentUser.name}</span>
            <span className={`user-role ${isAdmin() ? 'admin' : 'user'}`}>
              {isAdmin() ? 'Admin' : 'User'}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            {isAdmin() && (
              <button 
                onClick={() => setShowUserManagement(true)}
                className="manage-users-btn"
              >
                Manage Users
              </button>
            )}
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={activeView === 'form' ? 'active' : ''}
          onClick={() => setActiveView('form')}
        >
          Add Entry
        </button>
        <button 
          className={activeView === 'list' ? 'active' : ''}
          onClick={() => setActiveView('list')}
        >
          View Entries
        </button>
      </nav>

      <main className="app-main">
        {activeView === 'form' ? (
          <DataForm currentUser={currentUser.name} onEntryAdded={handleEntryAdded} />
        ) : (
          <EntriesList 
            currentUser={currentUser.name} 
            isAdmin={isAdmin()}
            onRefresh={refreshKey} 
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Data Collector - Works Offline</p>
      </footer>

      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}
    </div>
  );
}

export default App;
