import { useState } from 'react';
import { authenticateUser, setCurrentUser } from './authService';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = authenticateUser(userId.toUpperCase());
      
      if (result.success) {
        setCurrentUser(result.user);
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Auto-format to FLC-XXX pattern
    if (value.length <= 7) {
      setUserId(value);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Data Collector</h1>
          <p>Enter your user ID to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={handleInputChange}
              placeholder="FLC-XXX"
              maxLength={7}
              className="login-input"
              autoFocus
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={isLoading || userId.length < 7}
            className="login-button"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
