-- Migration 1: Link Products to Frameworks & Thinkers (500 items)
-- Add intelligent related content for all products in thinking-engine-products

-- AI Products: ChatGPT, Claude, Gemini, etc.
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Transformer Architecture', 'RLHF', 'Constitutional AI', 'Alignment Research', 'Large Language Models'],
  related_thinkers = ARRAY['Ilya Sutskever', 'Dario Amodei', 'Demis Hassabis', 'Sam Altman'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (title ILIKE '%GPT%' OR title ILIKE '%Claude%' OR title ILIKE '%Gemini%' OR title ILIKE '%LLM%' OR title ILIKE '%Language Model%');

-- Developer Tools: GitHub Copilot, Cursor, etc.
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Code Generation', 'Developer Experience', 'AI Pair Programming', 'Software Engineering', 'IDE Integration'],
  related_thinkers = ARRAY['John McCarthy', 'Guido van Rossum', 'Linus Torvalds'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (title ILIKE '%Copilot%' OR title ILIKE '%Cursor%' OR title ILIKE '%IDE%' OR title ILIKE '%Developer%' OR title ILIKE '%Code%');

-- Cloud Platforms: AWS, GCP, Azure
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Distributed Systems', 'Cloud Architecture', 'Microservices', 'DevOps', 'Infrastructure as Code'],
  related_thinkers = ARRAY['Werner Vogels', 'Jeff Dean', 'Eric Brewer'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (title ILIKE '%AWS%' OR title ILIKE '%Azure%' OR title ILIKE '%GCP%' OR title ILIKE '%Cloud%' OR title ILIKE '%Platform%');

-- BCI Products: Neuralink, Kernel, etc.
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Neural Engineering', 'Brain-Machine Interface', 'Neurotechnology', 'Neural Decoding', 'Implantable Devices'],
  related_thinkers = ARRAY['Elon Musk', 'Bryan Johnson', 'Miguel Nicolelis'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (title ILIKE '%Neuralink%' OR title ILIKE '%Kernel%' OR title ILIKE '%BCI%' OR title ILIKE '%Brain%' OR title ILIKE '%Neural%');

-- ML/AI Frameworks: TensorFlow, PyTorch, etc.
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Deep Learning', 'Neural Networks', 'Machine Learning', 'Gradient Descent', 'Automatic Differentiation'],
  related_thinkers = ARRAY['Yann LeCun', 'Geoffrey Hinton', 'Yoshua Bengio', 'Andrew Ng'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (title ILIKE '%TensorFlow%' OR title ILIKE '%PyTorch%' OR title ILIKE '%Keras%' OR title ILIKE '%Framework%' OR title ILIKE '%Library%');

-- Robotics Products
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Robotics', 'Computer Vision', 'Motion Planning', 'Sensor Fusion', 'Autonomous Systems'],
  related_thinkers = ARRAY['Sebastian Thrun', 'Rodney Brooks', 'Andrew Ng'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (title ILIKE '%Robot%' OR title ILIKE '%Autonomous%' OR title ILIKE '%Vision%');

-- Data/Analytics Products
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Data Science', 'Analytics', 'Data Visualization', 'Business Intelligence', 'Statistical Analysis'],
  related_thinkers = ARRAY['John Tukey', 'Edward Tufte', 'Hadley Wickham'],
  progress = LEAST(progress + 5, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (title ILIKE '%Data%' OR title ILIKE '%Analytics%' OR title ILIKE '%Tableau%' OR title ILIKE '%Visualization%');

-- Catch-all for remaining products without links
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Software Engineering', 'Product Development', 'Innovation', 'Technology Strategy'],
  related_thinkers = ARRAY['Alan Turing', 'John von Neumann', 'Claude Shannon'],
  progress = LEAST(progress + 5, 85)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-products'
  AND exemplar_type = 'technology'
  AND (related_frameworks IS NULL OR array_length(related_frameworks, 1) IS NULL OR array_length(related_frameworks, 1) = 0);