import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(stored);
  }, []);

  const saveCartItems = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
    setCartItems(items);
  };

  const handleQuantityChange = (id, delta) => {
    const nextItems = cartItems.map((item) => {
      if (item.id !== id) return item;
      const nextQty = Math.max(1, (Number(item.quantity) || 1) + delta);
      return { ...item, quantity: nextQty };
    });
    saveCartItems(nextItems);
  };

  const handleRemoveItem = (id) => {
    const nextItems = cartItems.filter((item) => item.id !== id);
    saveCartItems(nextItems);
  };

  const grandTotal = cartItems.reduce((sum, item) => {
    const price = Number(item.amount || 0);
    const quantity = Number(item.quantity || 1);
    return sum + price * quantity;
  }, 0);

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h2>Shopping Cart</h2>
        <Link to="/home" className="nav-btn">
          Back to Home
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">Your cart is currently empty.</div>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Item Image</th>
                  <th>Item Name</th>
                  <th>Item Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => {
                  const imageUrl = item.image || '/images/mobile_1.jpg';
                  const price = Number(item.amount || 0);
                  const quantity = Number(item.quantity || 1);
                  return (
                    <tr key={item.id ?? `cart-${index}`}>
                      <td>{index + 1}</td>
                      <td>
                        <img src={imageUrl} alt={item.itemName} />
                      </td>
                      <td>{item.itemName}</td>
                      <td>₹ {price}</td>
                      <td>
                        <div className="quantity-cell">
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>₹ {price * quantity}</td>
                      <td>
                        <button
                          type="button"
                          className="nav-btn remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <span>Total Amount:</span>
            <strong>₹ {grandTotal}</strong>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
