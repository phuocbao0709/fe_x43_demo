import { http } from '../../../shared/api/http';
import type { AuthPayload } from '../types/auth.types';

export const authApi = {
  register: (payload: AuthPayload) => http.post('/api/auth/register', payload),
  verifyRegisterOtp: (email: string, otp: string) =>
    http.post('/api/auth/register/verify-otp', { email, otp }),
  login: (payload: AuthPayload) => http.post('/api/auth/login', payload),
  forgotPassword: (email: string) => http.post('/api/auth/forgot-password', { email }),
  resetPassword: (email: string, token: string, newPassword: string) =>
    http.post('/api/auth/reset-password', { email, token, newPassword }),
  getMe: () => http.get('/api/auth/me')
};
