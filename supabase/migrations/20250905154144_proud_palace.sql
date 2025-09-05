/*
  # Add personal context field to user goals

  1. New Columns
    - `personal_context` (text, nullable)
      - Stores user's personal fitness journey and context
      - Used by AI to generate personalized workout plans

  2. Indexes
    - Full-text search index on personal_context for future search functionality
    - Uses PostgreSQL's built-in text search capabilities

  3. Notes
    - Field is nullable to support existing records
    - GIN index enables efficient text search queries
    - Uses English language configuration for text search
*/

-- Add personal_context field to user_goals table
ALTER TABLE public.user_goals 
ADD COLUMN IF NOT EXISTS personal_context TEXT;

-- Add index for better search if needed later
CREATE INDEX IF NOT EXISTS idx_user_goals_personal_context 
ON public.user_goals 
USING gin(to_tsvector('english', personal_context));