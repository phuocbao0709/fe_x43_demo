import { http } from '@/shared/api/http';

export const bannerApi = {
  list: () => http.get('/api/banners'),
  create: (payload: FormData) => http.post('/api/banners', payload),
  update: (id: string, payload: FormData) => http.patch(`/api/banners/${id}`, payload),
  remove: (id: string) => http.delete(`/api/banners/${id}`)
};
