# Research: AI-Driven Interactive Personality Quiz

**Date**: 2025-10-19  
**Feature**: AI-Driven Interactive Personality Quiz  
**Purpose**: Document technology decisions, best practices research, and rationale for implementation choices

## Executive Summary

This research document consolidates decisions for building a fantasy-themed personality quiz web application that uses AI for dynamic story generation and trait analysis. Key decisions include React + Node.js stack, OpenAI for AI capabilities, PostgreSQL + Redis for data management, and a modular architecture enabling test-first development.

---

## Technology Stack Decisions

### Decision 1: Frontend Framework - React with TypeScript

**Decision**: Use React 18.2+ with TypeScript 5.3+ for the frontend

**Rationale**:

- **Component-based architecture**: Quiz flow (start → story phases → results) maps naturally to React components
- **State management needs**: Dynamic quiz progression requires robust state handling (solved with Zustand)
- **TypeScript safety**: Shared types between frontend/backend reduce bugs in API contracts
- **Rich ecosystem**: Extensive libraries for forms, animations, and testing (React Testing Library, Vitest)
- **Mobile-responsive**: React + Tailwind CSS provides excellent responsive design capabilities

**Alternatives Considered**:

- **Vue.js**: Simpler learning curve but smaller ecosystem for complex state management
- **Next.js**: Server-side rendering not needed for this SPA; adds unnecessary complexity
- **Vanilla JavaScript**: Faster initial load but requires more boilerplate for state management and routing

**Best Practices**:

- Use functional components with hooks throughout
- Implement Error Boundaries for graceful error handling during AI failures
- Use React.lazy() for code splitting (results page, admin features)
- Implement optimistic UI updates while waiting for AI responses

---

### Decision 2: Backend Framework - Node.js + Express with TypeScript

**Decision**: Use Node.js 20 LTS with Express.js and TypeScript

**Rationale**:

- **JavaScript ecosystem alignment**: Shared language with frontend reduces context switching
- **Async I/O**: Excellent for handling concurrent AI API calls (6+ per session)
- **OpenAI SDK**: First-class JavaScript/TypeScript support from OpenAI
- **Lightweight**: Express provides just enough structure without over-engineering
- **Type safety**: TypeScript prevents common runtime errors in API contracts

**Alternatives Considered**:

- **Python + FastAPI**: Excellent for AI/ML but adds deployment complexity; Node.js SDK equally capable
- **Nest.js**: Over-engineered for this scope; Express provides sufficient structure
- **Serverless (AWS Lambda)**: Cold start latency (2-5s) unacceptable for 3-second generation requirement

**Best Practices**:

- Implement middleware chain: request validation → authentication (P2) → rate limiting → error handling
- Use Zod for runtime type validation matching TypeScript types
- Structure as services (AI, Session, TraitAnalysis) with clear interfaces
- Implement circuit breaker pattern for OpenAI API resilience

---

### Decision 3: AI Service - OpenAI (GPT-4 + DALL-E 3)

**Decision**: Use OpenAI GPT-4 for text generation and DALL-E 3 for image generation

**Rationale**:

- **Text generation (GPT-4)**:
  - Superior contextual understanding for story continuity
  - Excellent at extracting personality insights from free-form text
  - Structured output support (JSON mode) for trait scoring
  - 128k context window handles full conversation history
- **Image generation (DALL-E 3)**:
  - High-quality cartoony/illustration style matches "fantasy theme"
  - Natural language prompts easy to construct from story context
  - 1024x1024 resolution suitable for backgrounds
  - Built-in content policy reduces inappropriate imagery risk

**Alternatives Considered**:

- **Anthropic Claude**: Excellent reasoning but no integrated image generation
- **Google Gemini**: Multi-modal but less mature API, image quality inconsistent
- **Stable Diffusion (self-hosted)**: Requires GPU infrastructure, adds operational complexity
- **Pre-made images**: No personalization, requires extensive artist commissioning

**Cost Analysis** (per completed quiz session):

- 6 text generations (GPT-4): ~6,000 tokens @ $0.03/1k = $0.18
- 6 image generations (DALL-E 3): 6 images @ $0.04/image = $0.24
- **Total**: ~$0.42 per completed quiz

**Best Practices**:

