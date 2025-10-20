// Re-export shared types and add frontend-specific types
export type {
  TraitScores,
  CharacterType,
  QuizStartResponse,
  QuizRespondResponse,
  QuizResultsResponse,
} from '../../../shared/types/quiz';

export interface QuizState {
  sessionId: string | null;
  theme: string;
  currentRound: number;
  totalRounds: number;
  currentPrompt: string;
  backgroundImageUrl: string | null;
  userAnswer: string;
  isLoading: boolean;
  error: string | null;
}

export interface ResultsState {
  character: CharacterType | null;
  traitScores: TraitScores | null;
  isLoading: boolean;
  error: string | null;
}
