# Feature Specification: AI-Driven Interactive Personality Quiz

**Feature Branch**: `001-ai-personality-quiz`  
**Created**: 2025-10-19  
**Status**: Draft  
**Input**: User description: "I want to create one of those web applications where the user answers a series of multiple choice questions taking them through a short story. Their answers eventually map them to a character at the end of the game based off of a trait chart (think meyers briggs). An example of this is a vegetable game where at the end it tells you you are a carrot with x traits, or a broccoli, cabbage etc. The twist I want to implement is that instead of multiple choice options, I want the user to be able to type whatever answer they want into the text box. This answer will be fed to an llm that will generate the next question or phase of the story based on their response, and also map their response to our defined character trait categories. After X rounds the story ends and we give them their character breakdown."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Complete Interactive Personality Quiz (Priority: P1)

A user visits the application, experiences an interactive story-driven personality quiz where they type free-form answers to dynamically generated questions, and receives a character personality result based on their responses.

**Why this priority**: This is the core MVP - the entire value proposition of the application. Without this, there is no product.

**Independent Test**: Can be fully tested by a user visiting the app, typing answers to story prompts, completing the quiz, and receiving their character breakdown. Delivers complete value as a standalone personality quiz experience.

**Acceptance Scenarios**:

1. **Given** a user lands on the quiz homepage, **When** they click "Start Quiz", **Then** they see an introductory story prompt with a text input field
2. **Given** a user is on a quiz question, **When** they type their answer and submit, **Then** the system displays the next story phase/question within 3 seconds
3. **Given** a user has completed all quiz rounds, **When** the final answer is submitted, **Then** they see their character type with trait breakdown and description
4. **Given** a user is viewing their results, **When** they review their character profile, **Then** they see which character type they are, their trait scores, and a personality description
5. **Given** a user wants to restart, **When** they click "Take Quiz Again" from results page, **Then** they return to the beginning with a fresh quiz session

---

### User Story 2 - Save and Share Results (Priority: P2)

A user who completes the quiz can save their results for later viewing and share their character type on social media or via direct link.

**Why this priority**: Increases engagement and provides viral growth potential through social sharing. Not essential for MVP functionality but significantly enhances value and discoverability.

**Independent Test**: Can be tested by completing a quiz, using the save feature to bookmark results, and using share buttons to post results to social platforms or copy a shareable link.

**Acceptance Scenarios**:

1. **Given** a user completes the quiz, **When** they view their results, **Then** they see options to "Save Results" and "Share"
2. **Given** a user clicks "Save Results", **When** they provide an email or create a simple profile, **Then** they receive a unique link to view their results later
3. **Given** a user clicks "Share", **When** they select a social platform, **Then** a pre-formatted post with their character type and link to the quiz opens
4. **Given** a user has saved results, **When** they visit their unique results link, **Then** they see their original character breakdown

---

### User Story 3 - Multiple Story Themes (Priority: P3)

Users can choose from different story themes that change the narrative context while using the same 8-dimension trait mapping system.

**Why this priority**: Adds replay value and broader appeal to different audiences. Nice enhancement but not required for core functionality. MVP will focus on a single theme.

**Independent Test**: Can be tested by selecting different themes from a theme menu and experiencing different story narratives that lead to thematically appropriate character types within each theme.

**Acceptance Scenarios**:

1. **Given** a user is on the quiz start page, **When** they view available themes, **Then** they see a list of 3+ story themes with descriptions
2. **Given** a user selects a theme, **When** they start the quiz, **Then** all story prompts and final character types reflect the selected theme
3. **Given** a user completes a quiz in one theme, **When** they retake the quiz with a different theme, **Then** they experience different story context but consistent trait mapping

---

### Edge Cases

- What happens when a user submits an empty answer or only whitespace?
- What happens when a user submits extremely long answers (500+ words)?
- What happens when a user submits inappropriate, offensive, or nonsensical content?
- What happens if the AI/LLM service fails or times out during question generation?
- What happens if the AI/LLM service fails during trait mapping?
- What happens when a user navigates away mid-quiz and returns later?
- What happens if a user tries to skip questions or manipulate the quiz progression?
- What happens when the system cannot map a user's response to any defined trait categories?
- What happens if two users share results links - does each user see their own results or could links collide?

## Requirements _(mandatory)_

### Functional Requirements

**Core Quiz Flow**

- **FR-001**: System MUST present users with a predefined initial story prompt (hardcoded, not AI-generated) and text input field when starting a quiz
- **FR-002**: System MUST accept free-form text answers (minimum 1 character, maximum 500 characters) for each question
- **FR-003**: System MUST use an AI/LLM service to generate the next story phase/question based on the user's previous answer (all rounds after the initial prompt)
- **FR-003a**: System MUST generate and display a unique cartoony background image for each story phase using an AI image generation service, with the image contextually matching the story prompt
- **FR-004**: System MUST progress users through a configurable number of rounds (default: 6 rounds) before concluding the quiz
- **FR-005**: System MUST analyze each user response to extract and accumulate trait scores across predefined personality dimensions

**Trait Mapping & Character Assignment**

- **FR-006**: System MUST maintain a predefined set of character types with associated trait profiles (minimum 6 character types recommended for meaningful differentiation)
- **FR-007**: System MUST define 8 personality trait dimensions: F (Focused), I (Independence), S (Sensing), G (Grounded), E (Exploratory), N (Network), A (Analytical), D (Driven), where each dimension is scored on a scale from 0 to 100
- **FR-008**: System MUST use AI/LLM service to map each user response to trait scores on the defined dimensions
- **FR-009**: System MUST calculate cumulative trait scores across all rounds to determine the final character type
- **FR-010**: System MUST assign users to the character type that best matches their accumulated trait profile

