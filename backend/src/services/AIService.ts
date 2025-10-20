import OpenAI from 'openai';
import config from '../config';
import { TraitScores } from '../../../shared/types/quiz';

// Hardcoded initial story prompt for round 1
const INITIAL_FANTASY_PROMPT = `You awaken in a mystical realm where magic flows through every living thing. Ancient ruins surround you, and three paths diverge before you: a shadowy forest trail, a sunlit mountain pass, and a mysterious underground passage marked with glowing runes. What do you do?`;

export class AIService {
  private openai: OpenAI | null = null;
  private useMockMode: boolean;

  constructor() {
    // Use mock mode if no API key is provided
    this.useMockMode = !config.openai.apiKey || config.openai.apiKey.length === 0;

    if (!this.useMockMode) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
  }

  /**
   * Generate story prompt based on user's answer
   * Round 1: Returns hardcoded prompt
   * Rounds 2+: Generates AI prompt based on previous answer
   */
  async generateStoryPrompt(
    roundNumber: number,
    previousAnswer: string | null,
    theme: string
  ): Promise<{ prompt: string; generationTimeMs: number }> {
    const startTime = Date.now();

    // Round 1: Always return hardcoded prompt
    if (roundNumber === 1) {
      return {
        prompt: INITIAL_FANTASY_PROMPT,
        generationTimeMs: Date.now() - startTime,
      };
    }

    // Rounds 2+: Generate AI prompt
    if (this.useMockMode) {
      return this.generateMockStoryPrompt(previousAnswer, theme, startTime);
    }

    return this.generateRealStoryPrompt(previousAnswer, theme, startTime);
  }

  private async generateRealStoryPrompt(
    previousAnswer: string | null,
    theme: string,
    startTime: number
  ): Promise<{ prompt: string; generationTimeMs: number }> {
    try {
      const systemPrompt = `You are a creative storyteller for an interactive ${theme}-themed personality quiz. Generate the next phase of the story based on the user's previous choice. The story should:
- Be 2-4 sentences long
- Present a new scenario or challenge
- Offer implicit choices (not explicit options)
- Be engaging and immersive
- Match the ${theme} theme
Do not ask explicit questions. Just describe the situation naturally.`;

      const userPrompt = `The user's previous action: "${previousAnswer}"\n\nGenerate the next story phase:`;

      const completion = await this.openai!.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      });

      const prompt = completion.choices[0]?.message?.content || 'Continue your journey...';

