# Tasks: AI-Driven Interactive Personality Quiz

**Input**: Design documents from `/specs/001-ai-personality-quiz/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Per constitution Principle I (Test-First Development), tests MUST be written before implementation code. Test tasks are marked with ⚠️ to emphasize they must be completed and FAILING before proceeding with implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Backend tests: `backend/tests/`
- Frontend tests: `frontend/tests/`
- Shared types: `shared/types/`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize project structure and dependencies

- [ ] T001 Create project root structure (backend/, frontend/, shared/ directories)
- [ ] T002 [P] Initialize backend Node.js project with TypeScript, Express.js, Jest in backend/
- [ ] T003 [P] Initialize frontend React project with TypeScript, Vite, Vitest in frontend/
- [ ] T004 [P] Create shared types directory and TypeScript config in shared/
- [ ] T005 [P] Setup linting (ESLint) and formatting (Prettier) configs in backend/
- [ ] T006 [P] Setup linting (ESLint) and formatting (Prettier) configs in frontend/
- [ ] T007 Create Docker Compose configuration with PostgreSQL and Redis services in docker-compose.yml
- [ ] T008 Create environment variable templates in backend/.env.example and frontend/.env.example
- [ ] T009 [P] Setup Tailwind CSS configuration in frontend/tailwind.config.js
- [ ] T010 [P] Create .gitignore files for backend/, frontend/, and root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Infrastructure

- [ ] T011 Create database migration framework setup in backend/src/db/migrations/
- [ ] T012 Create database connection module in backend/src/db/connection.ts
- [ ] T013 Create migration: trait_dimensions table in backend/src/db/migrations/001_create_trait_dimensions.sql
- [ ] T014 Create migration: character_types table in backend/src/db/migrations/002_create_character_types.sql
- [ ] T015 Create migration: quiz_sessions table in backend/src/db/migrations/003_create_quiz_sessions.sql
- [ ] T016 Create migration: user_responses table in backend/src/db/migrations/004_create_user_responses.sql
- [ ] T017 Create seed data for 8 trait dimensions (F.I.S.G.E.N.A.D.) in backend/src/db/seeds/trait_dimensions.ts
- [ ] T018 Create seed data for 12 fantasy character types in backend/src/db/seeds/character_types.ts
- [ ] T019 [P] Create Redis connection and session utility in backend/src/db/redis.ts
- [ ] T020 [P] Create configuration module with environment variables in backend/src/config/index.ts

### Core Models & Types

- [ ] T021 [P] Create TraitDimension model interface in backend/src/models/TraitDimension.ts
- [ ] T022 [P] Create CharacterType model interface in backend/src/models/CharacterType.ts
- [ ] T023 [P] Create QuizSession model interface in backend/src/models/QuizSession.ts
- [ ] T024 [P] Create UserResponse model interface in backend/src/models/UserResponse.ts
- [ ] T025 [P] Create shared type definitions (TraitScores, SessionStatus) in shared/types/quiz.ts

### Middleware & Validation

- [ ] T026 [P] Create error handling middleware in backend/src/api/middleware/errorHandler.ts
- [ ] T027 [P] Create request validation middleware with Zod in backend/src/api/middleware/validation.ts
- [ ] T028 [P] Create rate limiting middleware in backend/src/api/middleware/rateLimit.ts
- [ ] T029 [P] Create Zod validation schemas for quiz endpoints in backend/src/api/schemas/quiz.schema.ts

### Express Server Setup

- [ ] T030 Create Express app initialization with middleware chain in backend/src/server.ts
- [ ] T031 Add CORS configuration and security headers in backend/src/server.ts
- [ ] T032 [P] Create health check endpoint in backend/src/api/routes/health.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete Interactive Personality Quiz (Priority: P1) 🎯 MVP

**Goal**: Users can take a complete personality quiz with AI-generated story and receive character results

**Independent Test**: User visits app, answers 6 rounds with free-form text, receives character assignment with trait breakdown

### Contract Tests for User Story 1 ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T033 [P] [US1] Contract test for POST /quiz/start endpoint in backend/tests/contract/quiz-api.test.ts
- [ ] T034 [P] [US1] Contract test for POST /quiz/{sessionId}/respond endpoint in backend/tests/contract/quiz-api.test.ts
- [ ] T035 [P] [US1] Contract test for GET /quiz/{sessionId}/results endpoint in backend/tests/contract/quiz-api.test.ts
- [ ] T036 [P] [US1] Contract test for GET /quiz/{sessionId}/status endpoint in backend/tests/contract/quiz-api.test.ts

### Integration Tests for User Story 1 ⚠️

- [ ] T037 [P] [US1] Integration test for complete quiz flow (start → 6 rounds → results) in backend/tests/integration/quiz-flow.test.ts
- [ ] T038 [P] [US1] Integration test for AI service with mocked OpenAI responses in backend/tests/integration/ai-integration.test.ts
- [ ] T039 [P] [US1] Integration test for session management with Redis in backend/tests/integration/session-management.test.ts

### Backend Services for User Story 1

- [ ] T040 [P] [US1] Create AIService with OpenAI client initialization in backend/src/services/AIService.ts
- [ ] T041 [US1] Implement story prompt generation method in AIService (backend/src/services/AIService.ts)
- [ ] T042 [US1] Implement trait extraction method in AIService (backend/src/services/AIService.ts)
- [ ] T043 [US1] Implement background image generation method in AIService (backend/src/services/AIService.ts)
- [ ] T044 [US1] Add AI service fallback strategies and error handling in backend/src/services/AIService.ts
- [ ] T045 [P] [US1] Create SessionService for Redis operations in backend/src/services/SessionService.ts
- [ ] T046 [US1] Implement session create, get, update, delete methods in SessionService (backend/src/services/SessionService.ts)
- [ ] T047 [P] [US1] Create TraitAnalysisService for trait accumulation logic in backend/src/services/TraitAnalysisService.ts
- [ ] T048 [US1] Implement trait score accumulation with weighted averaging in TraitAnalysisService (backend/src/services/TraitAnalysisService.ts)
- [ ] T049 [P] [US1] Create CharacterMatchingService with Euclidean distance algorithm in backend/src/services/CharacterMatchingService.ts
- [ ] T050 [US1] Implement character matching and assignment logic in CharacterMatchingService (backend/src/services/CharacterMatchingService.ts)
- [ ] T051 [P] [US1] Create QuizOrchestrator to coordinate quiz flow in backend/src/services/QuizOrchestrator.ts
- [ ] T052 [US1] Implement quiz start orchestration in QuizOrchestrator (backend/src/services/QuizOrchestrator.ts)
- [ ] T053 [US1] Implement response processing orchestration in QuizOrchestrator (backend/src/services/QuizOrchestrator.ts)
- [ ] T054 [US1] Implement quiz completion and character assignment in QuizOrchestrator (backend/src/services/QuizOrchestrator.ts)

### Backend API Routes for User Story 1

- [ ] T055 [P] [US1] Create POST /quiz/start endpoint in backend/src/api/routes/quiz.ts
- [ ] T056 [P] [US1] Create POST /quiz/{sessionId}/respond endpoint in backend/src/api/routes/quiz.ts
- [ ] T057 [P] [US1] Create GET /quiz/{sessionId}/results endpoint in backend/src/api/routes/quiz.ts
- [ ] T058 [P] [US1] Create GET /quiz/{sessionId}/status endpoint in backend/src/api/routes/quiz.ts
- [ ] T059 [US1] Wire up quiz routes to Express app in backend/src/server.ts
- [ ] T060 [US1] Add input validation to all quiz endpoints in backend/src/api/routes/quiz.ts

### Frontend Components for User Story 1

- [ ] T061 [P] [US1] Create quiz API client service in frontend/src/services/quizApi.ts
- [ ] T062 [P] [US1] Create quiz store with Zustand in frontend/src/stores/quizStore.ts
- [ ] T063 [P] [US1] Create results store with Zustand in frontend/src/stores/resultsStore.ts
- [ ] T064 [P] [US1] Create QuizStart component (landing page) in frontend/src/components/quiz/QuizStart.tsx
- [ ] T065 [P] [US1] Create StoryPrompt component (story display + input) in frontend/src/components/quiz/StoryPrompt.tsx
- [ ] T066 [P] [US1] Create BackgroundImage component in frontend/src/components/quiz/BackgroundImage.tsx
- [ ] T067 [P] [US1] Create LoadingState component for AI generation in frontend/src/components/quiz/LoadingState.tsx
- [ ] T068 [P] [US1] Create CharacterReveal component in frontend/src/components/results/CharacterReveal.tsx
- [ ] T069 [P] [US1] Create TraitScores component (8-dimension visualization) in frontend/src/components/results/TraitScores.tsx
- [ ] T070 [P] [US1] Create PersonalityDescription component in frontend/src/components/results/PersonalityDescription.tsx
- [ ] T071 [P] [US1] Create HomePage in frontend/src/pages/HomePage.tsx
- [ ] T072 [P] [US1] Create QuizPage in frontend/src/pages/QuizPage.tsx
- [ ] T073 [P] [US1] Create ResultsPage in frontend/src/pages/ResultsPage.tsx
- [ ] T074 [US1] Setup React Router with quiz routes in frontend/src/App.tsx
- [ ] T075 [US1] Implement quiz flow logic in QuizPage (start, respond, navigate) in frontend/src/pages/QuizPage.tsx
- [ ] T076 [US1] Implement results display logic in ResultsPage in frontend/src/pages/ResultsPage.tsx
- [ ] T077 [US1] Add "Take Quiz Again" functionality in ResultsPage in frontend/src/pages/ResultsPage.tsx

### End-to-End Tests for User Story 1

- [ ] T078 [US1] E2E test: Complete quiz flow with Playwright in frontend/tests/e2e/complete-quiz.spec.ts
- [ ] T079 [US1] E2E test: Results display validation in frontend/tests/e2e/results-display.spec.ts

### User Story 1 Final Tasks

- [ ] T080 [US1] Add error handling and retry logic for AI failures in backend/src/services/AIService.ts
- [ ] T081 [US1] Add session expiration and TTL handling in backend/src/services/SessionService.ts
- [ ] T082 [US1] Add loading states and error messages in frontend UI components
- [ ] T083 [US1] Verify all US1 contract tests pass
- [ ] T084 [US1] Verify all US1 integration tests pass
- [ ] T085 [US1] Verify US1 E2E tests pass

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. This is the MVP!

---

## Phase 4: User Story 2 - Save and Share Results (Priority: P2)

**Goal**: Users can save their results for later viewing and share on social media

**Independent Test**: Complete quiz, save results with email/link, share to social platforms or copy shareable link

### Contract Tests for User Story 2 ⚠️

- [ ] T086 [P] [US2] Contract test for POST /results/save endpoint in backend/tests/contract/results-api.test.ts
- [ ] T087 [P] [US2] Contract test for GET /results/{slug} endpoint in backend/tests/contract/results-api.test.ts

### Integration Tests for User Story 2 ⚠️

- [ ] T088 [US2] Integration test for save and retrieve results flow in backend/tests/integration/saved-results.test.ts

### Backend Implementation for User Story 2

- [ ] T089 [US2] Create migration: saved_results table in backend/src/db/migrations/005_create_saved_results.sql
- [ ] T090 [P] [US2] Create SavedResult model interface in backend/src/models/SavedResult.ts
- [ ] T091 [P] [US2] Create result slug generation utility in backend/src/utils/slugGenerator.ts
- [ ] T092 [P] [US2] Create SavedResultsService in backend/src/services/SavedResultsService.ts
- [ ] T093 [US2] Implement save result with unique slug generation in SavedResultsService (backend/src/services/SavedResultsService.ts)
- [ ] T094 [US2] Implement retrieve result by slug in SavedResultsService (backend/src/services/SavedResultsService.ts)
- [ ] T095 [US2] Implement result view count tracking in SavedResultsService (backend/src/services/SavedResultsService.ts)
- [ ] T096 [P] [US2] Create POST /results/save endpoint in backend/src/api/routes/results.ts
- [ ] T097 [P] [US2] Create GET /results/{slug} endpoint in backend/src/api/routes/results.ts
- [ ] T098 [US2] Wire up results routes to Express app in backend/src/server.ts

### Frontend Implementation for User Story 2

- [ ] T099 [P] [US2] Create ShareButtons component in frontend/src/components/results/ShareButtons.tsx
- [ ] T100 [US2] Implement social media share functionality (Twitter, Facebook, LinkedIn) in ShareButtons
- [ ] T101 [US2] Implement copy-to-clipboard for shareable link in ShareButtons
- [ ] T102 [P] [US2] Create SavedResultPage for viewing shared results in frontend/src/pages/SavedResultPage.tsx
- [ ] T103 [US2] Add save results button and modal to ResultsPage in frontend/src/pages/ResultsPage.tsx
- [ ] T104 [US2] Implement email capture form in save results modal in frontend/src/pages/ResultsPage.tsx
- [ ] T105 [US2] Add SavedResultPage route to React Router in frontend/src/App.tsx
- [ ] T106 [US2] Implement API client methods for save/retrieve in frontend/src/services/quizApi.ts

### User Story 2 Final Tasks

- [ ] T107 [US2] Verify all US2 contract tests pass
- [ ] T108 [US2] Verify US2 integration tests pass
- [ ] T109 [US2] E2E test: Save and share results flow in frontend/tests/e2e/save-share-results.spec.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Multiple Story Themes (Priority: P3)

**Goal**: Users can choose from multiple story themes with different narrative contexts

**Independent Test**: Select theme from menu, experience theme-specific story and character types

### Backend Implementation for User Story 3

- [ ] T110 [US3] Create migration: themes table in backend/src/db/migrations/006_create_themes.sql
- [ ] T111 [US3] Update character_types migration to support multiple themes in backend/src/db/migrations/007_add_theme_support.sql
- [ ] T112 [P] [US3] Create Theme model interface in backend/src/models/Theme.ts
- [ ] T113 [US3] Create seed data for 3 initial themes (fantasy, office, animals) in backend/src/db/seeds/themes.ts
- [ ] T114 [US3] Create additional character types for new themes in backend/src/db/seeds/character_types_themes.ts
- [ ] T115 [P] [US3] Create ThemeService in backend/src/services/ThemeService.ts
- [ ] T116 [US3] Update AIService to use theme-specific prompts in backend/src/services/AIService.ts
- [ ] T117 [P] [US3] Create GET /themes endpoint in backend/src/api/routes/themes.ts
- [ ] T118 [US3] Update quiz start endpoint to accept themeId parameter in backend/src/api/routes/quiz.ts

### Frontend Implementation for User Story 3

- [ ] T119 [P] [US3] Create ThemeSelector component in frontend/src/components/quiz/ThemeSelector.tsx
- [ ] T120 [US3] Add theme selection to HomePage in frontend/src/pages/HomePage.tsx
- [ ] T121 [US3] Update quiz store to track selected theme in frontend/src/stores/quizStore.ts
- [ ] T122 [US3] Update QuizPage to use theme-specific styling in frontend/src/pages/QuizPage.tsx
- [ ] T123 [US3] Update results display to show theme-appropriate character in frontend/src/pages/ResultsPage.tsx

### User Story 3 Final Tasks

- [ ] T124 [US3] Contract tests for themes endpoint in backend/tests/contract/themes-api.test.ts
- [ ] T125 [US3] Integration test for multi-theme quiz flow in backend/tests/integration/multi-theme.test.ts
- [ ] T126 [US3] E2E test: Theme selection and themed quiz in frontend/tests/e2e/theme-selection.spec.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T127 [P] Create comprehensive README.md with setup instructions in project root
- [ ] T128 [P] Create API documentation from OpenAPI spec in docs/api.md
- [ ] T129 [P] Create developer quickstart guide in docs/quickstart.md
- [ ] T130 [P] Add request logging middleware in backend/src/api/middleware/logger.ts
- [ ] T131 [P] Add performance monitoring in backend/src/api/middleware/performance.ts
- [ ] T132 [P] Implement OpenAI cost tracking in backend/src/services/CostTracker.ts
- [ ] T133 [P] Add frontend error boundary for graceful error handling in frontend/src/components/common/ErrorBoundary.tsx
- [ ] T134 [P] Optimize frontend bundle size with code splitting in frontend/src/App.tsx
- [ ] T135 [P] Add analytics tracking (optional) in frontend/src/services/analytics.ts
- [ ] T136 Run full test suite across all user stories
- [ ] T137 Performance testing: Verify <3s AI response time
- [ ] T138 Performance testing: Verify 100 concurrent sessions support
- [ ] T139 Security audit: Input validation and sanitization
- [ ] T140 Accessibility audit: WCAG 2.1 AA compliance
- [ ] T141 Create deployment documentation in docs/deployment.md
- [ ] T142 Setup CI/CD pipeline configuration
- [ ] T143 Final code review and cleanup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 results but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable

### Within Each User Story

- Contract tests MUST be written and FAIL before implementation
- Integration tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints/routes
- Backend API before frontend integration
- E2E tests after full integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All contract tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Frontend components marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

### Contract Tests (Run in Parallel)

```bash
# All 4 contract tests can be written simultaneously:
Task T033: Contract test for POST /quiz/start
Task T034: Contract test for POST /quiz/{sessionId}/respond
Task T035: Contract test for GET /quiz/{sessionId}/results
Task T036: Contract test for GET /quiz/{sessionId}/status
```

### Services (Some Parallel)

```bash
# After contract tests, these can be built in parallel:
Task T040: Create AIService (independent)
Task T045: Create SessionService (independent)
Task T047: Create TraitAnalysisService (independent)
Task T049: Create CharacterMatchingService (independent)
Task T051: Create QuizOrchestrator (depends on above services)
```

### Frontend Components (Most Parallel)

```bash
# Most UI components can be built simultaneously:
Task T064: QuizStart component
Task T065: StoryPrompt component
Task T066: BackgroundImage component
Task T067: LoadingState component
Task T068: CharacterReveal component
Task T069: TraitScores component
Task T070: PersonalityDescription component
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**Timeline Estimate**: 60-80 hours (2-3 weeks for 1 developer)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Polish phase → Final release

**Timeline Estimate**: 100-130 hours (3-4 weeks for 1 developer)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Week 1)
2. Once Foundational is done:
   - Developer A: User Story 1 (2 weeks)
   - Developer B: User Story 2 (1 week)
   - Developer C: User Story 3 (1 week)
3. Stories complete and integrate independently
4. Team does Polish phase together (3-5 days)

**Timeline Estimate**: 2-3 weeks with 3 developers

---

## Notes

- **[P] tasks** = different files, no dependencies on incomplete tasks
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Verify tests fail** before implementing (test-first principle)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Avoid**: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Statistics

**Total Tasks**: 143  
**Setup Tasks**: 10  
**Foundational Tasks**: 22  
**User Story 1 Tasks**: 53 (MVP)  
**User Story 2 Tasks**: 24  
**User Story 3 Tasks**: 17  
**Polish Tasks**: 17

**Parallel Opportunities**: 67 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:

- **US1**: User completes 6-round quiz, receives character assignment
- **US2**: User saves results, retrieves via unique link, shares to social media
- **US3**: User selects theme, experiences theme-specific story and characters

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 85 tasks

---

**Ready to begin!** Start with Phase 1 (Setup) and proceed through Foundation before tackling User Story 1. 🚀