**Results Display**

- **FR-011**: System MUST display the user's assigned character type with a visual representation (icon, illustration, or avatar)
- **FR-012**: System MUST display trait scores showing the user's numerical score (0-100) on each of the 8 personality dimensions
- **FR-012a**: System MUST display work style strengths and interpersonal dynamics based on the user's trait profile
- **FR-013**: System MUST provide a written personality description explaining the character type, its traits, work style strengths, and interpersonal dynamics
- **FR-014**: Users MUST be able to restart the quiz from the results page

**Data & Session Management**

- **FR-015**: System MUST maintain quiz session state to track user progress through rounds
- **FR-016**: System MUST persist user responses during an active quiz session
- **FR-017**: System MUST generate unique session identifiers to distinguish between different quiz attempts

**Content Moderation & Validation**

- **FR-018**: System MUST validate user input to reject empty submissions
- **FR-019**: System MUST enforce character limits (500 characters max) on user responses
- **FR-020**: System MUST accept all user text input without content filtering in the initial version (future enhancement: configurable child-friendly mode with content filtering)

**Error Handling & Resilience**

- **FR-021**: System MUST handle AI/LLM service failures gracefully with fallback questions or retry mechanisms
- **FR-022**: System MUST provide clear error messages when technical issues prevent quiz progression
- **FR-023**: System MUST allow users to retry when encountering errors without losing session progress

### Key Entities _(include if feature involves data)_

- **QuizSession**: Represents a single quiz attempt by a user. Tracks session ID, start time, current round number, accumulated trait scores, completion status, and assigned character type.

- **UserResponse**: Represents a single answer submitted by a user. Contains the response text, round number, timestamp, associated session ID, and extracted trait scores from that response.

- **CharacterType**: Represents a fantasy-themed personality character (e.g., "The Wise Dragon", "The Cunning Elf"). Contains character name, description, trait profile (target scores 0-100 on each of 8 dimensions), work style strengths, interpersonal dynamics, visual assets, and theme association.

- **TraitDimension**: Represents one of 8 personality trait dimensions (F, I, S, G, E, N, A, D). Contains dimension code, full name, description, scoring range (0-100), and interpretation guidelines.

- **StoryPrompt**: Represents a generated question/phase in the narrative. Contains prompt text, round number, context from previous answers, associated session ID, and generation timestamp.

- **SavedResult**: Represents a saved quiz result for later retrieval. Contains unique result ID/link, session data, character assignment, completion timestamp, and optional user contact information.

- **Theme**: (For P3) Represents a story theme variation. Contains theme name, description, associated character types, and story context/tone guidelines.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete a full quiz (all rounds) in under 5 minutes on average
- **SC-002**: 70% of users who start the quiz complete all rounds and view their results
- **SC-003**: The system generates contextually relevant next questions within 3 seconds of receiving a user answer
- **SC-004**: Character assignments feel accurate to users - 75% of users agree their character type "somewhat" or "strongly" matches their work style and strengths (via optional feedback survey)
- **SC-005**: The system successfully processes and maps 95% of user responses to trait scores without errors
- **SC-006**: The application handles 100 concurrent active quiz sessions without performance degradation
- **SC-007**: Users can understand their character results - 90% of users spend at least 10 seconds reviewing their character breakdown (indicating engagement with results)
- **SC-008**: For User Story 2: 40% of users who complete the quiz use the share functionality
- **SC-009**: Background images load and display within 2 seconds of each story phase appearing

## Assumptions

- **AI/LLM Integration**: The application will integrate with an AI service capable of generating contextual story prompts and analyzing text for personality traits. Service availability and API costs are within acceptable parameters.

- **Anonymous Usage**: Users can take the quiz without creating an account (for P1 MVP). Account creation or email capture is only required for saving results (P2).

- **Character Type Design**: A predefined set of fantasy-themed character types (e.g., dragons, elves, wizards, warriors, mages) with distinct 8-dimension trait profiles will be designed before implementation. Each character type represents a unique work style and interpersonal approach.

- **Trait Framework**: The application uses the F.I.S.G.E.N.A.D. 8-dimension personality framework inspired by "What Cake R U?" personality test, which draws from OCEANS (Big Five) and MBTI models. Dimensions are: F (Focused), I (Independence), S (Sensing), G (Grounded), E (Exploratory), N (Network), A (Analytical), D (Driven). Each dimension is scored 0-100, creating detailed personality profiles focused on work style strengths and interpersonal dynamics.

- **Single Session**: Each quiz session is independent - users cannot pause and resume later in the MVP (P1). Session persistence is only maintained during an active browser session.

- **Content Moderation**: No content filtering in initial MVP. Future enhancement will include a configurable child-friendly mode with content filtering when needed.

- **Language Support**: Initial MVP supports English only. Internationalization is a future enhancement.

- **Visual Theme**: MVP uses a fantasy theme with character types inspired by fantasy archetypes (dragons, elves, wizards, etc.). The theme provides an engaging narrative context while the underlying F.I.S.G.E.N.A.D. framework measures workplace personality traits.

- **Image Generation**: Background images for each story phase will be generated dynamically using an AI image generation service, creating unique cartoony fantasy-themed visuals that match each story prompt.

- **Browser Support**: Modern web browsers (Chrome, Firefox, Safari, Edge) from the last 2 years are supported. Mobile-responsive design is included.
