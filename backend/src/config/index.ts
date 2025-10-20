import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    port: number;
    host: string;
    nodeEnv: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    maxConnections: number;
  };
  redis: {
    host: string;
    port: number;
    sessionTTL: number; // in seconds
  };
  openai: {
    apiKey: string;
    model: string;
    imageModel: string;
    maxTokens: number;
    temperature: number;
  };
  ai: {
    retryAttempts: number;
    retryDelayMs: number;
    timeoutMs: number;
  };
  quiz: {
    defaultRounds: number;
    minAnswerLength: number;
    maxAnswerLength: number;
  };
  security: {
    corsOrigin: string;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
  logging: {
    level: string;
    format: string;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'personality_quiz',
    user: process.env.DB_USER || 'quiz_user',
    password: process.env.DB_PASSWORD || 'quiz_password_dev',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    sessionTTL: parseInt(process.env.REDIS_SESSION_TTL || '3600', 10),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    imageModel: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500', 10),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  },
  ai: {
    retryAttempts: parseInt(process.env.AI_RETRY_ATTEMPTS || '3', 10),
    retryDelayMs: parseInt(process.env.AI_RETRY_DELAY_MS || '1000', 10),
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '30000', 10),
  },
  quiz: {
    defaultRounds: parseInt(process.env.QUIZ_DEFAULT_ROUNDS || '6', 10),
    minAnswerLength: parseInt(process.env.QUIZ_MIN_ANSWER_LENGTH || '1', 10),
    maxAnswerLength: parseInt(process.env.QUIZ_MAX_ANSWER_LENGTH || '500', 10),
  },
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'json',
  },
};

export default config;

