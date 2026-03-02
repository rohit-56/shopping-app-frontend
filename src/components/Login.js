import React, { useState } from 'react';
import './Signup.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    // You can handle login logic here
    console.log('Login details:', loginDetails);
    const payload = { 
      email: loginDetails.username,
      password: loginDetails.password
    };

    try{
    const response = await fetch('http://localhost:4002/user/login', {
      method: 'POST',
      headers: {    
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if(response.ok){
      const data = await response.json();
      console.log('User logged in successfully:', data);
      alert('Login successful!');
    navigate('/home');
    }
  }catch(error){  
    console.error('Error during login:', error);
  }
    
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-right" style={{ marginLeft: 'auto' }}>
          <Link to="/signup" className="nav-btn">Signup</Link>
        </div>
      </nav>
      <div className="signup-container">
       
      <div className="signup-link-container" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p>New User? <button type="button" onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: '16px' }}>Sign up here</button></p>
      </div>
       <h2>Login</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Username:
          <input type="email" name="username" value={loginDetails.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={loginDetails.password} onChange={handleChange} required />
        </label>
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  );
}

export default Login;
