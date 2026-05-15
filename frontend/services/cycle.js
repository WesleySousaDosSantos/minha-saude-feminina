import { api } from '../lib/api';

export const cycleService = {
  get: () => api.get('/api/cycle'),
  upsert: (payload) => api.put('/api/cycle', payload),
};
