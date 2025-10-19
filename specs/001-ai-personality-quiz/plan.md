# Implementation Plan: AI-Driven Interactive Personality Quiz

**Branch**: `001-ai-personality-quiz` | **Date**: 2025-10-19 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-ai-personality-quiz/spec.md`

## Summary

Build a fantasy-themed web application where users take an interactive personality quiz by typing free-form answers to AI-generated story prompts. The system uses the F.I.S.G.E.N.A.D. 8-dimension personality framework (inspired by "What Cake R U?" test) to analyze responses and assign users a fantasy character type (dragon, elf, wizard, etc.) with work style strengths and interpersonal dynamics. Each story phase includes AI-generated cartoony background images for enhanced engagement.

**Core Technical Approach**: Modern web application (React frontend + Node.js backend) with OpenAI integration for text generation (GPT-4) and image generation (DALL-E 3), Redis for session management, and PostgreSQL for persistent data storage.

## Technical Context

**Language/Version**:

- Frontend: TypeScript 5.3+ with React 18.2+
- Backend: Node.js 20 LTS with TypeScript 5.3+

**Primary Dependencies**:

- Frontend: React, React Router, Tailwind CSS, Axios, Zustand (state management)
- Backend: Express.js, OpenAI SDK, PostgreSQL client (pg), Redis client, Zod (validation)

**Storage**:

- PostgreSQL 15+ for persistent data (quiz sessions, results, character types, trait dimensions)
- Redis 7+ for active session state and caching

**Testing**:

- Frontend: Vitest + React Testing Library
- Backend: Jest + Supertest
- E2E: Playwright

**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - last 2 years), mobile-responsive

**Project Type**: Web application (frontend + backend)

**Performance Goals**:

- AI story generation: <3 seconds per response
- AI image generation: <5 seconds per image
- Page load: <2 seconds
- Handle 100 concurrent quiz sessions

**Constraints**:

- OpenAI API rate limits and costs per user session
- Image generation latency may impact user experience
- Session state must persist across page refreshes during active quiz

**Scale/Scope**:

- MVP supports single fantasy theme
- 6 configurable quiz rounds
- 8-12 predefined fantasy character types
- Support 1000+ daily active users
- ~50 OpenAI API calls per completed quiz (6 text + 6 image generations)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with constitution principles (`.specify/memory/constitution.md`):

- [x] **I. Test-First Development**: Test strategy defined (contract tests for APIs, integration tests for AI workflows, E2E tests for user flows)
- [x] **II. User-Centric Design**: User stories prioritized (P1: MVP quiz, P2: Save/Share, P3: Multi-theme), independently testable with clear acceptance criteria
- [x] **III. Modular Architecture**: Clear module boundaries planned (frontend SPA, backend API, AI service layer, session service, data layer)
- [x] **IV. Documentation Standards**: Spec complete, plan in progress, API contracts will be defined in Phase 1, quickstart guide will be created
- [x] **V. Simplicity**: Standard web stack chosen (React + Node + PostgreSQL), complexity introduced only where necessary (AI integration, session management)

### Complexity Justification (if needed)

| Complexity Item           | Justification                                                                                                                        | Simpler Alternative Rejected                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| AI Integration (OpenAI)   | Core feature requirement - dynamic story generation and trait analysis cannot be achieved with static content or rules-based systems | Pre-written branching story paths would not provide personalized, contextual responses and would require massive content creation effort |
| Redis for Session State   | Active quiz sessions need fast read/write access and automatic expiration; session data is frequently updated during quiz            | Storing session state in PostgreSQL would create unnecessary DB load and complicate session expiration logic                             |
| Separate Frontend/Backend | Frontend needs to handle dynamic UI updates while backend manages AI API calls, session orchestration, and data persistence          | Single-server rendering would block UI during long AI operations (3-5 seconds) creating poor UX                                          |

## Project Structure

### Documentation (this feature)

```
specs/001-ai-personality-quiz/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api-endpoints.yaml
│   └── ai-prompts.md
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── spec.md              # Feature specification
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── models/
│   │   ├── CharacterType.ts      # Character type entity
│   │   ├── TraitDimension.ts     # Trait dimension entity
│   │   ├── QuizSession.ts        # Quiz session entity
│   │   ├── UserResponse.ts       # User response entity
│   │   └── SavedResult.ts        # Saved result entity (P2)
│   ├── services/
│   │   ├── AIService.ts          # OpenAI integration (text + image)
│   │   ├── SessionService.ts     # Session management (Redis)
│   │   ├── TraitAnalysisService.ts  # Trait extraction from responses
│   │   ├── CharacterMatchingService.ts  # Match traits to characters
│   │   └── QuizOrchestrator.ts   # Main quiz flow orchestration
│   ├── api/
│   │   ├── routes/
│   │   │   ├── quiz.ts           # Quiz endpoints
│   │   │   ├── results.ts        # Results endpoints (P2)
│   │   │   └── admin.ts          # Character/trait admin (P2)
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   └── rateLimit.ts
│   │   └── schemas/
│   │       └── quiz.schema.ts    # Zod validation schemas
│   ├── db/
│   │   ├── connection.ts         # PostgreSQL connection
│   │   ├── migrations/           # Database migrations
│   │   └── seeds/                # Seed data (character types, dimensions)
│   ├── config/
│   │   └── index.ts              # Environment config
│   └── server.ts                 # Express app entry point
└── tests/
    ├── contract/
    │   ├── quiz-api.test.ts
    │   └── results-api.test.ts
    ├── integration/
    │   ├── quiz-flow.test.ts
    │   ├── ai-integration.test.ts
    │   └── session-management.test.ts
    └── unit/
        ├── TraitAnalysisService.test.ts
        └── CharacterMatchingService.test.ts