- Implement prompt templates with structured outputs for consistency
- Use streaming for text generation to show progressive updates (UX enhancement)
- Cache generated images in CDN to reduce regeneration costs
- Implement fallback prompts if AI generation fails
- Set max_tokens limits to control costs

**API Integration Strategy**:

```typescript
// Structured prompt template
const storyPromptTemplate = {
	role: "system",
	content: `You are a fantasy storyteller creating an interactive personality quiz.
  Generate the next story phase based on the user's response. 
  The story should subtly reveal personality traits.`,
};

// Trait extraction with JSON mode
const traitExtractionTemplate = {
	role: "system",
	content: `Analyze the user's response and score on 8 dimensions (0-100):
  F (Focused), I (Independence), S (Sensing), G (Grounded),
  E (Exploratory), N (Network), A (Analytical), D (Driven).
  Return JSON: {"F": 75, "I": 60, ...}`,
};
```

---

### Decision 4: Database - PostgreSQL 15+ for Persistent Data

**Decision**: Use PostgreSQL 15+ for relational data storage

**Rationale**:

- **Relational model fits perfectly**: Character types, trait dimensions, quiz sessions, responses have clear relationships
- **JSONB support**: Trait scores (8 dimensions) stored as JSONB for flexible querying
- **ACID compliance**: Ensures saved results are never lost or corrupted
- **Mature ecosystem**: Excellent TypeScript client (pg), migration tools, and hosting options
- **Performance**: Handles 1000+ daily users easily with proper indexing

**Schema Design Preview**:

- `character_types`: Stores fantasy characters with trait profiles
- `trait_dimensions`: Defines the 8 F.I.S.G.E.N.A.D. dimensions
- `quiz_sessions`: Tracks active and completed sessions
- `user_responses`: Stores each round's response and extracted traits
- `saved_results`: Persistent saved results with unique links (P2)

**Alternatives Considered**:

- **MongoDB**: Flexible schema but personality framework is inherently relational
- **SQLite**: Insufficient for production concurrency requirements
- **MySQL**: PostgreSQL JSONB and full-text search capabilities superior

**Best Practices**:

- Use database migrations (e.g., node-pg-migrate) for version control
- Index on session_id, created_at for fast lookups
- Use JSONB for flexible trait score storage
- Implement connection pooling (pg-pool)

---

### Decision 5: Session Management - Redis 7+ for Active State

**Decision**: Use Redis 7+ for active quiz session state and caching

**Rationale**:

- **Fast read/write**: Session state updated every round (6 times per quiz)
- **Automatic expiration**: TTL (time-to-live) handles abandoned quizzes automatically
- **Simple data model**: Session state is key-value (sessionId → session data)
- **Caching layer**: Can cache character type data to reduce DB queries

**Session Data Structure**:

```typescript
interface SessionState {
  sessionId: string;
  currentRound: number;
  totalRounds: number;
  conversationHistory: Array<{role: string, content: string}>;
  accumulatedTraits: {F: number, I: number, ...};  // Running totals
  responses: Array<{round: number, text: string, traits: object}>;
  startedAt: number;
  lastActivityAt: number;
}
```

**TTL Strategy**:

- Active session: 30 minutes TTL (extends on each activity)
- Completed session: 1 hour TTL (time to view results)
- After completion: persist to PostgreSQL, remove from Redis

**Alternatives Considered**:

- **In-memory (Node.js)**: Lost on server restart, doesn't scale horizontally
- **PostgreSQL only**: Too slow for frequent session updates
- **LocalStorage only**: Unreliable, no server-side validation

**Best Practices**:

- Use Redis Sentinel or Cluster for production reliability
- Implement session recovery from PostgreSQL if Redis entry expired but quiz incomplete
- Compress large session data (conversation history)

---

## Integration Patterns

### Pattern 1: AI Generation with Fallback Strategy

**Challenge**: OpenAI API may timeout, rate limit, or fail

**Solution**: Multi-tier fallback strategy

