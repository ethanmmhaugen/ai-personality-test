import {
  QuizSession as IQuizSession,
  SessionStatus,
  TraitScores,
} from '../../../shared/types/quiz';
import db from '../db/connection';

export class QuizSession {
  static async create(theme: string, totalRounds: number): Promise<IQuizSession> {
    const result = await db.query(
      `INSERT INTO quiz_sessions (theme, total_rounds, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')
       RETURNING id, theme, status, current_round as "currentRound", total_rounds as "totalRounds",
                 accumulated_traits as "accumulatedTraits", assigned_character_id as "assignedCharacterId",
                 started_at as "startedAt", completed_at as "completedAt", expires_at as "expiresAt",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [theme, totalRounds]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<IQuizSession | null> {
    const result = await db.query(
      `SELECT id, theme, status, current_round as "currentRound", total_rounds as "totalRounds",
              accumulated_traits as "accumulatedTraits", assigned_character_id as "assignedCharacterId",
              started_at as "startedAt", completed_at as "completedAt", expires_at as "expiresAt",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM quiz_sessions
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async update(
    id: string,
    updates: {
      status?: SessionStatus;
      currentRound?: number;
      accumulatedTraits?: Partial<TraitScores>;
      assignedCharacterId?: number;
      completedAt?: Date;
    }
  ): Promise<IQuizSession> {
    const fields: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.currentRound !== undefined) {
      fields.push(`current_round = $${paramIndex++}`);
      values.push(updates.currentRound);
    }
    if (updates.accumulatedTraits !== undefined) {
      fields.push(`accumulated_traits = $${paramIndex++}`);
      values.push(JSON.stringify(updates.accumulatedTraits));
    }
    if (updates.assignedCharacterId !== undefined) {
      fields.push(`assigned_character_id = $${paramIndex++}`);
      values.push(updates.assignedCharacterId);
    }
    if (updates.completedAt !== undefined) {
      fields.push(`completed_at = $${paramIndex++}`);
      values.push(updates.completedAt);
    }

    values.push(id);

    const result = await db.query(
      `UPDATE quiz_sessions
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, theme, status, current_round as "currentRound", total_rounds as "totalRounds",
                 accumulated_traits as "accumulatedTraits", assigned_character_id as "assignedCharacterId",
                 started_at as "startedAt", completed_at as "completedAt", expires_at as "expiresAt",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );
    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    await db.query('DELETE FROM quiz_sessions WHERE id = $1', [id]);
  }
}

export default QuizSession;

