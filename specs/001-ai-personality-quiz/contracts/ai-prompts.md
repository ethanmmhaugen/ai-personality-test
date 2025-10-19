# AI Prompts Contract: OpenAI Integration

**Date**: 2025-10-19  
**Feature**: AI-Driven Interactive Personality Quiz  
**Purpose**: Define structured prompts for OpenAI GPT-4 (text) and DALL-E 3 (images)

---

## Overview

This document specifies the exact prompt templates and expected outputs for all AI interactions in the personality quiz application. These contracts enable:

- **Test-First Development**: Mock AI responses based on these templates
- **Consistent Output**: Structured responses for reliable parsing
- **Quality Control**: Validate AI outputs against schemas
- **Cost Optimization**: Token-efficient prompts

---

## GPT-4 Text Generation Prompts

### Prompt 1: Initial Story Setup (Hardcoded - No AI)

**Purpose**: The first story prompt is hardcoded in the application (no AI call)

**Content**:

```typescript
const INITIAL_PROMPT = {
	text: `You awaken in a mystical realm where magic flows through every living thing. 
Ancient ruins surround you, and three paths diverge before you: one leads to a 
shimmering forest, another to a towering mountain, and the third descends into 
shadowy caverns. 

What do you do first?`,

	backgroundImageUrl: "/assets/images/fantasy-awakening.png", // Pre-made image
};
```

**Design Note**: Hardcoded to save costs and ensure consistent onboarding experience.

---

### Prompt 2: Contextual Story Continuation

**Purpose**: Generate the next story phase based on user's previous response

**System Prompt Template**:

```typescript
const STORY_CONTINUATION_SYSTEM_PROMPT = `You are a masterful fantasy storyteller creating an interactive personality quiz. Your role is to:

1. Continue a narrative adventure based on the user's responses
2. Create engaging, immersive scenarios that subtly reveal personality traits
3. Keep stories appropriate for all ages (PG-rated)
4. Match the fantasy theme with elements like magic, quests, mythical creatures
5. Generate prompts that allow for multiple response interpretations
6. Maintain story continuity while adapting to user choices

RULES:
- Keep prompts concise (2-3 paragraphs maximum)
- End each prompt with an open-ended question
- Do NOT provide multiple choice options
- Responses should be 100-200 words
- Use vivid imagery that works with background illustrations
- Avoid explicit violence, romance, or controversial topics

OUTPUT FORMAT: Return ONLY the story text. Do not include meta-commentary or explanations.`;
```

**User Prompt Template**:

```typescript
interface StoryContinuationRequest {
	conversationHistory: Array<{ role: string; content: string }>;
	currentRound: number;
	totalRounds: number;
	previousResponse: string;
}

function buildStoryContinuationPrompt(
	request: StoryContinuationRequest
): string {
	return `CONTEXT:
Round ${request.currentRound} of ${request.totalRounds}

PREVIOUS STORY PROMPTS AND USER RESPONSES:
${formatConversationHistory(request.conversationHistory)}

USER'S LATEST RESPONSE:
"${request.previousResponse}"

TASK:
Continue the fantasy adventure story based on the user's response. The story should 
naturally flow from their choice while introducing a new situation or challenge. 
Remember this is round ${request.currentRound} of ${
		request.totalRounds
	}, so adjust 
story pacing accordingly.

${
	request.currentRound === request.totalRounds
		? "IMPORTANT: This is the final round. Bring the story to a satisfying conclusion."
		: ""
}

Generate the next story prompt now:`;
}
```

**Expected Output Example**:

```
Your decision to explore the shimmering forest proves wise. As you step between
the ancient trees, you notice the forest seems to respond to your presence—branches
part to reveal hidden paths, and mystical creatures peek curiously from behind
glowing mushrooms.

Suddenly, you encounter a wounded phoenix, its brilliant feathers dimming. A group
of forest guardians watches from a distance, waiting to see what you'll do. You
could try to heal the phoenix yourself, seek help from the guardians, or investigate
what caused its injury first.

How do you respond to this situation?
```

**API Call Configuration**:

```typescript
const storyGenerationConfig = {
	model: "gpt-4",
	temperature: 0.7, // Moderate creativity
	max_tokens: 300, // ~200 words
	top_p: 0.9,
	frequency_penalty: 0.3, // Reduce repetition
	presence_penalty: 0.3, // Encourage diverse vocabulary
};
```

**Fallback Strategy**:

```typescript
// If GPT-4 fails, use GPT-3.5-turbo with same prompt
const fallbackConfig = {
	model: "gpt-3.5-turbo",
	temperature: 0.7,
	max_tokens: 300,
};

// If both fail, use generic prompts
const genericPrompts = [
	"You discover a hidden chamber filled with ancient artifacts...",
	"A mysterious traveler approaches with an urgent request...",
	"The path ahead splits into multiple directions, each beckoning...",
];
```

