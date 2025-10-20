// uuid is imported by QuizSessionModel which uses gen_random_uuid() in PostgreSQL
import AIService from './AIService';
import SessionService from './SessionService';
import TraitAnalysisService from './TraitAnalysisService';
import CharacterMatchingService from './CharacterMatchingService';
import QuizSessionModel from '../models/QuizSession';
import UserResponseModel from '../models/UserResponse';
import config from '../config';
import {
  QuizStartResponse,
  QuizRespondResponse,
  QuizResultsResponse,
  QuizStatusResponse,
} from '../../../shared/types/quiz';
import { AppError } from '../api/middleware/errorHandler';

export class QuizOrchestrator {
  private aiService: AIService;
  private sessionService: SessionService;
  private traitAnalysis: TraitAnalysisService;
  private characterMatching: CharacterMatchingService;

  constructor() {
    this.aiService = new AIService();
    this.sessionService = new SessionService();
    this.traitAnalysis = new TraitAnalysisService();
    this.characterMatching = new CharacterMatchingService();
  }

  /**
   * Start a new quiz session
   */
  async startQuiz(theme: string = 'fantasy'): Promise<QuizStartResponse> {
    const totalRounds = config.quiz.defaultRounds;

    // Create session in PostgreSQL
    const dbSession = await QuizSessionModel.create(theme, totalRounds);
    const sessionId = dbSession.id;

    // Create session in Redis for active tracking
    await this.sessionService.createSession(sessionId, theme, totalRounds);

    // Generate initial prompt (hardcoded for round 1)
    const { prompt } = await this.aiService.generateStoryPrompt(1, null, theme);

    // Generate background image for initial prompt
    const { imageUrl } = await this.aiService.generateBackgroundImage(prompt);

    // Store prompt in session
    await this.sessionService.storeLastPrompt(sessionId, prompt, imageUrl);

    return {
      sessionId,
      theme,
      totalRounds,
      currentRound: 1,
      initialPrompt: prompt,
      backgroundImageUrl: imageUrl,
    };
  }

  /**
   * Process user response and generate next prompt
   */
  async respondToQuiz(sessionId: string, answer: string): Promise<QuizRespondResponse> {
    // Get session from Redis
    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      throw new AppError(404, 'Quiz session not found or expired');
    }

    // Check if quiz is already complete
    if (session.currentRound > session.totalRounds) {
      throw new AppError(400, 'Quiz is already completed');
    }

    // Extract traits from the answer
    const { traits, generationTimeMs: traitTime } = await this.aiService.extractTraitScores(answer);

    // Save the user response to database
    await UserResponseModel.create({
      sessionId,
      roundNumber: session.currentRound,
      storyPrompt: session.lastPrompt || '',
      backgroundImageUrl: session.lastImageUrl || null,
      userAnswer: answer,
      extractedTraits: traits,
      aiGenerationTimeMs: traitTime,
    });

    // Accumulate traits and increment round
    await this.sessionService.incrementRound(sessionId, traits);

    // Get updated session
    const updatedSession = await this.sessionService.getSession(sessionId);
    if (!updatedSession) {
      throw new AppError(500, 'Failed to update session');
    }

    const newRound = updatedSession.currentRound;
    const isComplete = newRound > session.totalRounds;

    // If quiz is complete, finalize it
    if (isComplete) {
      await this.finalizeQuiz(sessionId, updatedSession.accumulatedTraits);

      return {
        sessionId,
        currentRound: newRound,
        totalRounds: session.totalRounds,
        isComplete: true,
      };
    }

    // Generate next prompt
    const { prompt: nextPrompt } = await this.aiService.generateStoryPrompt(
      newRound,
      answer,
      session.theme
    );

    // Generate background image
    const { imageUrl: nextImageUrl } = await this.aiService.generateBackgroundImage(nextPrompt);

    // Store new prompt in session
    await this.sessionService.storeLastPrompt(sessionId, nextPrompt, nextImageUrl);

    return {
      sessionId,
      currentRound: newRound,
      totalRounds: session.totalRounds,
      nextPrompt,
      backgroundImageUrl: nextImageUrl,
      isComplete: false,
    };
  }

  /**
   * Finalize quiz: calculate final scores and assign character
   */
  private async finalizeQuiz(sessionId: string, accumulatedTraits: any): Promise<void> {
    // Get session from database
    const dbSession = await QuizSessionModel.findById(sessionId);
    if (!dbSession) {
      throw new AppError(404, 'Quiz session not found');
    }

    // Calculate normalized scores (0-100)
    const finalScores = this.traitAnalysis.calculateNormalizedScores(
      accumulatedTraits,
      dbSession.totalRounds
    );

    // Find best matching character
    const character = await this.characterMatching.findBestMatch(finalScores, dbSession.theme);

    if (!character) {
      throw new AppError(500, 'No matching character found');
    }

    // Update database session with final results
    await QuizSessionModel.update(sessionId, {
      status: 'completed',
      accumulatedTraits: finalScores,
      assignedCharacterId: character.id,
      completedAt: new Date(),
    });

    // Keep session in Redis for a bit longer for results retrieval
    // It will expire naturally after TTL
  }

  /**
   * Get quiz results
   */
  async getResults(sessionId: string): Promise<QuizResultsResponse> {
    // Get session from database
    const dbSession = await QuizSessionModel.findById(sessionId);
    if (!dbSession) {
      throw new AppError(404, 'Quiz session not found');
    }

    if (dbSession.status !== 'completed') {
      throw new AppError(400, 'Quiz is not completed yet');
    }

    if (!dbSession.assignedCharacterId) {
      throw new AppError(500, 'No character assigned');
    }

    // Get character details
    const CharacterTypeModel = (await import('../models/CharacterType')).default;
    const character = await CharacterTypeModel.findById(dbSession.assignedCharacterId);

    if (!character) {
      throw new AppError(500, 'Character not found');
    }

    return {
      sessionId,
      character,
      traitScores: dbSession.accumulatedTraits as any,
      completedAt: dbSession.completedAt!,
    };
  }

  /**
   * Get quiz status
   */
  async getStatus(sessionId: string): Promise<QuizStatusResponse> {
    // Try Redis first (active sessions)
    const redisSession = await this.sessionService.getSession(sessionId);

    if (redisSession) {
      return {
        sessionId,
        theme: redisSession.theme,
        status: redisSession.currentRound > redisSession.totalRounds ? 'completed' : 'in_progress',
        currentRound: redisSession.currentRound,
        totalRounds: redisSession.totalRounds,
      };
    }

    // Fall back to database
    const dbSession = await QuizSessionModel.findById(sessionId);
    if (!dbSession) {
      throw new AppError(404, 'Quiz session not found');
    }

    return {
      sessionId,
      theme: dbSession.theme,
      status: dbSession.status,
      currentRound: dbSession.currentRound,
      totalRounds: dbSession.totalRounds,
    };
  }
}

export default QuizOrchestrator;
