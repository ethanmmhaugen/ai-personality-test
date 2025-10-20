import { create } from 'zustand';
import { quizApi } from '../api/quizApi';
import type { QuizState } from '../types/quiz';

interface QuizStore extends QuizState {
  startQuiz: (theme?: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<boolean>;
  setAnswer: (answer: string) => void;
  resetQuiz: () => void;
}

const initialState: QuizState = {
  sessionId: null,
  theme: 'fantasy',
  currentRound: 1,
  totalRounds: 6,
  currentPrompt: '',
  backgroundImageUrl: null,
  userAnswer: '',
  isLoading: false,
  error: null,
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  startQuiz: async (theme = 'fantasy') => {
    set({ isLoading: true, error: null });
    try {
      const response = await quizApi.startQuiz(theme);
      set({
        sessionId: response.sessionId,
        theme: response.theme,
        currentRound: response.currentRound,
        totalRounds: response.totalRounds,
        currentPrompt: response.initialPrompt,
        backgroundImageUrl: response.backgroundImageUrl,
        userAnswer: '',
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to start quiz',
        isLoading: false,
      });
    }
  },

  submitAnswer: async (answer: string) => {
    const { sessionId } = get();
    if (!sessionId) {
      set({ error: 'No active session' });
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await quizApi.respondToQuiz(sessionId, answer);

      if (response.isComplete) {
        // Quiz is complete
        set({
          currentRound: response.currentRound,
          userAnswer: '',
          isLoading: false,
        });
        return true; // Signal quiz completion
      } else {
        // More rounds to go
        set({
          currentRound: response.currentRound,
          currentPrompt: response.nextPrompt || '',
          backgroundImageUrl: response.backgroundImageUrl || null,
          userAnswer: '',
          isLoading: false,
        });
        return false; // Signal more rounds
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to submit answer',
        isLoading: false,
      });
      return false;
    }
  },

  setAnswer: (answer: string) => {
    set({ userAnswer: answer });
  },

  resetQuiz: () => {
    set(initialState);
  },
}));
