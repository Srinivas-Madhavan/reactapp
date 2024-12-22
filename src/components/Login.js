import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from '../styles/login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.email || !formData.password) {
      setErrors('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();

      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/home'); // Redirect to the desired page
      } else {
        setErrors('Invalid email or password.');
      }
    } catch (error) {
      setErrors('An error occurred during login.');
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <h2 className={classes.header}>Login</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Username"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {errors && <p>{errors}</p>}

          <button
            type="submit"
            className={classes.button}
          >
            Login
          </button>
        </form>

        <p>
          Forgot your password?{' '}
          <Link to="/forgot-password">
            Reset it here
          </Link>
        </p>
      </div>
      <p>
          Don't have an account?{' '}
          <Link to="/">
            Register
          </Link>
        </p>
    </div>
  );
};

export default Login;
