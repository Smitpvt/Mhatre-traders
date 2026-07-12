import api from './api.js';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },
  
  getMe: async () => {
    return await api.get('/auth/me');
  },
  
  updateProfile: async (name, email) => {
    return await api.put('/auth/profile', { name, email });
  },
  
  changePassword: async (oldPassword, newPassword) => {
    return await api.put('/auth/change-password', { oldPassword, newPassword });
  }
};

export default authService;
