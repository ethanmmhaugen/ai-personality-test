import { CharacterType, TraitScores } from '../../../shared/types/quiz';
import CharacterTypeModel from '../models/CharacterType';

export class CharacterMatchingService {
  /**
   * Find the best matching character based on trait scores using Euclidean distance
   * Lower distance = better match
   */
  async findBestMatch(userScores: TraitScores, theme: string): Promise<CharacterType | null> {
    // Get all characters for the theme
    const characters = await CharacterTypeModel.findByTheme(theme);

    if (characters.length === 0) {
      return null;
    }

    // Calculate distance for each character
    const matches = characters.map((character) => ({
      character,
      distance: this.calculateEuclideanDistance(userScores, character.traitProfile),
    }));

    // Sort by distance (ascending - lower is better)
    matches.sort((a, b) => a.distance - b.distance);

    // Return the best match
    return matches[0].character;
  }

  /**
   * Calculate Euclidean distance between user scores and character profile
   * Formula: √(Σ(user[trait] - character[trait])²)
   */
  private calculateEuclideanDistance(
    userScores: TraitScores,
    characterProfile: TraitScores
  ): number {
    const traitKeys: (keyof TraitScores)[] = ['F', 'I', 'S', 'G', 'E', 'N', 'A', 'D'];

    const sumOfSquares = traitKeys.reduce((sum, key) => {
      const diff = userScores[key] - characterProfile[key];
      return sum + diff * diff;
    }, 0);

    return Math.sqrt(sumOfSquares);
  }

  /**
   * Get top N matches with their similarity scores
   */
  async getTopMatches(
    userScores: TraitScores,
    theme: string,
    topN: number = 3
  ): Promise<Array<{ character: CharacterType; similarity: number }>> {
    const characters = await CharacterTypeModel.findByTheme(theme);

    if (characters.length === 0) {
      return [];
    }

    // Calculate similarity for each character (0-100 scale, higher is better)
    const matches = characters.map((character) => {
      const distance = this.calculateEuclideanDistance(userScores, character.traitProfile);
      // Convert distance to similarity score (0-100)
      // Max possible distance in 8D space with 0-100 values: √(8 × 100²) ≈ 283
      const maxDistance = Math.sqrt(8 * 100 * 100);
      const similarity = Math.max(0, Math.round((1 - distance / maxDistance) * 100));

      return { character, similarity };
    });

    // Sort by similarity (descending - higher is better)
    matches.sort((a, b) => b.similarity - a.similarity);

    return matches.slice(0, topN);
  }

  /**
   * Calculate trait similarity percentage for a specific trait
   */
  calculateTraitSimilarity(userScore: number, characterScore: number): number {
    const diff = Math.abs(userScore - characterScore);
    return Math.max(0, 100 - diff);
  }
}

export default CharacterMatchingService;
