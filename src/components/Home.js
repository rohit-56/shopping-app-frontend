import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { logout, getItems, addItemToCart, getItemByCategory } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categorySearchResults, setCategorySearchResults] = useState(null);
  const [isSearchingByCategory, setIsSearchingByCategory] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const ITEMS_PER_PAGE = 9;
  const TOTAL_PAGES = 10; // 0..9
  const CATEGORIES = ['MOBILE', 'LAPTOP', 'TELEVISION'];

  const getBackendItemId = (item) =>
    item._id ?? item.itemId ?? (item.id && item.id !== item.itemName ? item.id : undefined);

  const normalizeBackendItem = (item) => ({
    ...item,
    id: getBackendItemId(item),
  });

  const loadItems = async (page) => {
    try {
      const result = await getItems(page, ITEMS_PER_PAGE);
      let apiItems = [];

      if (Array.isArray(result)) {
        apiItems = result.map(normalizeBackendItem);
      } else {
        apiItems = Array.isArray(result.items) ? result.items.map(normalizeBackendItem) : [];
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

  const getCurrentUserId = () => {
    return (
      localStorage.getItem('userId') ||
      localStorage.getItem('userEmail') ||
      localStorage.getItem('userName') ||
      'guest'
    );
  };

  const getImageForCategory = (category) => {
    if (!category) return '/images/mobile_1.jpg';
    const normalized = category.toString().trim().toUpperCase();
    if (normalized === 'MOBILE') return '/images/mobile_1.jpg';
    if (normalized === 'LAPTOP') return '/images/laptop_1.jpg';
    if (normalized === 'TELEVISION') return '/images/television_1.jpg';
    return '/images/mobile_1.jpg';
  };

  const getSuggestions = (input) => {
    if (!input.trim()) return [];
    const lowerInput = input.toLowerCase();
    return CATEGORIES.filter(cat => 
      cat.toLowerCase().startsWith(lowerInput)
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(0);
    setCategorySearchResults(null);
    setIsSearchingByCategory(false);
    
    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCategorySelect = async (category) => {
    setSearch(category);
    setShowSuggestions(false);
    setIsSearchingByCategory(true);
    
    try {
      const result = await getItemByCategory(category);
      let items = [];
      
      if (Array.isArray(result)) {
        items = result.map(normalizeBackendItem);
      } else if (result.items && Array.isArray(result.items)) {
        items = result.items.map(normalizeBackendItem);
      } else if (result.data && Array.isArray(result.data)) {
        items = result.data.map(normalizeBackendItem);
      }
      
      setCategorySearchResults(items);
    } catch (error) {
      console.error('Failed to fetch category items:', error);
      setCategorySearchResults([]);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const itemId = getBackendItemId(item);
      if (!itemId) {
        console.error('Unable to add item to cart: missing backend item id', item);
        return;
      }
      const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItem = savedCart.find((cartItem) => cartItem.id === itemId);
      const availableQty = item.available ?? item.availableQuantity ?? item.stock ?? item.quantity ?? null;
      const nextQuantity = existingItem
        ? Number(existingItem.quantity || 1) + 1
        : 1;

      const nextCart = existingItem
        ? savedCart.map((cartItem) =>
            cartItem.id === itemId
              ? {
                  ...cartItem,
                  quantity: nextQuantity,
                  available: cartItem.available ?? availableQty,
                }
              : cartItem
          )
        : [
            ...savedCart,
            {
              id: itemId,
              itemName: item.itemName,
              amount: item.amount ?? item.price ?? 0,
              quantity: 1,
              image: item.image || getImageForCategory(item.category),
              available: availableQty,
            },
          ];

      localStorage.setItem('cartItems', JSON.stringify(nextCart));
      const userId = getCurrentUserId();
      try {
        await addItemToCart({ userId, itemId, quantity: nextQuantity });
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
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
    setCategorySearchResults(prev => 
      prev ? prev.filter(i => i.id !== id) : prev
    );

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

  const suggestions = getSuggestions(search);
  
  // Use category search results if available, otherwise filter all items
  const displayItems = isSearchingByCategory && categorySearchResults !== null 
    ? categorySearchResults 
    : allItems.filter(item => {
        if (!search.trim()) return true;
        return item.category?.toLowerCase().includes(search.trim().toLowerCase());
      });

  const derivedTotalPages = TOTAL_PAGES;
  const currentPageSafe = Math.max(0, Math.min(TOTAL_PAGES - 1, currentPage));
  const currentItems = displayItems;

  useEffect(() => {
    if (currentPage !== currentPageSafe) {
      setCurrentPage(currentPageSafe);
    }
  }, [currentPage, currentPageSafe]);

  const handleClearSearch = () => {
    setSearch('');
    setShowSuggestions(false);
    setCategorySearchResults(null);
    setIsSearchingByCategory(false);
    setCurrentPage(0);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="search-category-wrapper">
            <label htmlFor="search-category">Search by Category:</label>
            <div className="search-input-container">
              <input
                id="search-category"
                type="text"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => search.trim() && setShowSuggestions(true)}
                placeholder="Enter category (e.g., MOBILE, LAPTOP, TABLET)..."
                autoComplete="off"
              />
              {search && (
                <button 
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="suggestion-item"
                      onClick={() => handleCategorySelect(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="navbar-right">
          <Link to="/add-item" className="nav-btn">+ Add Item</Link>
          <Link to="/cart" className="nav-btn">🛒 Cart</Link>
          <div className="user-dropdown-container">
            <button
              type="button"
              className="nav-btn user-dropdown-btn"
              onClick={() => setShowUserMenu((prev) => !prev)}
            >
              Profile ▾
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu">
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="cart-view">
        <h3>
          {isSearchingByCategory ? `Products in ${search}` : 'Products'}
        </h3>
        <div className="cart-list">
          {Array.isArray(currentItems) && currentItems.length > 0 ? (
            currentItems.map((item, index) => {
              const itemKey = item.id ?? item._id ?? `item-${index}`;
              return (
                <div className="cart-item" key={itemKey}>
                  <div className="cart-item-image">
                    <img src={item.image || getImageForCategory(item.category)} alt={item.itemName} />
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
                      disabled={
                        (item.available ?? item.availableQuantity ?? item.stock ?? item.quantity ?? null) !== null &&
                        Number(item.available ?? item.availableQuantity ?? item.stock ?? item.quantity) <= 0
                      }
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

        {!isSearchingByCategory && (
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
        )}
      </div>
    </div>
  );
}

export default Home;