```typescript
async function generateStoryPrompt(
	sessionId: string,
	userResponse: string
): Promise<string> {
	try {
		// Primary: GPT-4 with user context
		return await openai.generateContextualPrompt(sessionId, userResponse);
	} catch (error) {
		if (isRateLimitError(error)) {
			// Fallback 1: Use GPT-3.5 (faster, cheaper)
			return await openai.generatePrompt_GPT35(sessionId, userResponse);
		} else if (isTimeoutError(error)) {
			// Fallback 2: Pre-written dynamic prompts
			return getGenericPromptForRound(getCurrentRound(sessionId));
		} else {
			// Fallback 3: Error handling prompt
			throw new AIServiceError("Unable to generate story prompt");
		}
	}
}
```

**Best Practices**:

- Set aggressive timeouts (5 seconds for text, 10 seconds for images)
- Log all fallbacks for monitoring
- A/B test fallback quality vs primary

---

### Pattern 2: Progressive Trait Accumulation

**Challenge**: Extract consistent trait scores across 6 rounds

**Solution**: Weighted accumulation with normalization

```typescript
function accumulateTraits(
	currentTotal: TraitScores,
	newScores: TraitScores,
	round: number
): TraitScores {
	// Early rounds weighted more heavily (first impressions)
	const weight = round <= 2 ? 1.2 : 1.0;

	return Object.keys(currentTotal).reduce((acc, trait) => {
		acc[trait] = currentTotal[trait] + newScores[trait] * weight;
		return acc;
	}, {} as TraitScores);
}

function normalizeTraits(
	accumulated: TraitScores,
	roundCount: number
): TraitScores {
	// Normalize to 0-100 scale
	const totalWeight = calculateTotalWeight(roundCount);
	return Object.keys(accumulated).map((trait) => ({
		[trait]: Math.round((accumulated[trait] / totalWeight) * 100),
	}));
}
```

---

### Pattern 3: Character Matching Algorithm

**Challenge**: Map 8-dimensional trait profile to best-fit character

**Solution**: Euclidean distance in 8D trait space

```typescript
function findBestMatchingCharacter(
	userTraits: TraitScores,
	characterTypes: CharacterType[]
): CharacterType {
	return characterTypes.reduce(
		(best, character) => {
			const distance = calculateEuclideanDistance(
				userTraits,
				character.traitProfile
			);
			return distance < best.distance ? { character, distance } : best;
		},
		{ character: null, distance: Infinity }
	).character;
}

function calculateEuclideanDistance(
	traits1: TraitScores,
	traits2: TraitScores
): number {
	const dimensions = ["F", "I", "S", "G", "E", "N", "A", "D"];
	const sumSquares = dimensions.reduce((sum, dim) => {
		return sum + Math.pow(traits1[dim] - traits2[dim], 2);
	}, 0);
	return Math.sqrt(sumSquares);
}
```

**Alternatives Considered**:

- **Rule-based**: Too rigid, doesn't handle nuance
- **Cosine similarity**: Doesn't account for magnitude differences
- **ML clustering**: Over-engineered for predefined character types

---

## Testing Strategy

### Test-First Development Approach (Constitution Principle I)

**Contract Tests** (written FIRST, before implementation):

- Test each API endpoint with various inputs
- Verify response schemas match contracts
- Test error conditions (AI failures, invalid input)

**Integration Tests** (written FIRST):

- Test complete quiz flow from start to results
- Test AI service integration with mocked OpenAI responses
- Test session management with Redis

**E2E Tests**:

- Test user journey: start quiz → answer 6 rounds → view results
- Test edge cases: refresh mid-quiz, timeout scenarios
- Test across browsers (Chrome, Firefox, Safari)

**Mocking Strategy**:

```typescript
// Mock OpenAI responses for consistent testing
const mockOpenAI = {
	generateStoryPrompt: jest.fn().mockResolvedValue({
		prompt: "You enter a mystical forest...",
		imageUrl: "https://test.com/forest.png",
	}),
	extractTraits: jest.fn().mockResolvedValue({
		F: 75,
		I: 60,
		S: 80,
		G: 65,
		E: 70,
		N: 55,
		A: 85,
		D: 90,
	}),
};
```

---

## Performance Optimization

### Strategy 1: Parallel AI Calls

Generate story prompt and background image simultaneously:

```typescript
async function generateStoryPhase(userResponse: string): Promise<StoryPhase> {
	const [prompt, imageUrl] = await Promise.all([
		aiService.generatePrompt(userResponse),
		aiService.generateBackgroundImage(userResponse),
	]);
	return { prompt, imageUrl };
}
```

