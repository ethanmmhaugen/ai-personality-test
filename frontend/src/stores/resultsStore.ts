import { create } from 'zustand';
import { quizApi } from '../api/quizApi';
import type { ResultsState } from '../types/quiz';

interface ResultsStore extends ResultsState {
  fetchResults: (sessionId: string) => Promise<void>;
  resetResults: () => void;
}

const initialState: ResultsState = {
  character: null,
  traitScores: null,
  isLoading: false,
  error: null,
};

export const useResultsStore = create<ResultsStore>((set) => ({
  ...initialState,

  fetchResults: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quizApi.getResults(sessionId);
      set({
        character: response.character,
        traitScores: response.traitScores,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch results',
        isLoading: false,
      });
    }
  },

  resetResults: () => {
    set(initialState);
  },
}));
