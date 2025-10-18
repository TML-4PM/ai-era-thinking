-- Migration 5: Recalculate Book Progress Percentage
-- Update the books table to reflect the actual completion percentage

-- Update the thinking-engine book progress
UPDATE books 
SET 
  progress_percentage = (
    SELECT ROUND(AVG(progress))::integer
    FROM master_4500 
    WHERE book_slug = 'thinking-engine'
  ),
  updated_at = NOW()
WHERE slug = 'thinking-engine';

-- Verify the update with a comment
COMMENT ON TABLE books IS 'Book progress is automatically calculated from master_4500 exemplar progress scores';