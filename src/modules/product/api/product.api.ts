import { http } from '@/shared/api/http';

export const productApi = {
  list: (params?: { category?: string; featured?: boolean; limit?: number; page?: number }) =>
    http.get('/api/products', { params }),
  getBySlug: (slug: string) => http.get(`/api/products/${slug}`),
  create: (payload: FormData) => http.post('/api/products', payload),
  update: (id: string, payload: FormData) => http.patch(`/api/products/${id}`, payload),
  remove: (id: string) => http.delete(`/api/products/${id}`)
};
