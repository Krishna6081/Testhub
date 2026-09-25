import api from './api';
import { Bookmark, LeaderboardUser, ApiResponse } from '../types';

export const bookmarkService = {
  getBookmarks: async (): Promise<ApiResponse<Bookmark[]>> => {
    const res = await api.get('/bookmarks');
    return res.data;
  },

  addBookmark: async (questionId: string): Promise<ApiResponse<Bookmark>> => {
    const res = await api.post('/bookmarks', { questionId });
    return res.data;
  },

  removeBookmark: async (id: string): Promise<ApiResponse> => {
    const res = await api.delete(`/bookmarks/${id}`);
    return res.data;
  },
};

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<{ stats: any; recentAttempts: any[]; recommendedTests: any[]; weakTopics: any[] }>> => {
    const res = await api.get('/dashboard');
    return res.data;
  },

  getPerformance: async (): Promise<ApiResponse<{ performanceOverTime: any[]; sectionPerformance: any[]; topicPerformance: any[]; overallSummary: any }>> => {
    const res = await api.get('/dashboard/performance');
    return res.data;
  },

  getWeakTopics: async (): Promise<ApiResponse<any[]>> => {
    const res = await api.get('/dashboard/weak-topics');
    return res.data;
  },

  getLeaderboard: async (timeframe: string = 'all'): Promise<ApiResponse<LeaderboardUser[]>> => {
    const res = await api.get('/leaderboard', { params: { timeframe } });
    return res.data;
  },
};
