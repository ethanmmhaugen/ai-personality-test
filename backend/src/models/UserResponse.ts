import { UserResponse as IUserResponse, TraitScores } from '../../../shared/types/quiz';
import db from '../db/connection';

export class UserResponse {
  static async create(data: {
    sessionId: string;
    roundNumber: number;
    storyPrompt: string;
    backgroundImageUrl: string | null;
    userAnswer: string;
    extractedTraits: Partial<TraitScores>;
    aiGenerationTimeMs: number | null;
  }): Promise<IUserResponse> {
    const result = await db.query(
      `INSERT INTO user_responses (session_id, round_number, story_prompt, background_image_url, 
                                   user_answer, extracted_traits, ai_generation_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, session_id as "sessionId", round_number as "roundNumber", story_prompt as "storyPrompt",
                 background_image_url as "backgroundImageUrl", user_answer as "userAnswer",
                 extracted_traits as "extractedTraits", ai_generation_time_ms as "aiGenerationTimeMs",
                 created_at as "createdAt"`,
      [
        data.sessionId,
        data.roundNumber,
        data.storyPrompt,
        data.backgroundImageUrl,
        data.userAnswer,
        JSON.stringify(data.extractedTraits),
        data.aiGenerationTimeMs,
      ]
    );
    return result.rows[0];
  }

  static async findBySessionId(sessionId: string): Promise<IUserResponse[]> {
    const result = await db.query(
      `SELECT id, session_id as "sessionId", round_number as "roundNumber", story_prompt as "storyPrompt",
              background_image_url as "backgroundImageUrl", user_answer as "userAnswer",
              extracted_traits as "extractedTraits", ai_generation_time_ms as "aiGenerationTimeMs",
              created_at as "createdAt"
       FROM user_responses
       WHERE session_id = $1
       ORDER BY round_number`,
      [sessionId]
    );
    return result.rows;
  }

  static async findBySessionAndRound(
    sessionId: string,
    roundNumber: number
  ): Promise<IUserResponse | null> {
    const result = await db.query(
      `SELECT id, session_id as "sessionId", round_number as "roundNumber", story_prompt as "storyPrompt",
              background_image_url as "backgroundImageUrl", user_answer as "userAnswer",
              extracted_traits as "extractedTraits", ai_generation_time_ms as "aiGenerationTimeMs",
              created_at as "createdAt"
       FROM user_responses
       WHERE session_id = $1 AND round_number = $2`,
      [sessionId, roundNumber]
    );
    return result.rows[0] || null;
  }
}

export default UserResponse;

