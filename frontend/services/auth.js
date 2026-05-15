import { api } from '../lib/api';

export const authService = {
  login: (payload) => api.post('/api/auth/login', payload),
  register: (payload) => api.post('/api/auth/register', payload),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  me: () => api.get('/api/auth/me'),
  updateMe: (payload) => api.patch('/api/auth/me', payload),
  deleteMe: () => api.delete('/api/auth/me'),
};
