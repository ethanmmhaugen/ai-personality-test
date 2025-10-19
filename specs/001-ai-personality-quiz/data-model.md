# Data Model: AI-Driven Interactive Personality Quiz

**Date**: 2025-10-19  
**Feature**: AI-Driven Interactive Personality Quiz  
**Purpose**: Define all data entities, relationships, validation rules, and state transitions

---

## Entity Relationship Overview

```
┌─────────────────┐
│ TraitDimension  │
│ (8 dimensions)  │
└────────┬────────┘
         │ referenced by
         ↓
┌─────────────────┐         ┌──────────────┐
│ CharacterType   │         │ QuizSession  │
│ (12 characters) │         │ (ephemeral)  │
└────────┬────────┘         └──────┬───────┘
         │                         │
         │ assigned to        has many
         │                         ↓
         │                  ┌──────────────┐
         └──────────────────│ UserResponse │
                            │ (per round)  │
                            └──────────────┘
                                   │
                                   │ saved as (P2)
                                   ↓
                            ┌──────────────┐
                            │ SavedResult  │
                            │ (persistent) │
                            └──────────────┘
```

---

## Core Entities

### Entity 1: TraitDimension

**Purpose**: Defines one of the 8 personality trait dimensions in the F.I.S.G.E.N.A.D. framework

**Storage**: PostgreSQL `trait_dimensions` table

**Schema**:

```typescript
interface TraitDimension {
	id: string; // UUID primary key
	code: string; // Single letter: F, I, S, G, E, N, A, D
	name: string; // Full name (e.g., "Focused")
	description: string; // What this trait measures
	lowEndLabel: string; // Description at score 0-30
	midRangeLabel: string; // Description at score 40-60
	highEndLabel: string; // Description at score 70-100
	workStyleImplication: string; // How this trait affects work style
	isActive: boolean; // Enable/disable dimensions
	displayOrder: number; // Order for UI display
	createdAt: Date;
	updatedAt: Date;
}
```

**Database Schema**:

```sql
CREATE TABLE trait_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(1) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  low_end_label VARCHAR(100),
  mid_range_label VARCHAR(100),
  high_end_label VARCHAR(100),
  work_style_implication TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT trait_code_valid CHECK (code IN ('F', 'I', 'S', 'G', 'E', 'N', 'A', 'D'))
);

CREATE INDEX idx_trait_dimensions_active ON trait_dimensions(is_active) WHERE is_active = true;
CREATE INDEX idx_trait_dimensions_display_order ON trait_dimensions(display_order);
```

**Validation Rules**:

- `code` must be exactly 1 character, one of: F, I, S, G, E, N, A, D
- `name` max length 50 characters
- `description` required
- `displayOrder` must be unique across active dimensions

**Seed Data** (MVP):

| Code | Name         | Description                                                                            |
| ---- | ------------ | -------------------------------------------------------------------------------------- |
| F    | Focused      | Measures concentration, attention to detail, and task completion persistence           |
| I    | Independence | Measures self-reliance, autonomous decision-making, and comfort working alone          |
| S    | Sensing      | Measures awareness of surroundings, attention to concrete details vs abstract thinking |
| G    | Grounded     | Measures practicality, realism, and preference for proven methods over experimentation |
| E    | Exploratory  | Measures curiosity, openness to new experiences, and willingness to take risks         |
| N    | Network      | Measures social connectivity, collaboration preference, and relationship-building      |
| A    | Analytical   | Measures logical thinking, data-driven decision-making, and systematic problem-solving |
| D    | Driven       | Measures ambition, goal-orientation, and competitive nature                            |

---

### Entity 2: CharacterType

**Purpose**: Represents a fantasy-themed personality archetype with specific trait profile

**Storage**: PostgreSQL `character_types` table

**Schema**:

