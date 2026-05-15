import { api } from '../lib/api';

export const lembretesService = {
  list: ({ completed } = {}) => {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append('completed', String(completed));
    const qs = params.toString();
    return api.get(`/api/lembretes${qs ? `?${qs}` : ''}`);
  },
  create: (payload) => api.post('/api/lembretes', payload),
  get: (id) => api.get(`/api/lembretes/${id}`),
  update: (id, payload) => api.patch(`/api/lembretes/${id}`, payload),
  delete: (id) => api.delete(`/api/lembretes/${id}`),
};
