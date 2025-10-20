-- Migration: Create character_types table
-- Description: Stores predefined character types with trait profiles

CREATE TABLE IF NOT EXISTS character_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  theme VARCHAR(50) NOT NULL DEFAULT 'fantasy',
  description TEXT NOT NULL,
  work_style_strengths TEXT NOT NULL,
  interpersonal_dynamics TEXT NOT NULL,
  image_url VARCHAR(500),
  trait_profile JSONB NOT NULL, -- { "F": 75, "I": 60, "S": 40, ... }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_character_name_theme UNIQUE(name, theme)
);

-- Create indexes
CREATE INDEX idx_character_types_theme ON character_types(theme);
CREATE INDEX idx_character_types_trait_profile ON character_types USING GIN (trait_profile);

-- Add comments
COMMENT ON TABLE character_types IS 'Predefined character types that users can be matched to';
COMMENT ON COLUMN character_types.trait_profile IS 'JSON object mapping trait codes to scores (0-100)';
COMMENT ON COLUMN character_types.theme IS 'Story theme (fantasy, office, animals, etc.)';
COMMENT ON COLUMN character_types.work_style_strengths IS 'Description of work style strengths for this character';
COMMENT ON COLUMN character_types.interpersonal_dynamics IS 'Description of interpersonal dynamics for this character';


