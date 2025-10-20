import { TraitScores } from '../../../shared/types/quiz';

export class TraitAnalysisService {
  /**
   * Calculate normalized trait scores (0-100 scale) from accumulated scores
   * Accumulated scores are summed across all rounds (0-20 per round × 6 rounds = 0-120 max per trait)
   * We normalize to 0-100 scale for final results
   */
  calculateNormalizedScores(
    accumulatedTraits: Partial<TraitScores>,
    totalRounds: number
  ): TraitScores {
    const maxPossibleScore = totalRounds * 20; // 20 points max per round
    const traitKeys: (keyof TraitScores)[] = ['F', 'I', 'S', 'G', 'E', 'N', 'A', 'D'];

    const normalized: any = {};

    traitKeys.forEach((key) => {
      const accumulated = accumulatedTraits[key] || 0;
      // Normalize to 0-100 scale
      normalized[key] = Math.round((accumulated / maxPossibleScore) * 100);
    });

    return normalized as TraitScores;
  }

  /**
   * Validate that accumulated traits have reasonable values
   */
  validateTraitScores(accumulatedTraits: Partial<TraitScores>, totalRounds: number): boolean {
    const maxPossibleScore = totalRounds * 20;
    const traitKeys: (keyof TraitScores)[] = ['F', 'I', 'S', 'G', 'E', 'N', 'A', 'D'];

    return traitKeys.every((key) => {
      const value = accumulatedTraits[key] || 0;
      return value >= 0 && value <= maxPossibleScore;
    });
  }

  /**
   * Get trait summary statistics
   */
  getTraitStats(scores: TraitScores): {
    highest: { trait: keyof TraitScores; score: number };
    lowest: { trait: keyof TraitScores; score: number };
    average: number;
  } {
    const traitKeys: (keyof TraitScores)[] = ['F', 'I', 'S', 'G', 'E', 'N', 'A', 'D'];

    let highest = { trait: 'F' as keyof TraitScores, score: 0 };
    let lowest = { trait: 'F' as keyof TraitScores, score: 100 };
    let sum = 0;

    traitKeys.forEach((key) => {
      const score = scores[key];
      sum += score;

      if (score > highest.score) {
        highest = { trait: key, score };
      }
      if (score < lowest.score) {
        lowest = { trait: key, score };
      }
    });

    return {
      highest,
      lowest,
      average: Math.round(sum / traitKeys.length),
    };
  }
}

export default TraitAnalysisService;
