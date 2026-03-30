import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { logout, getItems } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 9;
  const TOTAL_PAGES = 10; // 0..9

  const loadItems = async (page) => {
    try {
      const result = await getItems(page, ITEMS_PER_PAGE);
      let apiItems = [];

      if (Array.isArray(result)) {
        apiItems = result;
      } else {
        apiItems = Array.isArray(result.items) ? result.items : [];
      }

      const customItems = JSON.parse(localStorage.getItem('customItems')) || [];
      const deletedIds = JSON.parse(localStorage.getItem('deletedItemIds')) || [];
      const merged = [...apiItems, ...customItems].filter(i => !deletedIds.includes(i.id));

      setAllItems(merged);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  useEffect(() => {
    loadItems(currentPage);
  }, [currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleAddToCart = (item) => {
    try {
      const itemId = item.id ?? item._id ?? `${item.itemName}-${item.amount}`;
      const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItem = savedCart.find((cartItem) => cartItem.id === itemId);

      const nextCart = existingItem
        ? savedCart.map((cartItem) =>
            cartItem.id === itemId
              ? { ...cartItem, quantity: Number(cartItem.quantity || 1) + 1 }
              : cartItem
          )
        : [
            ...savedCart,
            {
              id: itemId,
              itemName: item.itemName,
              amount: item.amount ?? item.price ?? 0,
              quantity: 1,
              image: item.image || '/images/mobile_1.jpg',
            },
          ];

      localStorage.setItem('cartItems', JSON.stringify(nextCart));
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const changePage = (newPage) => {
    let safePage = newPage;
    if (safePage < 0 || safePage >= TOTAL_PAGES) {
      safePage = 0;
    }
    setCurrentPage(safePage);
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

  const filteredItems = allItems.filter(item => {
    if (!search.trim()) return true;
    return item.category?.toLowerCase().includes(search.trim().toLowerCase());
  });

  const derivedTotalPages = TOTAL_PAGES;
  const currentPageSafe = Math.max(0, Math.min(TOTAL_PAGES - 1, currentPage));
  const currentItems = filteredItems; // server side paging is applied in getItems()

  useEffect(() => {
    if (currentPage !== currentPageSafe) {
      setCurrentPage(currentPageSafe);
    }
  }, [currentPage, currentPageSafe]);

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
          <Link to="/cart" className="nav-btn">Cart</Link>
          <button
            type="button"
            className="nav-btn"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="cart-view">
        <h3>Products</h3>
        <div className="cart-list">
          {Array.isArray(currentItems) && currentItems.length > 0 ? (
            currentItems.map((item, index) => {
              const itemKey = item.id ?? item._id ?? `item-${index}`;
              return (
                <div className="cart-item" key={itemKey}>
                  <div className="cart-item-image">
                    <img src="/images/mobile_1.jpg" alt={item.itemName} />
                  </div>
                  <div className="cart-item-header">
                    <span className="cart-item-name">{item.itemName}</span>
                  </div>
                  <div className="cart-item-desc">{item.description}</div>
                  <div className="cart-item-price">Price: ₹ {item.amount}</div>
                  <div className="cart-item-actions">
                    <button
                      className="nav-btn add-cart-btn"
                      type="button"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="nav-btn"
                      type="button"
                      onClick={() => console.log('Add to wishlist', item.id)}
                    >
                      Add to Wishlist
                    </button>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button
                      className="nav-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '18px 16px', textAlign: 'center' }}>
              No items found.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, gap: 8 }}>
          <button
            className="nav-btn"
            type="button"
            onClick={() => changePage(currentPageSafe - 1)}
            disabled={currentPageSafe === 0}
          >
            Previous
          </button>

          <span style={{ alignSelf: 'center' }}>
            Page {currentPageSafe} of {derivedTotalPages - 1}
          </span>

          <button
            className="nav-btn"
            type="button"
            onClick={() => changePage(currentPageSafe + 1)}
            disabled={currentPageSafe === derivedTotalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