frontend/
├── src/
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── QuizStart.tsx     # Landing/start page
│   │   │   ├── StoryPrompt.tsx   # Story phase with input
│   │   │   ├── BackgroundImage.tsx  # Dynamic background display
│   │   │   └── LoadingState.tsx  # AI generation loading
│   │   ├── results/
│   │   │   ├── CharacterReveal.tsx  # Character type display
│   │   │   ├── TraitScores.tsx   # 8-dimension scores visualization
│   │   │   ├── PersonalityDescription.tsx
│   │   │   └── ShareButtons.tsx  # Social sharing (P2)
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── TextInput.tsx
│   │       └── ErrorBoundary.tsx
│   ├── pages/
│   │   ├── HomePage.tsx          # Quiz entry point
│   │   ├── QuizPage.tsx          # Active quiz page
│   │   ├── ResultsPage.tsx       # Results display
│   │   └── SavedResultPage.tsx   # Saved result view (P2)
│   ├── services/
│   │   ├── quizApi.ts            # Backend API client
│   │   └── analytics.ts          # User behavior tracking (optional)
│   ├── stores/
│   │   ├── quizStore.ts          # Quiz state (Zustand)
│   │   └── resultsStore.ts       # Results state
│   ├── hooks/
│   │   ├── useQuizSession.ts     # Quiz session management
│   │   └── useAIGeneration.ts    # AI generation state
│   ├── types/
│   │   └── quiz.types.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── validation.ts
│   │   └── formatting.ts
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
└── tests/
    ├── integration/
    │   └── quiz-flow.test.tsx
    └── e2e/
        ├── complete-quiz.spec.ts
        └── results-display.spec.ts

shared/
└── types/
    ├── quiz.ts                   # Shared type definitions
    ├── character.ts
    └── trait.ts
