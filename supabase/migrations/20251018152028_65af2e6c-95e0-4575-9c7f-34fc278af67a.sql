-- Corrective Migration: Link Products to Frameworks & Thinkers
-- Fix section_slug from 'thinking-engine-products' to 'products'

-- AI Products: ChatGPT, Claude, Gemini, etc.
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Transformer Architecture', 'RLHF', 'Constitutional AI', 'Alignment Research', 'Large Language Models'],
  related_thinkers = ARRAY['Ilya Sutskever', 'Dario Amodei', 'Demis Hassabis', 'Sam Altman'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'products'
  AND (title ILIKE '%GPT%' OR title ILIKE '%Claude%' OR title ILIKE '%Gemini%' OR title ILIKE '%LLM%' OR title ILIKE '%Language Model%');

-- Developer Tools
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Code Generation', 'Developer Experience', 'AI Pair Programming', 'Software Engineering', 'IDE Integration'],
  related_thinkers = ARRAY['John McCarthy', 'Guido van Rossum', 'Linus Torvalds'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'products'
  AND (title ILIKE '%Copilot%' OR title ILIKE '%Cursor%' OR title ILIKE '%IDE%' OR title ILIKE '%Developer%' OR title ILIKE '%Code%');

-- Cloud Platforms
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Distributed Systems', 'Cloud Architecture', 'Microservices', 'DevOps', 'Infrastructure as Code'],
  related_thinkers = ARRAY['Werner Vogels', 'Jeff Dean', 'Eric Brewer'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'products'
  AND (title ILIKE '%AWS%' OR title ILIKE '%Azure%' OR title ILIKE '%GCP%' OR title ILIKE '%Cloud%' OR title ILIKE '%Platform%');

-- ML/AI Frameworks
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Deep Learning', 'Neural Networks', 'Machine Learning', 'Gradient Descent', 'Automatic Differentiation'],
  related_thinkers = ARRAY['Yann LeCun', 'Geoffrey Hinton', 'Yoshua Bengio', 'Andrew Ng'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'products'
  AND (title ILIKE '%TensorFlow%' OR title ILIKE '%PyTorch%' OR title ILIKE '%Keras%' OR title ILIKE '%Framework%' OR title ILIKE '%Library%' OR title ILIKE '%JAX%');

-- Catch-all for remaining products
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Software Engineering', 'Product Development', 'Innovation', 'Technology Strategy'],
  related_thinkers = ARRAY['Alan Turing', 'John von Neumann', 'Claude Shannon'],
  progress = LEAST(progress + 5, 85)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'products'
  AND (related_frameworks IS NULL OR array_length(related_frameworks, 1) IS NULL OR array_length(related_frameworks, 1) = 0);