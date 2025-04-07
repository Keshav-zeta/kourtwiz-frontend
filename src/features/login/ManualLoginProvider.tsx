import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../../context/AuthContext';
import './ManualLoginProvider.css';
import { useNavigate } from 'react-router-dom';

const ManualLoginProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useContext(AuthContext)!;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem('jwtToken')
  );
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token && !user && isAuthenticated) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://44.216.113.234:8080/users/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err.message);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://44.216.113.234:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Invalid username or password');

      const data = await response.json();
      setToken(data.token);
      setIsFirstTimeLogin(data.isFirstTimeLogin);

      if (!data.isFirstTimeLogin) {
        localStorage.setItem('jwtToken', data.token);
        await fetchUserData(data.token);
        navigate('/settings-themes');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'http://44.216.113.234:8080/auth/change-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: credentials.username,
            tempPassword: oldPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to change password');
      await fetchUserData(token);
      localStorage.setItem('jwtToken', token);
      setIsFirstTimeLogin(false);
      navigate('/settings-themes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress className='loading-spinner' />;

  if (!isAuthenticated) {
    return (
      <div className='login-container'>
        <div className='login-box'>
          {!isFirstTimeLogin ? (
            <>
              <h2>Login</h2>
              {error && <p className='error-message'>{error}</p>}
              <form onSubmit={handleLogin}>
                <input
                  type='text'
                  placeholder='Username'
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
                <button type='submit'>Login</button>
              </form>
            </>
          ) : (
            <>
              <h2>Logging in for the first time - Change Password</h2>
              {error && <p className='error-message'>{error}</p>}
              <form onSubmit={handleChangePassword}>
                <input
                  type='text'
                  placeholder='Username'
                  value={credentials.username}
                  disabled
                />
                <input
                  type='password'
                  placeholder='Old Password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type='password'
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type='submit'>Change Password</button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default ManualLoginProvider;
