import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: '',
    name: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, name, password } = credentials;

    if (!email.trim() || !name.trim() || !password.trim()) {
      setError('All fields are required.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format. Please enter a valid email address.');
      return false;
    }

    if (name.length < 3) {
      setError('Name must be at least 3 characters long.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('http://44.216.113.234:8080/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Failed to create an account. Please try again.');
      }

      setSuccess('Account created successfully! You can now log in.');
      setCredentials({ email: '', name: '', password: '' });
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup-container'>
      <div className='signup-box'>
        <h2>Sign Up</h2>

        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}

        <form onSubmit={handleSignup} className='signup-form'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={credentials.name}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type='submit' disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
