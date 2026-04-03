import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';
import { getCartItems, deleteItemFromCart, addItemToCart } from '../services/api';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const getCurrentUserId = () => {
    return (
      localStorage.getItem('userId') ||
      localStorage.getItem('userEmail') ||
      localStorage.getItem('userName') ||
      'guest'
    );
  };

  const loadCartItems = async () => {
    const userId = getCurrentUserId();
    try {
      const result = await getCartItems(userId);
      const items = Array.isArray(result)
        ? result
        : Array.isArray(result.items)
        ? result.items
        : Array.isArray(result.cartItems)
        ? result.cartItems
        : [];
      const normalized = items.map((item) => ({
        ...item,
        id: item.id ?? item._id ?? item.itemId,
        itemName: item.itemName ?? item.name ?? item.title ?? item.productName,
        itemPrice: item.itemPrice ?? item.price ?? item.amount ?? 0,
        quantity: Number(item.quantity ?? 1),
      }));
      setCartItems(normalized);
      setTotalAmount(Number(result.totalAmount ?? result.totalPrice ?? result.grandTotal ?? 0));
    } catch (error) {
      console.error('Failed to load cart items:', error);
      setCartItems([]);
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const handleQuantityChange = async (id, delta) => {
    const nextItems = cartItems.map((item) => {
      if (item.id !== id) return item;
      const currentQty = Number(item.quantity || 1);
      const availableQty = item.available ?? item.availableQuantity ?? item.stock ?? null;
      const maxQty = availableQty !== null ? Number(availableQty) : Infinity;
      const nextQty = Math.max(1, Math.min(maxQty, currentQty + delta));
      return { ...item, quantity: nextQty };
    });
    setCartItems(nextItems);

    const updatedItem = nextItems.find((item) => item.id === id);
    if (!updatedItem) return;

    try {
      await addItemToCart({
        userId: getCurrentUserId(),
        itemId: id,
        quantity: Number(updatedItem.quantity || 1)
      });
      await loadCartItems();
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      await loadCartItems();
    }
  };

  const handleRemoveItem = async (id) => {
    const nextItems = cartItems.filter((item) => item.id !== id);
    setCartItems(nextItems);

    try {
      await deleteItemFromCart({
        userId: getCurrentUserId(),
        itemId: id
      });
      await loadCartItems();
    } catch (error) {
      console.error('Failed to delete cart item:', error);
      await loadCartItems();
    }
  };

  const grandTotal = totalAmount;

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
                  const price = Number(item.itemPrice ?? item.price ?? item.amount ?? 0);
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
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={
                              (item.available ?? item.availableQuantity ?? item.stock ?? null) !== null &&
                              quantity >= Number(item.available ?? item.availableQuantity ?? item.stock)
                            }
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
