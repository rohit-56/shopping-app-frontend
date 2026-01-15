import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle login logic here
    alert('Login successful!');
    navigate('/home');
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
