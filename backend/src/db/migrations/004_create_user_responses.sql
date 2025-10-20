-- Migration: Create user_responses table
-- Description: Stores individual user responses for each quiz round

CREATE TABLE IF NOT EXISTS user_responses (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  story_prompt TEXT NOT NULL,
  background_image_url VARCHAR(500),
  user_answer TEXT NOT NULL,
  extracted_traits JSONB NOT NULL, -- { "F": 20, "I": 15, "S": 5, ... }
  ai_generation_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_session_round UNIQUE(session_id, round_number)
);

-- Create indexes
CREATE INDEX idx_user_responses_session ON user_responses(session_id);
CREATE INDEX idx_user_responses_round ON user_responses(session_id, round_number);
CREATE INDEX idx_user_responses_created_at ON user_responses(created_at);

-- Add comments
COMMENT ON TABLE user_responses IS 'Individual user responses for each round of a quiz session';
COMMENT ON COLUMN user_responses.story_prompt IS 'AI-generated story prompt shown to the user';
COMMENT ON COLUMN user_responses.extracted_traits IS 'Trait scores extracted from this specific response';
COMMENT ON COLUMN user_responses.ai_generation_time_ms IS 'Time taken to generate AI response (for monitoring)';


