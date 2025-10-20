import { z } from 'zod';
import config from '../../config';

export const startQuizSchema = z.object({
  body: z.object({
    theme: z.string().min(1).max(50).optional().default('fantasy'),
  }),
});

export const respondToQuizSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid(),
  }),
  body: z.object({
    answer: z
      .string()
      .min(
        config.quiz.minAnswerLength,
        `Answer must be at least ${config.quiz.minAnswerLength} character`
      )
      .max(
        config.quiz.maxAnswerLength,
        `Answer must not exceed ${config.quiz.maxAnswerLength} characters`
      ),
  }),
});

export const getResultsSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid(),
  }),
});

export const getStatusSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid(),
  }),
});

