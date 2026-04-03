import axios from 'axios';

// Base URL for your backend API
// You can override this by defining REACT_APP_API_BASE_URL in your .env file
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4001/api';
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_EXCLUDE_PATHS = ['/user/login', '/user/signup'];

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

// Automatically add the auth token for every request except signup/login
api.interceptors.request.use(config => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const url = config.url ?? '';
  const isAuthEndpoint = AUTH_EXCLUDE_PATHS.some(excluded => url.endsWith(excluded));

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Initialize default headers from any existing token in storage
setAuthToken(localStorage.getItem(AUTH_TOKEN_KEY));

export async function login({ email, password }) {
  const response = await api.post('/user/login', { email, password });
  const data = response.data;
  const token = data?.token ?? data?.accessToken;

  if (token) {
    setAuthToken(token);
  }

  return data;
}

export async function signup({ name, mobile, email, username, password, location }) {
  const response = await api.post('/user/signup', {
    name,
    mobile,
    email,
    username,
    password,
    location
  });
  return response.data;
}

export function logout() {
  setAuthToken(null);
  localStorage.removeItem('userId');
}

export async function addItemToCart({ userId, itemId, quantity }) {
  const response = await api.post('/shop/cart/addItemToCart', {
    userId,
    itemId,
    quantity
  });
  return response.data;
}

export async function getCartItems(userId) {
  const response = await api.get(`/shop/cart/${userId}`);
  return response.data;
}

export async function deleteItemFromCart({ userId, itemId }) {
  const response = await api.post('/shop/cart/deleteItemFromCart', {
    userId,
    itemId
  });
  return response.data;
}

// Add other endpoint helpers here (e.g., fetchItems, createItem, updateUser)
export async function getItems(page, limit) {
  const response = await api.get('/api/items/getItems', {
    params: {
      pageNumber: page,
      limit: limit
    }
  });
  return response.data;
}

const apiService = {
  login,
  signup,
  logout,
  addItemToCart,
  getCartItems,
  deleteItemFromCart,
  getItems
};

export default apiService;
