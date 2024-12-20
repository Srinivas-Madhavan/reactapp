import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

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
        alert('Login successful!');
        navigate('/home'); // Redirect to the desired page
      } else {
        setErrors('Invalid email or password.');
      }
    } catch (error) {
      setErrors('An error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center text-gray-700 mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300"
            />
          </div>

          {errors && <p className="text-red-500 text-sm">{errors}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/" className="text-green-500 hover:text-green-600">
            Register
          </Link>
        </p>
      </div>
      <p className="text-center mt-2 text-gray-600">
          Forgot your password?{' '}
          <Link to="/forgot-password" className="text-green-500 hover:text-green-600">
            Reset it here
          </Link>
      </p>
    </div>
  );
};

export default Login;
