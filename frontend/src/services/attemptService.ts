import api from './api';
import { TestAttempt, ApiResponse } from '../types';

export const attemptService = {
  getUserAttempts: async (params?: { sectionId?: string; topicId?: string; search?: string; page?: number; limit?: number }): Promise<ApiResponse<{ attempts: TestAttempt[]; pagination: any }>> => {
    const res = await api.get('/attempts', { params });
    return res.data;
  },

  getAttemptDetails: async (id: string): Promise<ApiResponse<{ attempt: any; answers: any[]; sectionPerformance: any[]; topicPerformance: any[] }>> => {
    const res = await api.get(`/attempts/${id}`);
    return res.data;
  },
};
