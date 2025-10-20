import axios from 'axios';
import type { QuizStartResponse, QuizRespondResponse, QuizResultsResponse } from '../types/quiz';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizApi = {
  /**
   * Start a new quiz session
   */
  startQuiz: async (theme: string = 'fantasy'): Promise<QuizStartResponse> => {
    const response = await apiClient.post<QuizStartResponse>('/quiz/start', { theme });
    return response.data;
  },

  /**
   * Submit an answer and get the next prompt
   */
  respondToQuiz: async (sessionId: string, answer: string): Promise<QuizRespondResponse> => {
    const response = await apiClient.post<QuizRespondResponse>(`/quiz/${sessionId}/respond`, {
      answer,
    });
    return response.data;
  },

  /**
   * Get final quiz results
   */
  getResults: async (sessionId: string): Promise<QuizResultsResponse> => {
    const response = await apiClient.get<QuizResultsResponse>(`/quiz/${sessionId}/results`);
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default quizApi;
