-- Corrective Migration: Link Institutions and Organizations
-- Fix section_slug to use correct values

-- Institutions: MIT, Stanford, DeepMind, etc.
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Artificial Intelligence', 'Machine Learning', 'Research Methodology', 'Innovation', 'Academic Research', 'Deep Learning'],
  related_thinkers = ARRAY['Alan Turing', 'John von Neumann', 'Claude Shannon'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'institutions';

-- Organizations: Apple, Google, Microsoft, etc.
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Business Strategy', 'Innovation', 'Product Development', 'Technology Leadership', 'Software Engineering'],
  related_thinkers = ARRAY['Peter Drucker', 'Clayton Christensen', 'Steve Jobs'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'organizations';

-- Recalculate book progress
UPDATE books 
SET 
  progress_percentage = (
    SELECT ROUND(AVG(progress))::integer
    FROM master_4500 
    WHERE book_slug = 'thinking-engine'
  ),
  updated_at = NOW()
WHERE slug = 'thinking-engine';