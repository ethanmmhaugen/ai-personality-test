// Shared type definitions for quiz application

export type SessionStatus = "in_progress" | "completed" | "expired";

export interface TraitScores {
	F: number; // Focused (0-100)
	I: number; // Independence (0-100)
	S: number; // Sensing (0-100)
	G: number; // Grounded (0-100)
	E: number; // Exploratory (0-100)
	N: number; // Network (0-100)
	A: number; // Analytical (0-100)
	D: number; // Driven (0-100)
}

export interface TraitDimension {
	id: number;
	code: keyof TraitScores;
	name: string;
	description: string;
	displayOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CharacterType {
	id: number;
	name: string;
	theme: string;
	description: string;
	workStyleStrengths: string;
	interpersonalDynamics: string;
	imageUrl: string | null;
	traitProfile: TraitScores;
	createdAt: Date;
	updatedAt: Date;
}

export interface QuizSession {
	id: string; // UUID
	theme: string;
	status: SessionStatus;
	currentRound: number;
	totalRounds: number;
	accumulatedTraits: Partial<TraitScores>;
	assignedCharacterId: number | null;
	startedAt: Date;
	completedAt: Date | null;
	expiresAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserResponse {
	id: number;
	sessionId: string;
	roundNumber: number;
	storyPrompt: string;
	backgroundImageUrl: string | null;
	userAnswer: string;
	extractedTraits: Partial<TraitScores>;
	aiGenerationTimeMs: number | null;
	createdAt: Date;
}

export interface QuizStartResponse {
	sessionId: string;
	theme: string;
	totalRounds: number;
	currentRound: number;
	initialPrompt: string;
	backgroundImageUrl: string | null;
}

export interface QuizRespondRequest {
	answer: string;
}

export interface QuizRespondResponse {
	sessionId: string;
	currentRound: number;
	totalRounds: number;
	nextPrompt?: string;
	backgroundImageUrl?: string | null;
	isComplete: boolean;
}

export interface QuizResultsResponse {
	sessionId: string;
	character: CharacterType;
	traitScores: TraitScores;
	completedAt: Date;
}

export interface QuizStatusResponse {
	sessionId: string;
	theme: string;
	status: SessionStatus;
	currentRound: number;
	totalRounds: number;
}