```typescript
interface CharacterType {
	id: string; // UUID primary key
	name: string; // Character name (e.g., "The Wise Dragon")
	slug: string; // URL-friendly identifier
	description: string; // Personality description (2-3 paragraphs)
	shortDescription: string; // One-sentence summary
	traitProfile: TraitScores; // Target scores for each dimension
	workStyleStrengths: string[]; // List of workplace strengths
	interpersonalDynamics: string; // How this character interacts with others
	visualAssets: {
		iconUrl: string; // Character icon/avatar
		illustrationUrl: string; // Full character illustration
		colorPalette: string[]; // Associated colors for UI
	};
	themeId: string; // Reference to theme (MVP: 'fantasy')
	isActive: boolean; // Enable/disable characters
	popularity: number; // Track how often assigned (for analytics)
	createdAt: Date;
	updatedAt: Date;
}

type TraitScores = {
	F: number; // 0-100
	I: number;
	S: number;
	G: number;
	E: number;
	N: number;
	A: number;
	D: number;
};
```

**Database Schema**:

```sql
CREATE TABLE character_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description VARCHAR(200) NOT NULL,
  trait_profile JSONB NOT NULL,  -- {"F": 75, "I": 60, ...}
  work_style_strengths TEXT[] NOT NULL,
  interpersonal_dynamics TEXT NOT NULL,
  visual_assets JSONB NOT NULL,  -- {"iconUrl": "...", "illustrationUrl": "...", "colorPalette": [...]}
  theme_id VARCHAR(50) DEFAULT 'fantasy',
  is_active BOOLEAN DEFAULT true,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT trait_profile_valid CHECK (
    jsonb_typeof(trait_profile) = 'object' AND
    (trait_profile->>'F')::int BETWEEN 0 AND 100 AND
    (trait_profile->>'I')::int BETWEEN 0 AND 100 AND
    (trait_profile->>'S')::int BETWEEN 0 AND 100 AND
    (trait_profile->>'G')::int BETWEEN 0 AND 100 AND
    (trait_profile->>'E')::int BETWEEN 0 AND 100 AND
    (trait_profile->>'N')::int BETWEEN 0 AND 100 AND
    (trait_profile->>'A')::int BETWEEN 0 AND 100 AND
    (trait_profile->>'D')::int BETWEEN 0 AND 100
  )
);

CREATE INDEX idx_character_types_active ON character_types(is_active) WHERE is_active = true;
CREATE INDEX idx_character_types_theme ON character_types(theme_id);
CREATE INDEX idx_character_types_popularity ON character_types(popularity DESC);
```

**Validation Rules**:

- `name` max length 100 characters, required
- `slug` must be unique, lowercase with hyphens only
- `traitProfile` must contain all 8 dimensions with scores 0-100
- `workStyleStrengths` minimum 3 items, maximum 8 items
- `visualAssets.iconUrl` and `illustrationUrl` must be valid URLs

**Seed Data Example** (MVP - 12 character types):

| Name                | Slug            | Trait Profile (F,I,S,G,E,N,A,D)                | Work Style Strengths                               |
| ------------------- | --------------- | ---------------------------------------------- | -------------------------------------------------- |
| The Wise Dragon     | wise-dragon     | F:85, I:70, S:60, G:75, E:55, N:50, A:90, D:80 | Strategic thinking, mentorship, long-term planning |
| The Adventurous Elf | adventurous-elf | F:60, I:75, S:70, G:40, E:95, N:65, A:55, D:85 | Innovation, adaptability, risk-taking              |
| The Noble Knight    | noble-knight    | F:80, I:60, S:65, G:80, E:50, N:70, A:65, D:90 | Leadership, loyalty, structured approach           |
| The Cunning Rogue   | cunning-rogue   | F:75, I:90, S:80, G:50, E:85, N:40, A:70, D:75 | Problem-solving, independence, resourcefulness     |
| The Mystical Wizard | mystical-wizard | F:90, I:80, S:45, G:55, E:70, N:45, A:95, D:70 | Research, analysis, strategic planning             |
| The Cheerful Bard   | cheerful-bard   | F:55, I:45, S:65, G:60, E:80, N:95, A:50, D:65 | Communication, team building, creativity           |
| ...                 | ...             | ...                                            | ...                                                |

(Additional 6 characters to be designed during implementation)

---

### Entity 3: QuizSession

**Purpose**: Tracks an active or completed quiz attempt with all state information

**Storage**:

