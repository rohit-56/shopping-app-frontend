import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

function Signup() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: '',
    email: '',
    username: '',
    password: '',
    location: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
   // console.log(userDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle form submission here
    alert('Signup successful!');
    
    const payload = { 
      name: userDetails.name,
      mobile: userDetails.mobile,
      email: userDetails.email,  
      username: userDetails.username,
      password: userDetails.password,
      location: userDetails.location
    };

    try {
      const data = await signup(payload);
      console.log('Signup successful:', data);
      console.log(userDetails);
      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
    }

  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Name:
          <input type="text" name="name" value={userDetails.name} onChange={handleChange} required />
        </label>
        <label>
          Mobile Number:
          <input type="tel" name="mobile" value={userDetails.mobile} onChange={handleChange} required />
        </label>
        <label>
          Email ID:
          <input type="email" name="email" value={userDetails.email} onChange={handleChange} required />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={userDetails.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={userDetails.password} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={userDetails.location} onChange={handleChange} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
