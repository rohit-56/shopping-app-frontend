import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import items from '../data';

function Home() {
  const [search, setSearch] = useState('');
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const customItems = JSON.parse(localStorage.getItem('customItems')) || [];
    const deletedIds = JSON.parse(localStorage.getItem('deletedItemIds')) || [];
    const merged = [...items, ...customItems].filter(i => !deletedIds.includes(i.id));
    setAllItems(merged);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = (id) => {
    setAllItems(prev => prev.filter(i => i.id !== id));

    const customItems = JSON.parse(localStorage.getItem('customItems')) || [];
    const isCustom = customItems.some(i => i.id === id);
    if (isCustom) {
      const updatedCustom = customItems.filter(i => i.id !== id);
      localStorage.setItem('customItems', JSON.stringify(updatedCustom));
    } else {
      const deleted = JSON.parse(localStorage.getItem('deletedItemIds')) || [];
      if (!deleted.includes(id)) {
        deleted.push(id);
        localStorage.setItem('deletedItemIds', JSON.stringify(deleted));
      }
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">
          <label htmlFor="search-category">Search by Category:</label>
          <input
            id="search-category"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Enter category..."
          />
        </div>
        <div className="navbar-right">
          <Link to="/add-item" className="nav-btn">+ Add Item</Link>
          <Link to="/signup" className="nav-btn">Signup</Link>
          <Link to="/login" className="nav-btn">Login</Link>
        </div>
      </nav>
      <h2 style={{ textAlign: 'center', marginTop: '32px' }}>Welcome to Home Page</h2>
      <div className="cart-view">
        <h3>Cart Items</h3>
        <div className="cart-list">
          {Array.isArray(allItems) && allItems.map(item => (
            <div className="cart-item" key={item.id}>
              {item.image && (
                <div className="cart-item-image">
                  <img src={item.image} alt={item.itemName} />
                </div>
              )}
              <div className="cart-item-header">
                <span className="cart-item-name">{item.itemName}</span>
                <span className="cart-item-price">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="cart-item-desc">{item.itemDescription}</div>
              <div className="cart-item-rating">Rating: {item.rating} ⭐</div>
              <div style={{ marginTop: 8 }}>
                <button
                  className="nav-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