- **Active sessions**: Redis (in-memory, fast access, TTL expiration)
- **Completed sessions**: PostgreSQL (persistent for analytics and P2 features)

**Schema**:

```typescript
interface QuizSession {
	sessionId: string; // UUID, primary key
	status: SessionStatus; // 'active' | 'completed' | 'abandoned'
	currentRound: number; // 0-6 (0 = not started, 6 = completed)
	totalRounds: number; // Configurable, default 6
	themeId: string; // 'fantasy' (MVP)
	conversationHistory: Message[]; // Full context for AI generation
	accumulatedTraits: TraitScores; // Running total scores
	responses: UserResponse[]; // All user responses with metadata
	assignedCharacter?: string; // CharacterType.id (set after completion)
	metadata: {
		startedAt: Date;
		lastActivityAt: Date;
		completedAt?: Date;
		userAgent?: string; // Browser info
		ipAddress?: string; // For rate limiting (anonymized)
	};
}

type SessionStatus = "active" | "completed" | "abandoned";

interface Message {
	role: "system" | "assistant" | "user";
	content: string;
	round?: number;
}
```

**Redis Storage** (active sessions):

```typescript
// Key: session:{sessionId}
// Value: JSON-serialized QuizSession
// TTL: 30 minutes (extended on each activity)

await redis.setex(
	`session:${sessionId}`,
	1800, // 30 minutes in seconds
	JSON.stringify(session)
);
```

**PostgreSQL Schema** (completed sessions):

```sql
CREATE TABLE quiz_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  current_round INTEGER NOT NULL DEFAULT 0,
  total_rounds INTEGER NOT NULL DEFAULT 6,
  theme_id VARCHAR(50) NOT NULL DEFAULT 'fantasy',
  conversation_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  accumulated_traits JSONB NOT NULL DEFAULT '{}'::jsonb,
  assigned_character_id UUID REFERENCES character_types(id),
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  user_agent TEXT,
  ip_address_hash VARCHAR(64),  -- SHA256 hash for privacy
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT status_valid CHECK (status IN ('active', 'completed', 'abandoned')),
  CONSTRAINT current_round_valid CHECK (current_round >= 0 AND current_round <= total_rounds)
);

CREATE INDEX idx_quiz_sessions_status ON quiz_sessions(status);
CREATE INDEX idx_quiz_sessions_completed_at ON quiz_sessions(completed_at DESC);
CREATE INDEX idx_quiz_sessions_last_activity ON quiz_sessions(last_activity_at DESC);
CREATE INDEX idx_quiz_sessions_character ON quiz_sessions(assigned_character_id);
```

**Validation Rules**:

- `sessionId` must be valid UUID
- `currentRound` must be 0 ≤ currentRound ≤ totalRounds
- `totalRounds` must be between 3 and 12
- `conversationHistory` must be valid array of Message objects
- `accumulatedTraits` must contain valid scores (numbers)

**State Transitions**:

```
[Created] → [Active] → [Completed]
                ↓
           [Abandoned] (after 30 min inactivity)
```

**Business Rules**:

- Session expires after 30 minutes of inactivity
- After completion, session persists in PostgreSQL for 30 days (configurable)
- Abandoned sessions purged from Redis after TTL expires
- Maximum 10 active sessions per IP per hour (rate limiting)

---

### Entity 4: UserResponse

**Purpose**: Stores a single round's user response with extracted trait scores

**Storage**:

- **During quiz**: Part of QuizSession in Redis
- **After completion**: PostgreSQL `user_responses` table (for analytics)

**Schema**:

```typescript
interface UserResponse {
	id: string; // UUID
	sessionId: string; // Foreign key to QuizSession
	round: number; // 1-6
	storyPrompt: string; // The question/prompt shown to user
	responseText: string; // User's free-form answer
	extractedTraits: TraitScores; // AI-extracted trait scores for this response
	backgroundImageUrl: string; // Generated background image
	generationMetadata: {
		textModel: string; // e.g., "gpt-4"
		imageModel: string; // e.g., "dall-e-3"
		generationTime: number; // milliseconds
		promptTokens?: number;
		completionTokens?: number;
	};
	timestamp: Date;
}
```

