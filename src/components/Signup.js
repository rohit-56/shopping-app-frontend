import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    username: '',
    password: '',
    location: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
   // console.log(form);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle form submission here
    alert('Signup successful!');
    
    const payload = { 
      name: form.name,
      mobile: form.mobile,
      email: form.email,  
      username: form.username,
      password: form.password,
      location: form.location
    };

    try{
    const response = await fetch('http://localhost:8080/user/signup', {
      method: 'POST',
      headers: {    
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if(response.ok){
      const data = await response.json();
      console.log('Signup successful:', data);
    }
  }catch(error){  
    console.error('Error during signup:', error);
  }

    console.log(form);
    navigate('/home');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Mobile Number:
          <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required />
        </label>
        <label>
          Email ID:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={form.location} onChange={handleChange} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