---

### Prompt 3: Trait Extraction from User Response

**Purpose**: Analyze user's text response and extract personality trait scores

**System Prompt Template**:

```typescript
const TRAIT_EXTRACTION_SYSTEM_PROMPT = `You are an expert personality analyst specializing in the F.I.S.G.E.N.A.D. framework, inspired by OCEANS and MBTI models. 

Your task is to analyze a user's free-form text response to a story prompt and score them on 8 personality dimensions from 0-100:

**F (Focused)**: Concentration, attention to detail, task completion persistence
- Low (0-30): Easily distracted, spontaneous, multi-tasking
- Mid (40-60): Balanced focus, can concentrate when needed
- High (70-100): Intense concentration, single-minded, detail-oriented

**I (Independence)**: Self-reliance, autonomous decision-making
- Low (0-30): Prefers group decisions, seeks guidance
- Mid (40-60): Situationally independent
- High (70-100): Highly self-reliant, autonomous thinker

**S (Sensing)**: Awareness of surroundings, concrete vs abstract thinking
- Low (0-30): Abstract thinker, theoretical focus
- Mid (40-60): Balanced concrete/abstract
- High (70-100): Detail-oriented, observant, practical

**G (Grounded)**: Practicality, realism, preference for proven methods
- Low (0-30): Idealistic, experimental, risk-taking
- Mid (40-60): Pragmatic when needed
- High (70-100): Highly practical, cautious, traditional

**E (Exploratory)**: Curiosity, openness to new experiences
- Low (0-30): Prefers routine, cautious about change
- Mid (40-60): Situationally open to novelty
- High (70-100): Highly curious, adventurous, novelty-seeking

**N (Network)**: Social connectivity, collaboration preference
- Low (0-30): Independent, prefers working alone
- Mid (40-60): Balanced social/solo work
- High (70-100): Highly social, collaborative, relationship-focused

**A (Analytical)**: Logical thinking, data-driven decisions
- Low (0-30): Intuitive, emotion-driven decisions
- Mid (40-60): Balanced logic/intuition
- High (70-100): Highly analytical, systematic, logical

**D (Driven)**: Ambition, goal-orientation, competitive nature
- Low (0-30): Relaxed, process-oriented, non-competitive
- Mid (40-60): Motivated when interested
- High (70-100): Highly ambitious, goal-focused, competitive

ANALYSIS APPROACH:
- Consider the user's chosen action (what they decided to do)
- Analyze their reasoning and thought process
- Look for indicators of each dimension in their language
- Be nuanced—not everything is extreme (0 or 100)
- A single response reveals partial information; score accordingly

OUTPUT: Return ONLY a valid JSON object with scores. No explanations or additional text.`;
```

**User Prompt Template**:

```typescript
interface TraitExtractionRequest {
	storyPrompt: string;
	userResponse: string;
	round: number;
}

function buildTraitExtractionPrompt(request: TraitExtractionRequest): string {
	return `STORY PROMPT GIVEN TO USER:
"${request.storyPrompt}"

USER'S RESPONSE:
"${request.userResponse}"

ROUND: ${request.round}

Analyze this response and provide personality scores:`;
}
```

**Expected Output Schema**:

```typescript
interface TraitScores {
  F: number;  // 0-100
  I: number;
  S: number;
  G: number;
  E: number;
  N: number;
  A: number;
  D: number;
}

// Example valid response:
{
  "F": 75,
  "I": 60,
  "S": 80,
  "G": 65,
  "E": 70,
  "N": 55,
  "A": 85,
  "D": 90
}
```

**API Call Configuration**:

```typescript
const traitExtractionConfig = {
	model: "gpt-4",
	temperature: 0.3, // Lower temperature for consistency
	max_tokens: 100, // Just need JSON response
	response_format: { type: "json_object" }, // JSON mode
	top_p: 1.0,
};
```

**Validation**:

```typescript
function validateTraitScores(scores: any): TraitScores {
	const requiredKeys = ["F", "I", "S", "G", "E", "N", "A", "D"];

	// Check all keys present
	if (!requiredKeys.every((key) => key in scores)) {
		throw new ValidationError("Missing trait dimensions");
	}

	// Check all values are numbers 0-100
	for (const key of requiredKeys) {
		const value = scores[key];
		if (typeof value !== "number" || value < 0 || value > 100) {
			throw new ValidationError(`Invalid score for ${key}: ${value}`);
		}
	}

	return scores as TraitScores;
}
```

**Example Analysis**:

