import api from './api';
import { Section, Topic, ApiResponse } from '../types';

export const sectionService = {
  getSections: async (): Promise<ApiResponse<Section[]>> => {
    const res = await api.get('/sections');
    return res.data;
  },

  getSectionById: async (id: string): Promise<ApiResponse<Section & { topics: Topic[] }>> => {
    const res = await api.get(`/sections/${id}`);
    return res.data;
  },

  getTopics: async (sectionId?: string): Promise<ApiResponse<Topic[]>> => {
    const res = await api.get('/topics', { params: { sectionId } });
    return res.data;
  },

  getTopicById: async (id: string): Promise<ApiResponse<Topic>> => {
    const res = await api.get(`/topics/${id}`);
    return res.data;
  },
};