```

**Structure Decision**: Selected Option 2 (Web application) with frontend and backend separation. This structure supports:

- Independent development and deployment of frontend/backend
- Frontend handles responsive UI and real-time state updates
- Backend manages AI orchestration, session state, and data persistence
- Shared types ensure consistency across the stack
- Clear separation enables parallel team development

## Complexity Tracking

_Constitution Check passed - no violations. Complexity items justified above._

| Complexity Item         | Why Needed                                                                       | Simpler Alternative Rejected Because                                                        |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| AI Integration (OpenAI) | Dynamic, contextual story generation and trait analysis required by core feature | Static branching stories lack personalization and require extensive manual content creation |
| Redis Session State     | Fast session management with automatic expiration for active quizzes             | PostgreSQL-only approach adds unnecessary DB load for ephemeral session data                |
| Frontend/Backend Split  | Non-blocking UI during long AI operations, independent scaling                   | Monolithic approach would block UI during 3-5 second AI generation                          |

---

## Phase 0: Research & Technology Decisions ✅ COMPLETE

**Objective**: Resolve all technical unknowns and document technology choices with rationale

**Artifacts Generated**:

- ✅ `research.md` - Comprehensive technology research document

**Key Decisions**:

1. **Frontend**: React 18+ with TypeScript, Tailwind CSS, Zustand state management
2. **Backend**: Node.js 20 LTS with Express, TypeScript
3. **AI Services**: OpenAI GPT-4 (text) + DALL-E 3 (images)
4. **Storage**: PostgreSQL 15+ (persistent) + Redis 7+ (sessions/cache)
5. **Testing**: Vitest (frontend), Jest (backend), Playwright (E2E)

**Research Highlights**:

- AI cost analysis: ~$0.70 per completed quiz session
- Performance optimization: Parallel AI calls (3-5 second total latency)
- Fallback strategies for AI failures documented
- Security and rate limiting approaches defined

**Status**: All technical unknowns resolved. Ready for Phase 1 design.

---

## Phase 1: Design & Contracts ✅ COMPLETE

**Objective**: Define data models, API contracts, and AI integration specifications

**Artifacts Generated**:

- ✅ `data-model.md` - Complete entity relationship model with schemas
- ✅ `contracts/api-endpoints.yaml` - OpenAPI 3.0 specification (8 endpoints)
- ✅ `contracts/ai-prompts.md` - AI prompt templates and configurations
- ✅ `quickstart.md` - Developer onboarding and setup guide
- ✅ `.cursor/rules/specify-rules.mdc` - Agent context file updated

**Data Model Summary**:

- 5 core entities defined with full PostgreSQL schemas
- 8 trait dimensions (F.I.S.G.E.N.A.D. framework)
- 12 fantasy character types (seed data planned)
- Session state management (Redis + PostgreSQL)
- Data retention and privacy policies documented

**API Contracts**:

- **MVP (P1)**: 5 endpoints (start, respond, results, status, health)
- **P2 Features**: 3 endpoints (save, share, admin)
- Request/response schemas fully defined
- Error handling documented
- Rate limiting specified

**AI Integration**:

- GPT-4 prompts for story generation and trait extraction
- DALL-E 3 prompts for background image generation
- Mock responses for testing defined
- Cost optimization strategies documented

**Status**: All design artifacts complete. Ready for Phase 2 task breakdown.

---

## Constitution Re-Check (Post Phase 1) ✅

Verifying compliance after design phase:

- [x] **I. Test-First Development**: Contract tests specified in quickstart.md, mock AI responses defined for testing
- [x] **II. User-Centric Design**: All 3 user stories (P1, P2, P3) mapped to specific features and endpoints
- [x] **III. Modular Architecture**: Clear service boundaries (AIService, SessionService, TraitAnalysisService, CharacterMatchingService), frontend/backend separation
- [x] **IV. Documentation Standards**: Spec, plan, data model, API contracts, AI prompts, and quickstart all complete
- [x] **V. Simplicity**: Standard web stack maintained, complexity justified and documented

**Complexity Items Justified**:

1. AI Integration: Core requirement, no simpler alternative
2. Redis for sessions: Performance requirement, justified
3. Frontend/Backend split: UX requirement (non-blocking), justified

**Gate Status**: ✅ PASSED - All constitution principles upheld

---

## Summary & Next Steps

### What We've Built (Planning Phase)

**Specification** (Phase -1):

- Complete feature spec with 3 prioritized user stories
- 23 functional requirements
- 9 success criteria
- Edge cases and assumptions documented

**Research** (Phase 0):

- Technology stack selected and justified
- 5 major technology decisions documented
- Integration patterns defined
- Testing strategy established
- Performance optimization approaches planned

**Design** (Phase 1):

- 5 entities with complete database schemas
- 8 RESTful API endpoints specified
- AI prompt templates for 4 interaction types
- Development environment setup documented
- Test-first development approach outlined

### Statistics

- **Documentation**: 5 major documents, 3 contract specifications
- **API Endpoints**: 8 total (5 MVP, 3 P2)
- **Data Entities**: 5 (TraitDimension, CharacterType, QuizSession, UserResponse, SavedResult)
- **Technologies**: 12+ (React, Node.js, TypeScript, PostgreSQL, Redis, OpenAI, etc.)
- **Estimated Cost**: $0.70 per quiz completion
- **Target Performance**: <3s AI response, <5s total interaction time

### Ready for Implementation

✅ **Phase 0 Complete**: All technical decisions made  
✅ **Phase 1 Complete**: Full design and contracts defined  
⏭️ **Phase 2 Ready**: Run `/speckit.tasks` to generate task breakdown

### Implementation Readiness Checklist

- [x] Feature specification complete and validated
- [x] Technology stack selected
- [x] Data model designed with schemas
- [x] API contracts specified (OpenAPI format)
- [x] AI integration fully documented
- [x] Development environment documented
- [x] Test-first approach defined
- [x] Constitution compliance verified
- [x] Mock responses for testing created

### Cost & Timeline Estimates

**Development Effort** (rough estimates):

- Backend implementation: 40-50 hours
- Frontend implementation: 30-40 hours
- Testing (contract + integration): 20-25 hours
- DevOps & deployment: 10-15 hours
- **Total**: 100-130 hours (~3-4 weeks for 1 developer)

**Ongoing Costs** (monthly, at scale):

- OpenAI API: $2,100/month (100 quizzes/day) to $10,500/month (500/day)
- Infrastructure: $50-200/month (hosting, database, Redis)
- **Total**: $2,150-$10,700/month depending on usage

### Next Command

```bash
/speckit.tasks
```

This will generate the detailed task breakdown organized by user story, enabling test-first development and incremental delivery.

---

## Artifacts Index

All planning artifacts for feature `001-ai-personality-quiz`:

| Document                       | Purpose                         | Status      |
| ------------------------------ | ------------------------------- | ----------- |
| `spec.md`                      | Feature specification           | ✅ Complete |
| `plan.md`                      | This file - implementation plan | ✅ Complete |
| `research.md`                  | Technology research & decisions | ✅ Complete |
| `data-model.md`                | Entity schemas & relationships  | ✅ Complete |
| `contracts/api-endpoints.yaml` | REST API specification          | ✅ Complete |
| `contracts/ai-prompts.md`      | AI integration contracts        | ✅ Complete |
| `quickstart.md`                | Developer setup guide           | ✅ Complete |
| `tasks.md`                     | Task breakdown (Phase 2)        | ⏳ Pending  |
| `checklists/requirements.md`   | Spec quality validation         | ✅ Complete |

---

**Plan Status**: ✅ COMPLETE  
**Branch**: `001-ai-personality-quiz`  
**Date Completed**: 2025-10-19  
**Constitution Compliance**: ✅ VERIFIED

Ready for task breakdown and implementation! 🚀
