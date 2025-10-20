import redis from '../db/redis';
import config from '../config';
import { TraitScores } from '../../../shared/types/quiz';

interface SessionData {
  id: string;
  theme: string;
  currentRound: number;
  totalRounds: number;
  accumulatedTraits: Partial<TraitScores>;
  lastPrompt?: string;
  lastImageUrl?: string | null;
  startedAt: string;
}

export class SessionService {
  private getTTL(): number {
    return config.redis.sessionTTL;
  }

  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

  /**
   * Create a new session in Redis
   */
  async createSession(sessionId: string, theme: string, totalRounds: number): Promise<SessionData> {
    const sessionData: SessionData = {
      id: sessionId,
      theme,
      currentRound: 1,
      totalRounds,
      accumulatedTraits: {},
      startedAt: new Date().toISOString(),
    };

    await redis.setJson(this.getSessionKey(sessionId), sessionData, this.getTTL());
    return sessionData;
  }

  /**
   * Get session from Redis
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    return redis.getJson<SessionData>(this.getSessionKey(sessionId));
  }

  /**
   * Update session data
   */
  async updateSession(
    sessionId: string,
    updates: Partial<SessionData>
  ): Promise<SessionData | null> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }

    const updatedSession: SessionData = {
      ...session,
      ...updates,
    };

    await redis.setJson(this.getSessionKey(sessionId), updatedSession, this.getTTL());
    return updatedSession;
  }

  /**
   * Delete session from Redis
   */
  async deleteSession(sessionId: string): Promise<void> {
    await redis.del(this.getSessionKey(sessionId));
  }

  /**
   * Check if session exists
   */
  async sessionExists(sessionId: string): Promise<boolean> {
    const exists = await redis.exists(this.getSessionKey(sessionId));
    return exists === 1;
  }

  /**
   * Increment round number and accumulate traits
   */
  async incrementRound(
    sessionId: string,
    newTraits: Partial<TraitScores>
  ): Promise<SessionData | null> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }

    // Accumulate traits
    const accumulated = session.accumulatedTraits || {};
    const traitKeys: (keyof TraitScores)[] = ['F', 'I', 'S', 'G', 'E', 'N', 'A', 'D'];

    traitKeys.forEach((key) => {
      const currentValue = accumulated[key] || 0;
      const newValue = newTraits[key] || 0;
      accumulated[key] = currentValue + newValue;
    });

    return this.updateSession(sessionId, {
      currentRound: session.currentRound + 1,
      accumulatedTraits: accumulated,
    });
  }

  /**
   * Store the last prompt and image for reference
   */
  async storeLastPrompt(sessionId: string, prompt: string, imageUrl: string | null): Promise<void> {
    await this.updateSession(sessionId, {
      lastPrompt: prompt,
      lastImageUrl: imageUrl,
    });
  }
}

export default SessionService;
