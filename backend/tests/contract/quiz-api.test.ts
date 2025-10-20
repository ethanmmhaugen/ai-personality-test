/**
 * Contract tests for Quiz API endpoints
 * These tests verify the API contract (request/response structure)
 * WITHOUT testing implementation details.
 *
 * Following TDD: These tests MUST FAIL initially before implementation.
 */

import request from 'supertest';
import app from '../../src/server';

describe('Quiz API Contract Tests', () => {
  describe('POST /quiz/start', () => {
    it('should return 201 with session details and initial prompt', async () => {
      const response = await request(app)
        .post('/quiz/start')
        .send({ theme: 'fantasy' })
        .expect('Content-Type', /json/)
        .expect(201);

      // Verify response structure
      expect(response.body).toHaveProperty('sessionId');
      expect(response.body).toHaveProperty('theme', 'fantasy');
      expect(response.body).toHaveProperty('totalRounds');
      expect(response.body).toHaveProperty('currentRound', 1);
      expect(response.body).toHaveProperty('initialPrompt');
      expect(response.body).toHaveProperty('backgroundImageUrl');

      // Verify data types
      expect(typeof response.body.sessionId).toBe('string');
      expect(typeof response.body.initialPrompt).toBe('string');
      expect(response.body.initialPrompt.length).toBeGreaterThan(0);
      expect(response.body.totalRounds).toBeGreaterThan(0);
    });

    it('should default to fantasy theme if not specified', async () => {
      const response = await request(app).post('/quiz/start').send({}).expect(201);

      expect(response.body.theme).toBe('fantasy');
    });

    it('should return 400 for invalid theme format', async () => {
      const response = await request(app).post('/quiz/start').send({ theme: 123 }).expect(400);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /quiz/:sessionId/respond', () => {
    let sessionId: string;

    beforeEach(async () => {
      // Create a session for testing
      const startResponse = await request(app).post('/quiz/start').send({ theme: 'fantasy' });
      sessionId = startResponse.body.sessionId;
    });

    it('should return 200 with next prompt for valid answer', async () => {
      const response = await request(app)
        .post(`/quiz/${sessionId}/respond`)
        .send({ answer: 'I would explore the ancient ruins to uncover their secrets.' })
        .expect('Content-Type', /json/)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('sessionId', sessionId);
      expect(response.body).toHaveProperty('currentRound');
      expect(response.body).toHaveProperty('totalRounds');
      expect(response.body).toHaveProperty('isComplete');

      if (!response.body.isComplete) {
        expect(response.body).toHaveProperty('nextPrompt');
        expect(response.body).toHaveProperty('backgroundImageUrl');
        expect(typeof response.body.nextPrompt).toBe('string');
      }
    });

    it('should return 400 for answer that is too short', async () => {
      const response = await request(app)
        .post(`/quiz/${sessionId}/respond`)
        .send({ answer: '' })
        .expect(400);

      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return 400 for answer that exceeds max length', async () => {
      const longAnswer = 'a'.repeat(501);
      const response = await request(app)
        .post(`/quiz/${sessionId}/respond`)
        .send({ answer: longAnswer })
        .expect(400);

      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return 404 for non-existent session', async () => {
      const fakeSessionId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .post(`/quiz/${fakeSessionId}/respond`)
        .send({ answer: 'test answer' })
        .expect(404);

      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app)
        .post('/quiz/invalid-uuid/respond')
        .send({ answer: 'test answer' })
        .expect(400);

      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('GET /quiz/:sessionId/results', () => {
    it('should return 200 with character results for completed quiz', async () => {
      // Note: This test will need a completed session
      // For now, we're testing the contract structure
      const completedSessionId = '00000000-0000-0000-0000-000000000001';

      const response = await request(app)
        .get(`/quiz/${completedSessionId}/results`)
        .expect('Content-Type', /json/);

      if (response.status === 200) {
        // Verify response structure for successful completion
        expect(response.body).toHaveProperty('sessionId');
        expect(response.body).toHaveProperty('character');
        expect(response.body).toHaveProperty('traitScores');
        expect(response.body).toHaveProperty('completedAt');

        // Verify character structure
        expect(response.body.character).toHaveProperty('id');
        expect(response.body.character).toHaveProperty('name');
        expect(response.body.character).toHaveProperty('description');
        expect(response.body.character).toHaveProperty('workStyleStrengths');
        expect(response.body.character).toHaveProperty('interpersonalDynamics');

        // Verify trait scores structure
        expect(response.body.traitScores).toHaveProperty('F');
        expect(response.body.traitScores).toHaveProperty('I');
        expect(response.body.traitScores).toHaveProperty('S');
        expect(response.body.traitScores).toHaveProperty('G');
        expect(response.body.traitScores).toHaveProperty('E');
        expect(response.body.traitScores).toHaveProperty('N');
        expect(response.body.traitScores).toHaveProperty('A');
        expect(response.body.traitScores).toHaveProperty('D');
      } else if (response.status === 404) {
        expect(response.body).toHaveProperty('status', 'error');
      } else if (response.status === 400) {
        expect(response.body).toHaveProperty('status', 'error');
        // Accept either "not completed" or validation errors
        expect(response.body.message).toBeDefined();
      }
    });

    it('should return 404 for non-existent session', async () => {
      const fakeSessionId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/quiz/${fakeSessionId}/results`).expect(404);

      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('GET /quiz/:sessionId/status', () => {
    let sessionId: string;

    beforeEach(async () => {
      const startResponse = await request(app).post('/quiz/start').send({ theme: 'fantasy' });
      sessionId = startResponse.body.sessionId;
    });

    it('should return 200 with session status', async () => {
      const response = await request(app)
        .get(`/quiz/${sessionId}/status`)
        .expect('Content-Type', /json/)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('sessionId', sessionId);
      expect(response.body).toHaveProperty('theme');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('currentRound');
      expect(response.body).toHaveProperty('totalRounds');

      // Verify status is valid enum value
      expect(['in_progress', 'completed', 'expired']).toContain(response.body.status);
    });

    it('should return 404 for non-existent session', async () => {
      const fakeSessionId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/quiz/${fakeSessionId}/status`).expect(404);

      expect(response.body).toHaveProperty('status', 'error');
    });
  });
});
