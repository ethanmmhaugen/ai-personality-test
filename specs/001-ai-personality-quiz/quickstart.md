# Quickstart Guide: AI Personality Quiz

**Date**: 2025-10-19  
**Feature**: AI-Driven Interactive Personality Quiz  
**Purpose**: Get developers up and running quickly with local development environment

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v20.x LTS ([Download](https://nodejs.org/))
- **Docker Desktop**: Latest version ([Download](https://www.docker.com/products/docker-desktop/))
- **Git**: Latest version
- **OpenAI API Key**: Sign up at [platform.openai.com](https://platform.openai.com/)
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

**System Requirements**:

- 8GB RAM minimum (16GB recommended)
- 10GB free disk space
- Windows 10/11, macOS 11+, or Linux

---

## Quick Setup (5 minutes)

### Step 1: Clone and Install

```bash
# Clone repository
git clone https://github.com/your-org/personality-ai.git
cd personality-ai/project

# Checkout feature branch
git checkout 001-ai-personality-quiz

# Install dependencies for both frontend and backend
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Environment Setup

Create environment files:

**Backend** (`.env` in `backend/` directory):

```bash
# Copy template
cp backend/.env.example backend/.env

# Edit backend/.env with your values:
# DATABASE_URL=postgresql://quiz:quiz@localhost:5432/personality_quiz
# REDIS_URL=redis://localhost:6379
# OPENAI_API_KEY=sk-your-actual-api-key-here
# NODE_ENV=development
# PORT=3000
# QUIZ_ROUNDS=6
```

**Frontend** (`.env` in `frontend/` directory):

```bash
# Copy template
cp frontend/.env.example frontend/.env

# Edit frontend/.env:
# VITE_API_BASE_URL=http://localhost:3000/api/v1
# VITE_APP_ENV=development
```

### Step 3: Start Services with Docker

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait for services to be ready (5-10 seconds)
docker-compose ps
```

### Step 4: Initialize Database

```bash
# Run migrations and seed data
cd backend
npm run db:migrate
npm run db:seed

# Verify setup
npm run db:verify
```

### Step 5: Start Development Servers

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
```

### Step 6: Verify Installation

Open your browser to:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

You should see the quiz start page! 🎉

---

## Development Workflow

### Constitution Reminder: Test-First Development

Per our project constitution (Principle I), **write tests BEFORE implementation**:

1. Write contract tests for API endpoints
2. Write integration tests for workflows
3. Run tests (they should FAIL - red phase)
4. Implement functionality
5. Run tests (they should PASS - green phase)
6. Refactor while keeping tests passing

### Project Structure Overview

```
project/
├── backend/               # Node.js + Express backend
│   ├── src/
│   │   ├── models/       # Data entities
│   │   ├── services/     # Business logic
│   │   ├── api/          # Express routes & middleware
│   │   └── db/           # Database migrations & seeds
│   └── tests/            # Backend tests
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API client
│   │   └── stores/       # Zustand state management
│   └── tests/            # Frontend tests
├── shared/               # Shared TypeScript types
└── specs/                # Feature specifications
```

### Common Development Tasks

#### Run Tests

```bash
# Backend tests
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:contract      # Contract tests only
npm run test:integration   # Integration tests only

# Frontend tests
cd frontend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:e2e          # End-to-end tests (requires running servers)
```

#### Database Operations

```bash
cd backend

# Create new migration
npm run db:migration:create add_user_accounts

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:down

# Reseed database
npm run db:seed

# Reset database (danger!)
npm run db:reset
```

#### Linting & Formatting

```bash
# Backend
cd backend
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format with Prettier

# Frontend
cd frontend
npm run lint
npm run lint:fix
npm run format
```

#### Type Checking

```bash
# Backend
cd backend
npm run typecheck

# Frontend
cd frontend
npm run typecheck
```

---

## Testing Guide

### Writing Contract Tests (API Endpoints)

Example: Test the `/quiz/start` endpoint

```typescript
// backend/tests/contract/quiz-api.test.ts

import request from "supertest";
import app from "../../src/server";

describe("POST /api/v1/quiz/start", () => {
	it("should create a new quiz session", async () => {
		const response = await request(app)
			.post("/api/v1/quiz/start")
			.send({ themeId: "fantasy", rounds: 6 })
			.expect(201);

		expect(response.body).toMatchObject({
			sessionId: expect.any(String),
			currentRound: 1,
			totalRounds: 6,
			prompt: {
				text: expect.any(String),
				backgroundImageUrl: expect.any(String),
			},
		});
	});

	it("should reject invalid round counts", async () => {
		await request(app)
			.post("/api/v1/quiz/start")
			.send({ rounds: 20 }) // Too many rounds
			.expect(400);
	});
});
```

### Writing Integration Tests (Full Workflows)

Example: Test complete quiz flow

```typescript
// backend/tests/integration/quiz-flow.test.ts

describe("Complete Quiz Flow", () => {
	let sessionId: string;

	it("should complete full quiz workflow", async () => {
		// 1. Start quiz
		const startResponse = await startQuiz();
		sessionId = startResponse.body.sessionId;

		// 2. Answer 6 rounds
		for (let round = 1; round <= 6; round++) {
			const response = await submitResponse(
				sessionId,
				`Test response for round ${round}`
			);

			if (round < 6) {
				expect(response.body.isComplete).toBe(false);
				expect(response.body.prompt).toBeDefined();
			} else {
				expect(response.body.isComplete).toBe(true);
			}
		}

		// 3. Get results
		const results = await getResults(sessionId);
		expect(results.body).toMatchObject({
			character: expect.objectContaining({
				name: expect.any(String),
				slug: expect.any(String),
			}),
			finalTraits: expect.objectContaining({
				F: expect.any(Number),
				I: expect.any(Number),
				// ... all 8 dimensions
			}),
		});
	});
});
```

### Mocking OpenAI for Tests

```typescript
// backend/tests/mocks/openai.mock.ts

import { jest } from "@jest/globals";

export const mockOpenAI = {
	chat: {
		completions: {
			create: jest.fn().mockResolvedValue({
				choices: [
					{
						message: {
							content: "You discover a hidden chamber...",
						},
					},
				],
			}),
		},
	},
	images: {
		generate: jest.fn().mockResolvedValue({
			data: [
				{
					url: "https://test.com/image.png",
				},
			],
		}),
	},
};

// Use in tests:
jest.mock("openai", () => ({
	OpenAI: jest.fn(() => mockOpenAI),
}));
```

---

## Debugging

### Backend Debugging

**VS Code Launch Configuration** (`.vscode/launch.json`):

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"type": "node",
			"request": "launch",
			"name": "Debug Backend",
			"skipFiles": ["<node_internals>/**"],
			"program": "${workspaceFolder}/backend/src/server.ts",
			"preLaunchTask": "tsc: build - backend/tsconfig.json",
			"outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
			"env": {
				"NODE_ENV": "development"
			}
		}
	]
}
```

**Logging**:

```typescript
// Use structured logging
import { logger } from "./utils/logger";

logger.info("Quiz session started", { sessionId, userId });
logger.error("AI generation failed", { error, sessionId });
logger.debug("Session state", { session });
```

### Frontend Debugging

**React DevTools**: Install browser extension for component inspection

**Redux DevTools**: View Zustand store state

**Console Logging**:

```typescript
// Conditional logging in development
if (import.meta.env.DEV) {
	console.log("Quiz state:", quizStore.getState());
}
```

### Database Debugging

```bash
# Connect to PostgreSQL
docker exec -it personality-quiz-postgres psql -U quiz -d personality_quiz

# Useful queries
SELECT * FROM quiz_sessions ORDER BY created_at DESC LIMIT 10;
SELECT * FROM character_types WHERE is_active = true;
SELECT * FROM user_responses WHERE session_id = 'your-session-id';
```

---

## Common Issues & Solutions

### Issue: "OpenAI API key invalid"

**Solution**:

1. Verify your API key in `backend/.env`
2. Check OpenAI account has credits
3. Ensure key starts with `sk-`

### Issue: "Database connection failed"

**Solution**:

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Issue: "Redis connection refused"

**Solution**:

```bash
# Check if Redis is running
docker-compose ps redis

# Restart Redis
docker-compose restart redis

# Test Redis connection
docker exec -it personality-quiz-redis redis-cli ping
# Should return: PONG
```

### Issue: "Port 3000 already in use"

**Solution**:

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change PORT in backend/.env
```

### Issue: "Tests failing with OpenAI errors"

**Solution**: Ensure OpenAI is mocked in tests

```typescript
// Add to test setup
jest.mock("openai");
```

---

## Performance Tips

### Optimize Development Experience

1. **Use `npm run dev` for hot reload**: Changes refresh automatically

2. **Run focused tests**: Don't run full test suite every time

   ```bash
   npm test -- quiz-api.test.ts  # Run specific file
   npm test -- --watch           # Watch mode
   ```

3. **Use Docker for services only**: Run Node apps natively for faster startup

4. **Enable caching**: Redis caches reduce repeated AI calls

### Optimize AI Costs During Development

```typescript
// backend/src/config/index.ts

export const config = {
	ai: {
		// Use GPT-3.5 in development (cheaper)
		textModel:
			process.env.NODE_ENV === "production" ? "gpt-4" : "gpt-3.5-turbo",

		// Disable image generation in tests
		generateImages: process.env.NODE_ENV !== "test",

		// Use mock responses when flag set
		useMockResponses: process.env.USE_MOCK_AI === "true",
	},
};
```

---

## Feature Development Checklist

When implementing a new feature:

- [ ] Read feature spec in `specs/001-ai-personality-quiz/spec.md`
- [ ] Review data model in `specs/001-ai-personality-quiz/data-model.md`
- [ ] Check API contracts in `specs/001-ai-personality-quiz/contracts/`
- [ ] **Write contract tests FIRST** (test-first principle)
- [ ] **Run tests to confirm they FAIL** (red phase)
- [ ] Implement feature
- [ ] **Run tests to confirm they PASS** (green phase)
- [ ] Refactor code while keeping tests passing
- [ ] Run linter and fix issues
- [ ] Update documentation if needed
- [ ] Create PR with tests included

---

## Deployment Checklist

Before deploying to production:

### Code Quality

- [ ] All tests passing (`npm test` in both frontend/backend)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript type checking passes (`npm run typecheck`)
- [ ] Code coverage > 70% for critical paths

### Configuration

- [ ] Environment variables set in production
- [ ] OpenAI API key configured and tested
- [ ] Database migrations run
- [ ] Character types seeded
- [ ] Redis connection verified

### Security

- [ ] API rate limiting enabled
- [ ] CORS configured correctly
- [ ] Input validation on all endpoints
- [ ] API keys not exposed in frontend
- [ ] HTTPS enabled

### Performance

- [ ] Image CDN configured
- [ ] Database indexes created
- [ ] Redis caching enabled
- [ ] Compression enabled
- [ ] Health check endpoint working

### Monitoring

- [ ] Error tracking configured (Sentry)
- [ ] Log aggregation set up
- [ ] OpenAI API usage monitoring
- [ ] Cost alerts configured
- [ ] Uptime monitoring enabled

---

## Next Steps

1. ✅ Development environment set up
2. ➡️ Review feature spec and data model
3. ➡️ Write first contract test for `/quiz/start`
4. ➡️ Implement quiz session creation
5. ➡️ Proceed with task breakdown (run `/speckit.tasks`)

---

## Getting Help

- **Documentation**: See `specs/001-ai-personality-quiz/` for detailed specs
- **Constitution**: Review `.specify/memory/constitution.md` for project principles
- **Issues**: Check GitHub issues or create a new one
- **Team Chat**: Ask in #personality-quiz-dev channel

---

## Useful Commands Reference

```bash
# Development
npm run dev                 # Start development server
npm test                    # Run tests
npm run lint                # Check code quality

# Database
npm run db:migrate          # Run migrations
npm run db:seed             # Seed data
npm run db:reset            # Reset database

# Docker
docker-compose up -d        # Start services
docker-compose down         # Stop services
docker-compose logs -f      # View logs

# Testing
npm run test:watch          # Watch mode
npm run test:contract       # Contract tests only
npm run test:e2e           # End-to-end tests

# Production
npm run build               # Build for production
npm start                   # Start production server
```

Happy coding! 🚀
