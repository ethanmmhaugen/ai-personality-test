-- Migration: Create trait_dimensions table
-- Description: Stores the 8 personality trait dimensions (F.I.S.G.E.N.A.D.)

CREATE TABLE IF NOT EXISTS trait_dimensions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(1) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups by code
CREATE INDEX idx_trait_dimensions_code ON trait_dimensions(code);

-- Add comment for documentation
COMMENT ON TABLE trait_dimensions IS 'Defines the 8 core personality trait dimensions used in the quiz';
COMMENT ON COLUMN trait_dimensions.code IS 'Single letter code (F, I, S, G, E, N, A, D)';
COMMENT ON COLUMN trait_dimensions.display_order IS 'Order in which traits should be displayed (1-8)';