**Expected improvement**: 3-4 seconds (sequential) → 3 seconds (parallel)

---

### Strategy 2: Image CDN Caching

```typescript
// Cache generated images in CDN with quiz session context
const imageUrl = await generateImage(prompt);
await cdn.upload(imageUrl, {
	cacheControl: "public, max-age=2592000", // 30 days
	metadata: { sessionId, round },
});
```

**Cost savings**: ~70% reduction for repeat users or similar prompts

---

### Strategy 3: Database Query Optimization

```sql
-- Index for fast session lookups
CREATE INDEX idx_sessions_id ON quiz_sessions(session_id);
CREATE INDEX idx_sessions_created ON quiz_sessions(created_at DESC);

-- Index for character matching
CREATE INDEX idx_characters_active ON character_types(is_active) WHERE is_active = true;
```

---

## Security Considerations

### Input Validation

```typescript
const userResponseSchema = z.object({
	response: z
		.string()
		.min(1, "Response cannot be empty")
		.max(500, "Response too long")
		.regex(/^[\w\s\.,!?'-]+$/, "Invalid characters detected"),
});
```

### Rate Limiting

```typescript
// Prevent abuse: max 10 quiz sessions per IP per hour
const rateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 10,
	message: "Too many quiz attempts, please try again later",
});
```

### API Key Security

- Store OpenAI API key in environment variables
- Never expose in frontend code
- Rotate keys regularly
- Monitor usage for anomalies

---

## Deployment Considerations

### Development Environment

- Docker Compose with PostgreSQL, Redis, backend, and frontend containers
- Hot reload for both frontend and backend
- Mock OpenAI responses for cost-free testing

### Production Environment

- **Frontend**: Vercel or Netlify (static deployment with CDN)
- **Backend**: Railway, Render, or AWS ECS (containerized)
- **Database**: Managed PostgreSQL (Railway, Supabase, or AWS RDS)
- **Redis**: Managed Redis (Upstash, Redis Cloud, or AWS ElastiCache)
- **Monitoring**: Sentry for error tracking, LogRocket for session replay

### Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
OPENAI_API_KEY=sk-...
NODE_ENV=production
PORT=3000

# Frontend
VITE_API_BASE_URL=https://api.yourapp.com
VITE_APP_ENV=production
```

---

## Configuration Management

### Configurable Quiz Parameters

```typescript
// config/quiz.config.ts
export const quizConfig = {
	rounds: process.env.QUIZ_ROUNDS || 6, // Configurable round count
	themes: {
		fantasy: {
			name: "Fantasy Adventure",
			initialPrompt: "You wake up in a mystical realm...",
			imageStyle: "fantasy art, cartoony, colorful",
		},
		// Future themes added here (P3)
	},
	ai: {
		textModel: "gpt-4",
		imageModel: "dall-e-3",
		maxTokens: 500,
		temperature: 0.7, // Creativity level
	},
	session: {
		ttlMinutes: 30,
		maxResponseLength: 500,
	},
};
```

---

## Risk Mitigation

| Risk                               | Impact | Mitigation                                                          |
| ---------------------------------- | ------ | ------------------------------------------------------------------- |
| OpenAI API cost overruns           | High   | Implement rate limiting, monitor usage, set budget alerts           |
| AI generation latency              | Medium | Parallel API calls, implement fallbacks, optimize prompts           |
| User drop-off during AI wait       | Medium | Show engaging loading animations, progressive text streaming        |
| Inappropriate AI-generated content | Low    | OpenAI content filters, user reporting, manual review queue         |
| Redis data loss                    | Medium | Persist sessions to PostgreSQL after each round, implement recovery |

---

## Next Steps

1. ✅ Technology stack decisions finalized
2. ➡️ **Phase 1**: Create data model (data-model.md)
3. ➡️ **Phase 1**: Define API contracts (contracts/api-endpoints.yaml)
4. ➡️ **Phase 1**: Create quickstart guide (quickstart.md)
5. ➡️ **Phase 2**: Generate task breakdown (tasks.md via `/speckit.tasks`)

---

## References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Best Practices](https://react.dev/learn)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [F.I.S.G.E.N.A.D. Framework](https://www.whatcakeru.com/) (inspiration source)