```
User Response: "I would carefully examine the phoenix's wounds first, then use
my knowledge of herbs to create a healing poultice while softly reassuring the
creature that I'm here to help."

Expected Scores:
{
  "F": 80,  // High focus (methodical approach)
  "I": 65,  // Moderate independence (self-reliant but aware of guardians)
  "S": 85,  // High sensing (attention to wounds, herbs, details)
  "G": 75,  // High grounded (practical healing method)
  "E": 55,  // Moderate exploratory (cautious investigation)
  "N": 60,  // Moderate network (empathy toward creature)
  "A": 70,  // High analytical (systematic examination)
  "D": 65   // Moderate driven (proactive but not aggressive)
}
```

---

## DALL-E 3 Image Generation Prompts

### Prompt 4: Fantasy Background Image

**Purpose**: Generate cartoony fantasy background images for each story phase

**Prompt Template**:

```typescript
interface ImageGenerationRequest {
	storyContext: string; // The story prompt shown to user
	round: number;
	theme: string; // 'fantasy' for MVP
}

function buildImagePrompt(request: ImageGenerationRequest): string {
	const styleGuidelines = `
Style: Cartoony, whimsical, colorful fantasy illustration
Art Direction: Think Studio Ghibli meets Disney - magical but not dark
Colors: Vibrant and inviting, with magical glowing elements
Mood: Adventurous and mystical
Technical: Suitable as a background image, no text overlays
Composition: Wide landscape view, leave space in lower third for UI elements
`;

	// Extract scene description from story
	const sceneKeywords = extractSceneKeywords(request.storyContext);

	return `${styleGuidelines}

SCENE: ${sceneKeywords}

Generate a beautiful, cartoony fantasy background illustration showing this scene. 
The image should be vibrant, magical, and appropriate for all ages. Include fantasy 
elements like glowing magic, mystical creatures in the distance, and enchanted 
landscapes. The composition should work as a background with UI elements overlaid.`;
}

function extractSceneKeywords(storyText: string): string {
	// Use simple keyword extraction or another GPT call
	// For example: "mystical forest, ancient ruins, glowing mushrooms, magical creatures"
	return storyText.split(".")[0]; // Simplified - take first sentence
}
```

**API Call Configuration**:

```typescript
const imageGenerationConfig = {
	model: "dall-e-3",
	size: "1024x1024", // Square format works best for responsive design
	quality: "standard", // "hd" is 2x cost, may not be worth it
	style: "vivid", // More vibrant colors
	n: 1, // Generate only 1 image
};
```

**Example Prompts**:

```
Prompt 1 (Forest Scene):
"Style: Cartoony, whimsical, colorful fantasy illustration. Art Direction: Studio
Ghibli meets Disney - magical but not dark. Colors: Vibrant with glowing magical
elements. A shimmering enchanted forest with ancient trees, glowing mushrooms,
mystical creatures peeking from behind foliage, and sunbeams filtering through
the canopy. Wide landscape view with space in lower third for UI."

Prompt 2 (Phoenix Scene):
"Cartoony fantasy illustration, Studio Ghibli style. A wounded phoenix with dimming
brilliant feathers resting in a magical forest clearing. Forest guardians (mystical
ethereal beings) watching from the shadows. Glowing healing herbs nearby. Warm
magical lighting. Wide landscape composition with lower third clear for UI."

Prompt 3 (Mountain Scene):
"Whimsical cartoony fantasy landscape. Towering magical mountain with glowing
crystal peaks, floating islands in the sky, mystical ruins on the slopes.
Adventure and wonder mood. Vibrant colors, Studio Ghibli aesthetic. Wide
composition suitable as background image."
```

**Image Processing Pipeline**:

```typescript
async function generateAndProcessImage(prompt: string): Promise<string> {
	// 1. Generate image via DALL-E 3
	const response = await openai.images.generate({
		model: "dall-e-3",
		prompt: prompt,
		size: "1024x1024",
		quality: "standard",
		style: "vivid",
	});

	const imageUrl = response.data[0].url; // Temporary URL from OpenAI

	// 2. Download image
	const imageBuffer = await downloadImage(imageUrl);

	// 3. Upload to CDN for permanent storage
	const cdnUrl = await cdn.upload(imageBuffer, {
		folder: "quiz-backgrounds",
		public: true,
		cacheControl: "public, max-age=2592000", // 30 days
	});

	return cdnUrl;
}
```

**Fallback Strategy**:

```typescript
// Pre-made fallback images for each round
const fallbackImages = {
	1: "/assets/images/fantasy-forest.png",
	2: "/assets/images/fantasy-mountain.png",
	3: "/assets/images/fantasy-cavern.png",
	4: "/assets/images/fantasy-ruins.png",
	5: "/assets/images/fantasy-castle.png",
	6: "/assets/images/fantasy-conclusion.png",
};

async function generateImageWithFallback(
	prompt: string,
	round: number
): Promise<string> {
	try {
		return await generateAndProcessImage(prompt);
	} catch (error) {
		console.error("Image generation failed, using fallback", error);
		return fallbackImages[round] || fallbackImages[1];
	}
}
```