**PostgreSQL Schema**:

```sql
CREATE TABLE user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  story_prompt TEXT NOT NULL,
  response_text TEXT NOT NULL,
  extracted_traits JSONB NOT NULL,
  background_image_url TEXT NOT NULL,
  generation_metadata JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT round_valid CHECK (round >= 1 AND round <= 12),
  CONSTRAINT response_length CHECK (char_length(response_text) BETWEEN 1 AND 500),
  UNIQUE (session_id, round)
);

CREATE INDEX idx_user_responses_session ON user_responses(session_id);
CREATE INDEX idx_user_responses_timestamp ON user_responses(timestamp DESC);
```

**Validation Rules**:

- `responseText` length: 1-500 characters
- `round` must be unique within a session
- `extractedTraits` must contain all 8 dimensions
- `backgroundImageUrl` must be valid URL

---

### Entity 5: SavedResult (Priority 2)

**Purpose**: Persistent saved quiz results with unique shareable links

**Storage**: PostgreSQL `saved_results` table

**Schema**:

```typescript
interface SavedResult {
	id: string; // UUID primary key
	resultSlug: string; // Unique short code for sharing (e.g., "abc123")
	sessionId: string; // Reference to completed QuizSession
	characterId: string; // Reference to assigned CharacterType
	finalTraitScores: TraitScores; // Final calculated scores
	userEmail?: string; // Optional email for notifications
	metadata: {
		savedAt: Date;
		expiresAt?: Date; // Optional expiration
		viewCount: number; // Track how many times viewed
		lastViewedAt?: Date;
	};
}
```

**PostgreSQL Schema**:

```sql
CREATE TABLE saved_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_slug VARCHAR(12) NOT NULL UNIQUE,
  session_id UUID NOT NULL REFERENCES quiz_sessions(session_id),
  character_id UUID NOT NULL REFERENCES character_types(id),
  final_trait_scores JSONB NOT NULL,
  user_email VARCHAR(255),
  saved_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,

  CONSTRAINT result_slug_format CHECK (result_slug ~ '^[a-zA-Z0-9]{6,12}$')
);

CREATE INDEX idx_saved_results_slug ON saved_results(result_slug);
CREATE INDEX idx_saved_results_session ON saved_results(session_id);
CREATE INDEX idx_saved_results_expires ON saved_results(expires_at) WHERE expires_at IS NOT NULL;
```

**Validation Rules**:

- `resultSlug` must be 6-12 alphanumeric characters, globally unique
- `userEmail` must be valid email format if provided
- `sessionId` must reference a completed session

---

## Derived Data & Calculations

### Trait Score Accumulation

**Formula**: Weighted average with early round emphasis

```typescript
function calculateFinalTraits(responses: UserResponse[]): TraitScores {
	const weights = [1.2, 1.2, 1.0, 1.0, 0.9, 0.9]; // Early rounds weighted higher
	const totals: TraitScores = {
		F: 0,
		I: 0,
		S: 0,
		G: 0,
		E: 0,
		N: 0,
		A: 0,
		D: 0,
	};
	let totalWeight = 0;

	responses.forEach((response, index) => {
		const weight = weights[index] || 1.0;
		Object.keys(response.extractedTraits).forEach((trait) => {
			totals[trait] += response.extractedTraits[trait] * weight;
		});
		totalWeight += weight;
	});

	// Normalize to 0-100 scale
	return Object.keys(totals).reduce((result, trait) => {
		result[trait] = Math.round(totals[trait] / totalWeight);
		return result;
	}, {} as TraitScores);
}
```

### Character Matching Distance

**Formula**: Euclidean distance in 8-dimensional trait space

