import api from './api';
import { Bookmark, ApiResponse } from '../types';

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
