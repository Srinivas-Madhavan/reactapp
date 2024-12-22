import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './../styles/forgotPassword.module.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      // to handle the password reset request
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset instructions have been sent to your email.');
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send reset instructions');
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <h2 className={classes.header}>Forgot Password</h2>
        <p>
          Username
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {error && <p>{error}</p>}
          {message && <p>{message}</p>}

          <button
            type="submit"
            className={classes.button}
          >
            Forgot Password
          </button>
        </form>

        <div>
          <Link to="/login">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;