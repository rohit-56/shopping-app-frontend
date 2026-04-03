import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { login } from '../services/api';

function Login() {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: loginDetails.username,
      password: loginDetails.password
    };

    try {
      const data = await login(payload);
      const userId = data.userId || data.id || data.user?.id || data._id || loginDetails.username;
      if (userId) {
        localStorage.setItem('userId', userId);
      }
      setErrorMessage('');
      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Login failed. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-image" />
        <div className="login-content">
          <div className="login-header">
            <span className="login-welcome">Welcome to</span>
            <h1>Shopping App</h1>
            <p>Sign in to manage your cart, track orders, and discover the best deals.</p>
          </div>

          <button type="button" className="social-login-btn" onClick={() => alert('Google login is not configured yet')}>
            Login with Google
          </button>

          <div className="divider">Continue with email</div>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Email address
              <input
                type="email"
                name="username"
                value={loginDetails.username}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginDetails.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁'}
                </button>
              </div>
            </label>

            <div className="login-form-footer">
              <div />
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => alert('Forgot password is not implemented yet.')}
              >
                Forgot password?
              </button>
            </div>

            {errorMessage && <div className="form-error">{errorMessage}</div>}

            <button type="submit" className="submit-btn">Login</button>

            <p className="login-note">
              New here? <Link to="/signup">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
