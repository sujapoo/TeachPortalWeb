import React, { useState } from 'react';
import { signupApi } from '../Services/api';
import { useNavigate } from 'react-router-dom';
import { validateLength, validateEmail } from '../Validation/validation'; 

const SignupForm = () => {
  const navigate = useNavigate();
  
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

 
  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const newErrors = {};

 
    newErrors.firstName = validateLength(firstName, 3, 50);

  
    newErrors.lastName = validateLength(lastName, 3, 50);

    
    newErrors.email = validateEmail(email);

    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    
    if (Object.values(newErrors).some((error) => error)) {
      setValidationErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrorMessage(''); 

    try {
   
      const requestBody = {
        userName: username,
        email: email,
        passwordHash: password,  
        firstName: firstName,
        lastName: lastName,
        students: [],  
      };

     
      const response = await signupApi.post('/auth/signup', requestBody);

      
      if (response.status === 201 || response.status === 200) {
        alert('Signup successful!');
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage('Failed to sign up. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Teacher Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {validationErrors.email && <div style={{ color: 'red' }}>{validationErrors.email}</div>}
        </div>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {validationErrors.firstName && <div style={{ color: 'red' }}>{validationErrors.firstName}</div>}
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {validationErrors.lastName && <div style={{ color: 'red' }}>{validationErrors.lastName}</div>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {validationErrors.password && <div style={{ color: 'red' }}>{validationErrors.password}</div>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {validationErrors.confirmPassword && (
            <div style={{ color: 'red' }}>{validationErrors.confirmPassword}</div>
          )}
        </div>

        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
