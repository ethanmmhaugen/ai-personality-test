-- Migration: Create quiz_sessions table
-- Description: Stores completed quiz sessions and final results

CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'expired');

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme VARCHAR(50) NOT NULL DEFAULT 'fantasy',
  status session_status NOT NULL DEFAULT 'in_progress',
  current_round INTEGER NOT NULL DEFAULT 1,
  total_rounds INTEGER NOT NULL DEFAULT 6,
  accumulated_traits JSONB NOT NULL DEFAULT '{}', -- { "F": 65, "I": 72, ... }
  assigned_character_id INTEGER REFERENCES character_types(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_quiz_sessions_status ON quiz_sessions(status);
CREATE INDEX idx_quiz_sessions_started_at ON quiz_sessions(started_at);
CREATE INDEX idx_quiz_sessions_expires_at ON quiz_sessions(expires_at);
CREATE INDEX idx_quiz_sessions_character ON quiz_sessions(assigned_character_id);

-- Add comments
COMMENT ON TABLE quiz_sessions IS 'Tracks quiz sessions from start to completion';
COMMENT ON COLUMN quiz_sessions.accumulated_traits IS 'Running total of trait scores across all rounds';
COMMENT ON COLUMN quiz_sessions.assigned_character_id IS 'Final character type assigned after quiz completion';


