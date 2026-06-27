import { http } from '@/shared/api/http';

export const homeApi = {
  getHome: () => http.get('/api/home'),
};
