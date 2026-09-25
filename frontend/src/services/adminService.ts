import api from './api';
import { ApiResponse } from '../types';

export const adminService = {
  getUsers: async (params?: { search?: string; role?: string; page?: number }): Promise<ApiResponse<{ users: any[]; pagination: any }>> => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<ApiResponse> => {
    const res = await api.put(`/admin/users/${userId}/status`, { isActive });
    return res.data;
  },

  getStatistics: async (): Promise<ApiResponse<any>> => {
    const res = await api.get('/admin/statistics');
    return res.data;
  },

  // Sections Admin
  createSection: async (data: any): Promise<ApiResponse> => {
    const res = await api.post('/sections', data);
    return res.data;
  },
  updateSection: async (id: string, data: any): Promise<ApiResponse> => {
    const res = await api.put(`/sections/${id}`, data);
    return res.data;
  },
  deleteSection: async (id: string): Promise<ApiResponse> => {
    const res = await api.delete(`/sections/${id}`);
    return res.data;
  },

  // Topics Admin
  createTopic: async (data: any): Promise<ApiResponse> => {
    const res = await api.post('/topics', data);
    return res.data;
  },
  updateTopic: async (id: string, data: any): Promise<ApiResponse> => {
    const res = await api.put(`/topics/${id}`, data);
    return res.data;
  },
  deleteTopic: async (id: string): Promise<ApiResponse> => {
    const res = await api.delete(`/topics/${id}`);
    return res.data;
  },

  // Questions Admin
  getQuestions: async (params?: any): Promise<ApiResponse<{ questions: any[]; pagination: any }>> => {
    const res = await api.get('/questions', { params });
    return res.data;
  },
  createQuestion: async (data: any): Promise<ApiResponse> => {
    const res = await api.post('/questions', data);
    return res.data;
  },
  updateQuestion: async (id: string, data: any): Promise<ApiResponse> => {
    const res = await api.put(`/questions/${id}`, data);
    return res.data;
  },
  deleteQuestion: async (id: string): Promise<ApiResponse> => {
    const res = await api.delete(`/questions/${id}`);
    return res.data;
  },
  duplicateQuestion: async (id: string): Promise<ApiResponse> => {
    const res = await api.post(`/questions/${id}/duplicate`);
    return res.data;
  },
  importQuestions: async (questions: any[]): Promise<ApiResponse> => {
    const res = await api.post('/questions/import', { questions });
    return res.data;
  },

  // Tests Admin
  createTest: async (data: any): Promise<ApiResponse> => {
    const res = await api.post('/tests', data);
    return res.data;
  },
  updateTest: async (id: string, data: any): Promise<ApiResponse> => {
    const res = await api.put(`/tests/${id}`, data);
    return res.data;
  },
  deleteTest: async (id: string): Promise<ApiResponse> => {
    const res = await api.delete(`/tests/${id}`);
    return res.data;
  },
};