```typescript
function calculateMatchDistance(
	userTraits: TraitScores,
	characterTraits: TraitScores
): number {
	const dimensions = ["F", "I", "S", "G", "E", "N", "A", "D"];
	const sumOfSquares = dimensions.reduce((sum, dim) => {
		const diff = userTraits[dim] - characterTraits[dim];
		return sum + diff * diff;
	}, 0);
	return Math.sqrt(sumOfSquares);
}

// Find best match
function matchCharacter(
	userTraits: TraitScores,
	characters: CharacterType[]
): CharacterType {
	return characters.reduce(
		(best, char) => {
			const distance = calculateMatchDistance(userTraits, char.traitProfile);
			return distance < best.distance ? { character: char, distance } : best;
		},
		{ character: null, distance: Infinity }
	).character;
}
```

---

## Data Migration Strategy

### Initial Migration (v1.0.0)

```sql
-- Create tables in order
CREATE TABLE trait_dimensions (...);
CREATE TABLE character_types (...);
CREATE TABLE quiz_sessions (...);
CREATE TABLE user_responses (...);

-- Seed trait dimensions (8 rows)
INSERT INTO trait_dimensions (code, name, description, ...) VALUES
  ('F', 'Focused', '...'),
  ('I', 'Independence', '...'),
  ...;

-- Seed character types (12 rows for fantasy theme)
INSERT INTO character_types (name, slug, trait_profile, ...) VALUES
  ('The Wise Dragon', 'wise-dragon', '{"F": 85, "I": 70, ...}', ...),
  ...;
```

### Future Migrations

- v1.1.0: Add `saved_results` table (P2 feature)
- v1.2.0: Add `themes` table (P3 feature)
- v2.0.0: Add `user_accounts` table (authentication)

---

## Data Retention Policies

| Entity                             | Retention Period               | Rationale                                  |
| ---------------------------------- | ------------------------------ | ------------------------------------------ |
| Active QuizSession (Redis)         | 30 minutes TTL                 | Prevents stale sessions, automatic cleanup |
| Completed QuizSession (PostgreSQL) | 30 days                        | Analytics, debugging, P2 save feature      |
| UserResponse                       | 30 days (same as session)      | Linked to session lifecycle                |
| SavedResult (P2)                   | Configurable (default: 1 year) | User-requested persistence                 |
| CharacterType                      | Permanent                      | Core application data                      |
| TraitDimension                     | Permanent                      | Core application data                      |

---

## Data Privacy & Security

### Personally Identifiable Information (PII)

- **No PII stored in MVP**: Sessions are anonymous
- **IP addresses**: Hashed (SHA256) before storage for rate limiting only
- **User emails** (P2): Optional, stored encrypted, with opt-out mechanism

### Data Anonymization

```typescript
function anonymizeSession(session: QuizSession): QuizSession {
	return {
		...session,
		metadata: {
			...session.metadata,
			ipAddress: session.metadata.ipAddress
				? hashSHA256(session.metadata.ipAddress)
				: undefined,
		},
	};
}
```

### GDPR Compliance (Future)

- Right to erasure: Delete user data on request
- Right to access: Export user data in JSON format
- Right to portability: Provide machine-readable format

---

## Next Steps

1. ✅ Data model defined
2. ➡️ Create database migration scripts
3. ➡️ Implement TypeScript interfaces matching schemas
4. ➡️ Create seed data for 12 fantasy character types
5. ➡️ Write contract tests for data validation
6. ➡️ Implement Redis session management layer
7. ➡️ Implement PostgreSQL data access layer

---

## Appendix: Full Character Type Seed Data

Complete 12 character types will be defined during implementation, including:

1. The Wise Dragon (Strategic, analytical, focused)
2. The Adventurous Elf (Exploratory, independent, driven)
3. The Noble Knight (Grounded, network-oriented, disciplined)
4. The Cunning Rogue (Independent, sensing, analytical)
5. The Mystical Wizard (Focused, analytical, innovative)
6. The Cheerful Bard (Network-oriented, exploratory, social)
7. The Steadfast Dwarf (Grounded, focused, reliable)
8. The Graceful Ranger (Sensing, independent, balanced)
9. The Ambitious Warlord (Driven, grounded, commanding)
10. The Thoughtful Healer (Network-oriented, sensing, empathetic)
11. The Curious Scholar (Analytical, focused, knowledge-seeking)
12. The Bold Adventurer (Exploratory, driven, risk-taking)

Each with full trait profiles, descriptions, and visual assets.
