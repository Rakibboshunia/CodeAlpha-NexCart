
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('nexcart_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Products API
export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  addReview: (id, data) => API.post(`/products/${id}/reviews`, data),
};

// Orders API
export const ordersAPI = {
  create: (data) => API.post('/orders', data),
  getById: (id) => API.get(`/orders/${id}`),
  getMyOrders: () => API.get('/orders/my-orders'),
  cancel: (id) => API.put(`/orders/${id}/cancel`),
};

export default API;