---

## Performance Optimization

### Parallel Processing

Generate story text and background image simultaneously:

```typescript
async function generateStoryPhase(
	userResponse: string,
	session: QuizSession
): Promise<StoryPhase> {
	const [storyText, imageUrl] = await Promise.all([
		generateStoryText(userResponse, session),
		generateBackgroundImage(userResponse, session),
	]);

	return { text: storyText, backgroundImageUrl: imageUrl };
}
```

**Expected Latency**:

- Text generation (GPT-4): 1-2 seconds
- Image generation (DALL-E 3): 3-5 seconds
- **Total (parallel)**: 3-5 seconds (bottleneck is image)

---

## Cost Estimation

### Per Quiz Session (6 rounds)

**Text Generation**:

- Story continuation: 5 calls × 300 tokens output ≈ 1,500 tokens
- Trait extraction: 6 calls × 100 tokens output ≈ 600 tokens
- Context (input): ~1,000 tokens average per call × 11 calls ≈ 11,000 tokens
- **Total**: ~13,100 tokens

**Costs** (GPT-4 pricing):

- Input: 11,000 tokens @ $0.03/1k = $0.33
- Output: 2,100 tokens @ $0.06/1k = $0.13
- **Text Total**: $0.46

**Image Generation**:

- 6 images @ $0.04/image = $0.24

**Grand Total**: ~$0.70 per completed quiz

**Monthly Cost Projections**:

- 100 completions/day: $70/day = $2,100/month
- 500 completions/day: $350/day = $10,500/month

**Optimization Strategies**:

- Cache common story paths (30% cost reduction)
- Use GPT-3.5-turbo for non-critical calls (70% text cost reduction)
- Pre-generate background images for common scenarios

---

## Testing & Mocking

### Mock AI Responses for Tests

```typescript
// Mock GPT-4 story generation
export const mockStoryResponses = {
	round1: "As you step into the shimmering forest...",
	round2: "The path leads you to an ancient temple...",
	round3: "You encounter a wise old wizard...",
	// ... etc
};

// Mock trait extraction
export const mockTraitScores: TraitScores = {
	F: 75,
	I: 60,
	S: 80,
	G: 65,
	E: 70,
	N: 55,
	A: 85,
	D: 90,
};

// Mock image URLs
export const mockImageUrls = {
	round1: "https://test.cdn.com/forest.png",
	round2: "https://test.cdn.com/temple.png",
	// ... etc
};

// Test helper
export function createMockAIService(): AIService {
	return {
		generateStoryText: jest.fn().mockResolvedValue(mockStoryResponses.round1),
		extractTraits: jest.fn().mockResolvedValue(mockTraitScores),
		generateImage: jest.fn().mockResolvedValue(mockImageUrls.round1),
	};
}
```

---

## Error Handling

### API Error Scenarios

| Error Type               | Status Code | Handling Strategy                 |
| ------------------------ | ----------- | --------------------------------- |
| Rate Limit               | 429         | Exponential backoff + retry       |
| Timeout                  | 408         | Retry once, then use fallback     |
| Invalid API Key          | 401         | Alert admin, return error to user |
| Service Unavailable      | 503         | Use fallback content immediately  |
| Content Policy Violation | 400         | Regenerate with stricter prompt   |
| Token Limit Exceeded     | 400         | Truncate context, retry           |

```typescript
async function callOpenAIWithErrorHandling<T>(
	apiCall: () => Promise<T>,
	fallback: T
): Promise<T> {
	try {
		return await apiCall();
	} catch (error) {
		if (error.status === 429) {
			await sleep(1000); // Wait 1 second
			return await apiCall(); // Retry once
		} else if (error.status === 503 || isTimeout(error)) {
			return fallback;
		} else {
			throw error; // Let other errors propagate
		}
	}
}
```

---

## Quality Assurance

### Manual Review Checklist

Before production, manually test:

- [ ] Story prompts are engaging and age-appropriate
- [ ] Trait extraction is reasonably accurate (spot-check 20 samples)
- [ ] Images match story context
- [ ] No inappropriate content generated
- [ ] Fallbacks work when AI services unavailable
- [ ] Token usage within budget constraints

### Monitoring

Track in production:

- AI call success rate
- Average latency per call type
- Cost per completed quiz
- Content policy violations
- Fallback usage rate

---

## Next Steps

1. ✅ AI prompt contracts defined
2. ➡️ Implement AIService wrapper class
3. ➡️ Create mock responses for testing
4. ➡️ Write contract tests for AI integration
5. ➡️ Implement fallback strategies
6. ➡️ Set up monitoring and cost alerts
