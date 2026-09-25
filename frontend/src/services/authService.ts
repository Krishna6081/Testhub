import api from './api';
import { User, ApiResponse } from '../types';

export const authService = {
  register: async (data: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (data: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
