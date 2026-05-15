import { api } from '../lib/api';

function toDateOnly(value) {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return null;
}

export const registrosService = {
  list: ({ from, to } = {}) => {
    const params = new URLSearchParams();
    if (from) params.append('from', toDateOnly(from));
    if (to) params.append('to', toDateOnly(to));
    const qs = params.toString();
    return api.get(`/api/registros${qs ? `?${qs}` : ''}`);
  },
  byDate: (date) => {
    const day = toDateOnly(date);
    return api.get(`/api/registros?from=${day}&to=${day}`);
  },
  upsert: (payload) =>
    api.post('/api/registros', {
      ...payload,
      date: toDateOnly(payload.date),
    }),
  get: (id) => api.get(`/api/registros/${id}`),
  update: (id, payload) => api.patch(`/api/registros/${id}`, payload),
  delete: (id) => api.delete(`/api/registros/${id}`),
};

export { toDateOnly };
