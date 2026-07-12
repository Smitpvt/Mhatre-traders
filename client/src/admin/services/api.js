import { adminToast } from '../utils/toast.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  } else {
    // Strip manual multipart Content-Type headers so the browser can assign the correct boundary
    delete headers['Content-Type'];
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    credentials: 'include', // essential for cookie exchanges
    ...options,
    headers
  };

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    
    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = { success: response.ok, message: response.statusText };
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        
        // Prevent toast loops if already attempting login
        if (!window.location.pathname.endsWith('/admin/login')) {
          adminToast.error('Session expired. Please sign in again.');
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
        }
      }
      
      const error = new Error(responseData.message || `API Error: ${response.status}`);
      error.status = response.status;
      error.errors = responseData.errors || [];
      throw error;
    }

    return responseData;
  } catch (err) {
    throw err;
  }
};

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { 
    ...options, 
    method: 'POST', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  put: (endpoint, body, options) => request(endpoint, { 
    ...options, 
    method: 'PUT', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' })
};

export default api;
