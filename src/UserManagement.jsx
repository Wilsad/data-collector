import { useState } from 'react';
import { getAllUsers, addNewUser, deleteUser } from './authService';

const UserManagement = ({ onClose }) => {
  const [users, setUsers] = useState(getAllUsers());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      setError('Please enter a user name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newUser = addNewUser(newUserName.trim(), newUserRole);
      setNewUserName('');
      setNewUserRole('user');
      setShowAddForm(false);
      refreshUsers();
      alert(`User added successfully!\n\nUser ID: ${newUser.id}\nName: ${newUser.name}\nRole: ${newUser.role}\n\nSave this ID securely!`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}" (${userId})?`)) {
      try {
        deleteUser(userId);
        refreshUsers();
        alert('User deleted successfully');
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('User ID copied to clipboard!');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content user-management">
        <div className="modal-header">
          <h2>User Management</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="modal-body">
          <div className="user-actions">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="add-user-btn"
            >
              {showAddForm ? 'Cancel' : 'Add New User'}
            </button>
          </div>

          {showAddForm && (
            <div className="add-user-form">
              <h3>Add New User</h3>
              <form onSubmit={handleAddUser}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="userName">User Name</label>
                    <input
                      type="text"
                      id="userName"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Enter user name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userRole">Role</label>
                    <select
                      id="userRole"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          )}

          <div className="users-list">
            <h3>Existing Users ({users.length})</h3>
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className={`user-card ${user.role}`}>
                  <div className="user-header">
                    <span className="user-id">{user.id}</span>
                    <button 
                      onClick={() => copyToClipboard(user.id)}
                      className="copy-btn"
                      title="Copy user ID"
                    >
                      📋
                    </button>
                  </div>
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <div className="user-meta">
                    <small>Created: {new Date(user.createdAt).toLocaleDateString()}</small>
                  </div>
                  {user.role !== 'admin' && (
                    <div className="user-actions">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
