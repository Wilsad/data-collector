// User authentication service with random alphanumeric IDs
const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Initial users with random alphanumeric IDs
const INITIAL_USERS = {
  'FLC-A3B': { role: 'admin', name: 'Admin User 1', createdAt: new Date().toISOString() },
  'FLC-7X9': { role: 'admin', name: 'Admin User 2', createdAt: new Date().toISOString() },
  'FLC-K2M': { role: 'user', name: 'Field Agent 1', createdAt: new Date().toISOString() },
  'FLC-P5Q': { role: 'user', name: 'Field Agent 2', createdAt: new Date().toISOString() },
  'FLC-R8T': { role: 'user', name: 'Field Agent 3', createdAt: new Date().toISOString() },
  'FLC-W1Y': { role: 'user', name: 'Field Agent 4', createdAt: new Date().toISOString() },
  'FLC-D4F': { role: 'user', name: 'Field Agent 5', createdAt: new Date().toISOString() },
  'FLC-G6H': { role: 'user', name: 'Field Agent 6', createdAt: new Date().toISOString() },
  'FLC-J9L': { role: 'user', name: 'Field Agent 7', createdAt: new Date().toISOString() },
  'FLC-N2P': { role: 'user', name: 'Field Agent 8', createdAt: new Date().toISOString() }
};

// Load users from localStorage or use initial users
const getUsers = () => {
  const storedUsers = localStorage.getItem('appUsers');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Store initial users
  localStorage.setItem('appUsers', JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
};

const saveUsers = (users) => {
  localStorage.setItem('appUsers', JSON.stringify(users));
};

export const authenticateUser = (userId) => {
  // Validate format: FLC-XXX where XXX is 3 alphanumeric characters
  const formatRegex = /^FLC-[A-Z0-9]{3}$/;
  
  if (!formatRegex.test(userId)) {
    return { success: false, error: 'Invalid ID format. Use FLC-XXX format (e.g., FC-A3B)' };
  }
  
  const users = getUsers();
  const user = users[userId];
  
  if (!user) {
    return { success: false, error: 'User ID not found' };
  }
  
  return { 
    success: true, 
    user: {
      id: userId,
      role: user.role,
      name: user.name
    }
  };
};

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const logout = () => {
  setCurrentUser(null);
};

export const getAllUsers = () => {
  const users = getUsers();
  return Object.entries(users).map(([id, user]) => ({
    id,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const isValidUserId = (userId) => {
  const formatRegex = /^FLC-[A-Z0-9]{3}$/;
  const users = getUsers();
  return formatRegex.test(userId) && users.hasOwnProperty(userId);
};

export const addNewUser = (name, role) => {
  const users = getUsers();
  
  // Generate unique ID
  let newId;
  let attempts = 0;
  do {
    newId = `FLC-${generateRandomId()}`;
    attempts++;
    if (attempts > 100) {
      throw new Error('Unable to generate unique user ID');
    }
  } while (users.hasOwnProperty(newId));
  
  // Add new user
  const newUser = {
    [newId]: {
      role: role,
      name: name,
      createdAt: new Date().toISOString()
    }
  };
  
  const updatedUsers = { ...users, ...newUser };
  saveUsers(updatedUsers);
  
  return {
    id: newId,
    name: name,
    role: role,
    createdAt: newUser[newId].createdAt
  };
};

export const deleteUser = (userId) => {
  if (userId === 'FLC-A3B' || userId === 'FLC-7X9') {
    throw new Error('Cannot delete admin users');
  }
  
  const users = getUsers();
  if (!users[userId]) {
    throw new Error('User not found');
  }
  
  delete users[userId];
  saveUsers(users);
  return true;
};
