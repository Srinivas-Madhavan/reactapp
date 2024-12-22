import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from '../styles/register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Use & Privacy Policy';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login'); // Navigate to login page after successful registration
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred during registration' });
    }
  };

  // Check if all form fields are valid
  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.trim().length >= 6 &&
      formData.password === formData.confirmPassword &&
      formData.acceptTerms
    );
  };

  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <h2 className={classes.header}>Register</h2>
        <p className={classes.description}>
          Create your account. It's free and only takes a minute.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={classes.firstnameLastname}>
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p>{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p>{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p>{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p>{errors.confirmPassword}</p>
            )}
          </div>

          <div className={classes.checkboxInput}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            <label>
              I accept the <a href="#">Terms of Use</a> &{' '}
              <a href="#">Privacy Policy</a>
            </label>
          </div>
          {errors.acceptTerms && <p>{errors.acceptTerms}</p>}

          <button
            type="submit"
            disabled={!isFormValid()} // Disable button if form is not valid
            className={classes.button}
          >
            Register Now
          </button>
        </form>
      </div>
      <p className={classes.login}>
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </p>
    </div>
  );
};

export default Register;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/register.css';

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     acceptTerms: false,
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     if (!formData.acceptTerms) {
//       newErrors.acceptTerms = 'You must accept the Terms of Use & Privacy Policy';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       if (response.ok) {
//         alert('Registration successful!');
//         navigate('/login'); // Navigate to login page after successful registration
//       } else {
//         const data = await response.json();
//         setErrors({ submit: data.message || 'Registration failed' });
//       }
//     } catch (error) {
//       setErrors({ submit: 'An error occurred during registration' });
//     }
//   };

//   // Check if all form fields are valid
//   const isFormValid = () => {
//     return (
//       formData.firstName.trim() &&
//       formData.lastName.trim() &&
//       /\S+@\S+\.\S+/.test(formData.email) &&
//       formData.password.trim().length >= 6 &&
//       formData.password === formData.confirmPassword &&
//       formData.acceptTerms
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-600 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
//         <h2 className="text-2xl text-center text-gray-700 mb-4">Register</h2>
//         <p className="text-center text-gray-500 mb-6">
//           Create your account. It's free and only takes a minute.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded border-gray-300"
//               />
//               {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
//             </div>
//             <div className="flex-1">
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded border-gray-300"
//               />
//               {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
//             </div>
//           </div>

//           <div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-2 border rounded border-gray-300"
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//           </div>

//           <div>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full p-2 border rounded border-gray-300"
//             />
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//           </div>

//           <div>
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full p-2 border rounded border-gray-300"
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
//             )}
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="acceptTerms"
//               checked={formData.acceptTerms}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <label className="text-sm text-gray-600">
//               I accept the <a href="#" className="text-green-500">Terms of Use</a> &{' '}
//               <a href="#" className="text-green-500">Privacy Policy</a>
//             </label>
//           </div>
//           {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

//           <button
//             type="submit"
//             className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
//             disabled={!isFormValid()} // Disable button if form is not valid
//           >
//             Register Now
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="text-green-500 hover:text-green-600">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
