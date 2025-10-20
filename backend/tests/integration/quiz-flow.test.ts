/**
 * Integration test for complete quiz flow
 * Tests the full user journey: start → 6 rounds → results
 *
 * Following TDD: This test MUST FAIL initially before implementation.
 */

import request from 'supertest';
import app from '../../src/server';

describe('Complete Quiz Flow Integration Test', () => {
  it('should allow a user to complete full 6-round quiz and receive results', async () => {
    // Step 1: Start the quiz
    const startResponse = await request(app)
      .post('/quiz/start')
      .send({ theme: 'fantasy' })
      .expect(201);

    const { sessionId, totalRounds, initialPrompt } = startResponse.body;
    expect(sessionId).toBeDefined();
    expect(totalRounds).toBe(6);
    expect(initialPrompt).toBeDefined();

    console.log('Quiz started:', { sessionId, totalRounds });

    // Step 2: Go through all rounds
    for (let round = 1; round <= totalRounds; round++) {
      const answer = `This is my answer for round ${round}. I make a thoughtful choice that reflects my personality.`;

      const respondResponse = await request(app)
        .post(`/quiz/${sessionId}/respond`)
        .send({ answer })
        .expect(200);

      expect(respondResponse.body.sessionId).toBe(sessionId);
      expect(respondResponse.body.currentRound).toBe(round + 1);
      expect(respondResponse.body.totalRounds).toBe(totalRounds);

      if (round < totalRounds) {
        // Not complete yet - should have next prompt
        expect(respondResponse.body.isComplete).toBe(false);
        expect(respondResponse.body.nextPrompt).toBeDefined();
        expect(typeof respondResponse.body.nextPrompt).toBe('string');
        console.log(`Round ${round} complete, next prompt received`);
      } else {
        // Last round - quiz should be complete
        expect(respondResponse.body.isComplete).toBe(true);
        expect(respondResponse.body.nextPrompt).toBeUndefined();
        console.log('Quiz completed!');
      }
    }

    // Step 3: Check status
    const statusResponse = await request(app).get(`/quiz/${sessionId}/status`).expect(200);

    expect(statusResponse.body.status).toBe('completed');
    expect(statusResponse.body.currentRound).toBe(totalRounds + 1);

    // Step 4: Get results
    const resultsResponse = await request(app).get(`/quiz/${sessionId}/results`).expect(200);

    // Verify character assignment
    expect(resultsResponse.body.character).toBeDefined();
    expect(resultsResponse.body.character.id).toBeDefined();
    expect(resultsResponse.body.character.name).toBeDefined();
    expect(resultsResponse.body.character.description).toBeDefined();
    expect(resultsResponse.body.character.workStyleStrengths).toBeDefined();
    expect(resultsResponse.body.character.interpersonalDynamics).toBeDefined();

    // Verify trait scores
    expect(resultsResponse.body.traitScores).toBeDefined();
    const traits = ['F', 'I', 'S', 'G', 'E', 'N', 'A', 'D'];
    traits.forEach((trait) => {
      expect(resultsResponse.body.traitScores[trait]).toBeGreaterThanOrEqual(0);
      expect(resultsResponse.body.traitScores[trait]).toBeLessThanOrEqual(100);
    });

    console.log('Character assigned:', resultsResponse.body.character.name);
    console.log('Trait scores:', resultsResponse.body.traitScores);
  }, 60000); // 60 second timeout for AI calls

  it('should not allow responding after quiz is completed', async () => {
    // Start and complete a quiz
    const startResponse = await request(app)
      .post('/quiz/start')
      .send({ theme: 'fantasy' })
      .expect(201);

    const { sessionId, totalRounds } = startResponse.body;

    // Complete all rounds
    for (let round = 1; round <= totalRounds; round++) {
      await request(app)
        .post(`/quiz/${sessionId}/respond`)
        .send({ answer: 'Test answer' })
        .expect(200);
    }

    // Try to respond again after completion
    const extraResponse = await request(app)
      .post(`/quiz/${sessionId}/respond`)
      .send({ answer: 'Extra answer' })
      .expect(400);

    expect(extraResponse.body.status).toBe('error');
    expect(extraResponse.body.message).toContain('completed');
  }, 60000);

  it('should handle multiple concurrent quiz sessions independently', async () => {
    // Start two sessions
    const session1 = await request(app).post('/quiz/start').send({ theme: 'fantasy' }).expect(201);

    const session2 = await request(app).post('/quiz/start').send({ theme: 'fantasy' }).expect(201);

    expect(session1.body.sessionId).not.toBe(session2.body.sessionId);

    // Respond to first session
    await request(app)
      .post(`/quiz/${session1.body.sessionId}/respond`)
      .send({ answer: 'Answer for session 1' })
      .expect(200);

    // Respond to second session with different answer
    await request(app)
      .post(`/quiz/${session2.body.sessionId}/respond`)
      .send({ answer: 'Answer for session 2' })
      .expect(200);

    // Verify both sessions have independent state
    const status1 = await request(app).get(`/quiz/${session1.body.sessionId}/status`).expect(200);

    const status2 = await request(app).get(`/quiz/${session2.body.sessionId}/status`).expect(200);

    expect(status1.body.currentRound).toBe(2);
    expect(status2.body.currentRound).toBe(2);
    expect(status1.body.sessionId).not.toBe(status2.body.sessionId);
  }, 60000);
});

