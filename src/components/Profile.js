import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByEmail } from '../services/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Unknown',
    username: 'Unknown',
    email: 'Unknown',
    contact: 'Unknown',
    address: 'Unknown'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        const result = await getUserByEmail(userId);
        let payload = result;
        if (result?.data) {
          payload = result.data;
        }

        setUser({
          name: payload.name || payload.name || localStorage.getItem('userName') || 'Unknown',
          username: payload.username || localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'Unknown',
          email: payload.email || localStorage.getItem('userEmail') || 'Unknown',
          contact: payload.number || payload.contact || localStorage.getItem('userMobile') || 'Unknown',
          address: payload.location || payload.address || localStorage.getItem('userAddress') || 'Unknown'
        });

        setError(null);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile');
        setUser({
          name: localStorage.getItem('userName') || 'Unknown',
          username: localStorage.getItem('userId') || localStorage.getItem('userEmail') || 'Unknown',
          email: localStorage.getItem('userEmail') || 'Unknown',
          contact: localStorage.getItem('userMobile') || 'Unknown',
          address: localStorage.getItem('userAddress') || 'Unknown'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Profile</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile</h2>
        {error && <div className="profile-error">{error}</div>}
        <div className="profile-field">
          <span className="label">Name</span>
          <span>{user.name}</span>
        </div>
        <div className="profile-field">
          <span className="label">Username</span>
          <span>{user.username}</span>
        </div>
        <div className="profile-field">
          <span className="label">Email</span>
          <span>{user.email}</span>
        </div>
        <div className="profile-field">
          <span className="label">Contact Number</span>
          <span>{user.contact}</span>
        </div>
        <div className="profile-field">
          <span className="label">Address</span>
          <span>{user.address}</span>
        </div>

        <div className="profile-actions">
          <button type="button" className="nav-btn" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
