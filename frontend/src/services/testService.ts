import api from './api';
import { Test, Question, TestAttempt, ApiResponse } from '../types';

export interface GetTestsParams {
  sectionId?: string;
  topicId?: string;
  difficulty?: string;
  testType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const testService = {
  getTests: async (params?: GetTestsParams): Promise<ApiResponse<{ tests: Test[]; pagination: any }>> => {
    const res = await api.get('/tests', { params });
    return res.data;
  },

  getTestById: async (id: string): Promise<ApiResponse<Test>> => {
    const res = await api.get(`/tests/${id}`);
    return res.data;
  },

  startTest: async (id: string): Promise<ApiResponse<{ attempt: TestAttempt; test: any; questions: Question[] }>> => {
    const res = await api.post(`/tests/${id}/start`);
    return res.data;
  },

  submitTest: async (
    testId: string,
    attemptId: string,
    answers: { questionId: string; selectedOptionId?: string | null; timeSpent?: number }[]
  ): Promise<ApiResponse<{ attemptId: string; score: number; percentage: number; accuracy: number }>> => {
    const res = await api.post(`/tests/${testId}/submit`, { attemptId, answers });
    return res.data;
  },
};
