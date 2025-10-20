import { Router, Request, Response, NextFunction } from 'express';
import QuizOrchestrator from '../../services/QuizOrchestrator';
import { validateRequest } from '../middleware/validation';
import {
  startQuizSchema,
  respondToQuizSchema,
  getResultsSchema,
  getStatusSchema,
} from '../schemas/quiz.schema';

const router = Router();
const orchestrator = new QuizOrchestrator();

/**
 * POST /quiz/start
 * Start a new quiz session
 */
router.post(
  '/start',
  validateRequest(startQuizSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { theme = 'fantasy' } = req.body;
      const result = await orchestrator.startQuiz(theme);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /quiz/:sessionId/respond
 * Submit answer and get next prompt
 */
router.post(
  '/:sessionId/respond',
  validateRequest(respondToQuizSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const { answer } = req.body;

      const result = await orchestrator.respondToQuiz(sessionId, answer);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /quiz/:sessionId/results
 * Get final quiz results with character assignment
 */
router.get(
  '/:sessionId/results',
  validateRequest(getResultsSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const result = await orchestrator.getResults(sessionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /quiz/:sessionId/status
 * Get current quiz session status
 */
router.get(
  '/:sessionId/status',
  validateRequest(getStatusSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const result = await orchestrator.getStatus(sessionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
