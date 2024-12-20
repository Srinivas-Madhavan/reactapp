// src/components/Layout/PageLayout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PageLayout = ({ children, title, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            {showBackButton && (
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors duration-200"
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>@React Food Order Project | {new Date().toLocaleString()}</p>
        </div>
      </footer>
    </div>
  );
};

// src/components/Common/Card.js
export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

// src/components/Common/Button.js
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  disabled = false 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg transition-colors duration-200";
  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-300",
    success: "bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300",
    danger: "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// src/components/Common/Input.js
export const Input = ({ 
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = ""
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};