      return {
        prompt: prompt.trim(),
        generationTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      console.error('AI story generation error:', error);
      // Fallback to mock on error
      return this.generateMockStoryPrompt(previousAnswer, theme, startTime);
    }
  }

  private async generateMockStoryPrompt(
    previousAnswer: string | null,
    _theme: string,
    startTime: number
  ): Promise<{ prompt: string; generationTimeMs: number }> {
    // Mock story prompts for testing
    const mockPrompts = [
      'You encounter a wise sage who offers you a cryptic riddle. The answer could unlock ancient knowledge or lead you astray.',
      'A sudden storm forces you to seek shelter in a nearby cave. Inside, you discover mysterious artifacts glowing with otherworldly energy.',
      'You meet a group of travelers at a crossroads. They debate heatedly about which direction offers the safest passage.',
      'A magical creature blocks your path, studying you intently. It seems to be testing your intentions.',
      'You find yourself in a grand hall filled with mirrors. Each reflection shows a different version of yourself making different choices.',
    ];

    // Select a prompt based on previous answer length (for variety)
    const index = previousAnswer ? previousAnswer.length % mockPrompts.length : 0;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      prompt: mockPrompts[index],
      generationTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Extract trait scores from user's answer using AI
   * Returns scores for all 8 dimensions (F, I, S, G, E, N, A, D)
   */
  async extractTraitScores(answer: string): Promise<{
    traits: Partial<TraitScores>;
    generationTimeMs: number;
  }> {
    const startTime = Date.now();

    if (this.useMockMode) {
      return this.extractMockTraitScores(answer, startTime);
    }

    return this.extractRealTraitScores(answer, startTime);
  }

  private async extractRealTraitScores(
    answer: string,
    startTime: number
  ): Promise<{ traits: Partial<TraitScores>; generationTimeMs: number }> {
    try {
      const systemPrompt = `You are a personality analysis AI. Analyze the user's response and assign scores (0-20) for each trait dimension based on how strongly their answer reflects that trait. Return ONLY a JSON object with the scores.

Trait dimensions:
- F (Focused): Attention to detail, concentration, methodical approach
- I (Independence): Self-reliance, autonomous decision-making
- S (Sensing): Practical, concrete, hands-on approach
- G (Grounded): Stability, routine, risk-aversion
- E (Exploratory): Curiosity, innovation, trying new things
- N (Network): Social, collaborative, relationship-focused
- A (Analytical): Logical reasoning, systematic thinking
- D (Driven): Goal-oriented, ambitious, competitive

Return format: {"F": 15, "I": 10, "S": 12, "G": 8, "E": 18, "N": 14, "A": 11, "D": 16}`;

      const completion = await this.openai!.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this response: "${answer}"` },
        ],
        max_tokens: 150,
        temperature: 0.3, // Lower temperature for consistency
      });

      const content = completion.choices[0]?.message?.content || '{}';
      const traits = JSON.parse(content);

      return {
        traits,
        generationTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      console.error('AI trait extraction error:', error);
      // Fallback to mock on error
      return this.extractMockTraitScores(answer, startTime);
    }
  }

  private async extractMockTraitScores(
    answer: string,
    startTime: number
  ): Promise<{ traits: Partial<TraitScores>; generationTimeMs: number }> {
    // Generate deterministic scores based on answer characteristics
    const length = answer.length;
    const wordCount = answer.split(' ').length;
    const hasQuestion = answer.includes('?');
    const hasExclamation = answer.includes('!');
    const hasWords = {
      explore: /explore|search|investigate|discover/i.test(answer),
      think: /think|analyze|consider|ponder/i.test(answer),
      together: /together|help|team|group/i.test(answer),
      careful: /careful|cautious|safe|plan/i.test(answer),
      action: /act|do|go|move|run/i.test(answer),
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const traits: Partial<TraitScores> = {
      F: Math.min(20, 8 + (length > 100 ? 8 : 4) + (wordCount > 15 ? 4 : 0)),
      I: Math.min(20, 10 + (hasWords.think ? 6 : 0) + (!hasWords.together ? 4 : 0)),
      S: Math.min(20, 10 + (hasWords.careful ? 6 : 0) + (length < 50 ? 4 : 0)),
      G: Math.min(20, 8 + (hasWords.careful ? 8 : 0) + (!hasWords.explore ? 4 : 0)),
      E: Math.min(20, 12 + (hasWords.explore ? 6 : 0) + (hasExclamation ? 2 : 0)),
      N: Math.min(20, 10 + (hasWords.together ? 8 : 0) + (hasQuestion ? 2 : 0)),
      A: Math.min(20, 10 + (hasWords.think ? 6 : 0) + (length > 80 ? 4 : 0)),
      D: Math.min(20, 12 + (hasWords.action ? 6 : 0) + (hasExclamation ? 2 : 0)),
    };

    return {
      traits,
      generationTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Generate background image for story prompt
   * Returns image URL (mock or real DALL-E)
   */
  async generateBackgroundImage(storyPrompt: string): Promise<{
    imageUrl: string | null;
    generationTimeMs: number;
  }> {
    const startTime = Date.now();

    if (this.useMockMode) {
      return this.generateMockImage(storyPrompt, startTime);
    }

    return this.generateRealImage(storyPrompt, startTime);
  }

  private async generateRealImage(
    storyPrompt: string,
    startTime: number
  ): Promise<{ imageUrl: string | null; generationTimeMs: number }> {
    try {
      const imagePrompt = `A cartoony, colorful illustration for a fantasy story scene: ${storyPrompt.substring(0, 200)}. Style: whimsical, friendly, vibrant colors, suitable for all ages.`;

      const response = await this.openai!.images.generate({
        model: config.openai.imageModel,
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid',
      });

      return {
        imageUrl: response.data?.[0]?.url || null,
        generationTimeMs: Date.now() - startTime,
      };
    } catch (error) {
      console.error('AI image generation error:', error);
      return this.generateMockImage(storyPrompt, startTime);
    }
  }

  private async generateMockImage(
    _storyPrompt: string,
    startTime: number
  ): Promise<{ imageUrl: string | null; generationTimeMs: number }> {
    // Return placeholder image URL
    await new Promise((resolve) => setTimeout(resolve, 50));

    return {
      imageUrl: 'https://via.placeholder.com/1024x1024/6366f1/ffffff?text=Fantasy+Scene',
      generationTimeMs: Date.now() - startTime,
    };
  }
}

export default AIService;
