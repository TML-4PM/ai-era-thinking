-- Phase 7, Step 2: Build Knowledge Graph Links
-- Link Products to Frameworks/Thinkers, Institutions to Research, Organizations to Founders

-- Link major AI products to relevant frameworks and thinkers
UPDATE master_4500
SET 
  related_frameworks = CASE
    WHEN title ILIKE '%chatgpt%' OR title ILIKE '%gpt%' THEN ARRAY['Transformer Architecture', 'RLHF', 'InstructGPT', 'Few-Shot Learning']
    WHEN title ILIKE '%tensorflow%' THEN ARRAY['Deep Learning', 'Computational Graphs', 'Automatic Differentiation', 'Distributed Training']
    WHEN title ILIKE '%pytorch%' THEN ARRAY['Dynamic Computation Graphs', 'Deep Learning', 'Neural Networks', 'Gradient Descent']
    WHEN title ILIKE '%kubernetes%' THEN ARRAY['Container Orchestration', 'Microservices', 'DevOps', 'Infrastructure as Code']
    WHEN title ILIKE '%neuralink%' THEN ARRAY['Brain-Computer Interface', 'Neural Engineering', 'Neuroprosthetics', 'Neural Decoding']
    WHEN title ILIKE '%copilot%' THEN ARRAY['Code Generation', 'Large Language Models', 'Transformer Architecture', 'Autocomplete']
    WHEN title ILIKE '%alphago%' OR title ILIKE '%alphazero%' THEN ARRAY['Reinforcement Learning', 'Monte Carlo Tree Search', 'Deep Q-Networks', 'Self-Play']
    WHEN title ILIKE '%bert%' THEN ARRAY['Transformer Architecture', 'Bidirectional Encoding', 'Masked Language Modeling', 'Transfer Learning']
    ELSE related_frameworks
  END,
  related_thinkers = CASE
    WHEN title ILIKE '%chatgpt%' OR title ILIKE '%gpt%' THEN ARRAY['Sam Altman', 'Ilya Sutskever', 'Greg Brockman', 'John Schulman']
    WHEN title ILIKE '%tensorflow%' THEN ARRAY['Jeff Dean', 'Rajat Monga', 'Geoffrey Hinton']
    WHEN title ILIKE '%pytorch%' THEN ARRAY['Soumith Chintala', 'Yann LeCun', 'Adam Paszke']
    WHEN title ILIKE '%neuralink%' THEN ARRAY['Elon Musk', 'DJ Seo', 'Max Hodak']
    WHEN title ILIKE '%alphago%' OR title ILIKE '%alphazero%' THEN ARRAY['Demis Hassabis', 'David Silver', 'Thore Graepel']
    WHEN title ILIKE '%bert%' THEN ARRAY['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee']
    ELSE related_thinkers
  END,
  progress = CASE
    WHEN (related_frameworks IS NULL OR array_length(related_frameworks, 1) < 2) AND exemplar_type = 'technology' THEN LEAST(progress + 5, 80)
    ELSE progress
  END,
  updated_at = now()
WHERE book_slug = 'thinking-engine'
  AND exemplar_type = 'technology'
  AND section_slug = 'thinking-engine-products';

-- Link major institutions to their research contributions
UPDATE master_4500
SET 
  related_frameworks = CASE
    WHEN title ILIKE '%mit%' AND title ILIKE '%csail%' THEN ARRAY['Symbolic AI', 'Lisp Machines', 'Knowledge Representation', 'Expert Systems', 'Robotics']
    WHEN title ILIKE '%stanford%' AND title ILIKE '%ai%' THEN ARRAY['SHRDLU', 'Expert Systems', 'Natural Language Processing', 'Computer Vision', 'Deep Learning']
    WHEN title ILIKE '%deepmind%' THEN ARRAY['Reinforcement Learning', 'AlphaGo', 'AlphaFold', 'Protein Folding', 'Deep Q-Networks']
    WHEN title ILIKE '%openai%' THEN ARRAY['GPT Series', 'DALL-E', 'Reinforcement Learning from Human Feedback', 'AI Alignment']
    WHEN title ILIKE '%anthropic%' THEN ARRAY['Constitutional AI', 'Claude', 'AI Safety', 'Interpretability Research']
    WHEN title ILIKE '%berkeley%' THEN ARRAY['Computer Vision', 'Robotics', 'Reinforcement Learning', 'Deep Learning Frameworks']
    WHEN title ILIKE '%carnegie mellon%' THEN ARRAY['Machine Learning', 'Computer Vision', 'Robotics', 'Natural Language Processing']
    WHEN title ILIKE '%google%' AND title ILIKE '%brain%' THEN ARRAY['TensorFlow', 'Transformer Architecture', 'Neural Architecture Search', 'AutoML']
    ELSE related_frameworks
  END,
  related_thinkers = CASE
    WHEN title ILIKE '%mit%' THEN ARRAY['Marvin Minsky', 'Patrick Winston', 'Rodney Brooks', 'Josh Tenenbaum']
    WHEN title ILIKE '%stanford%' THEN ARRAY['John McCarthy', 'Andrew Ng', 'Fei-Fei Li', 'Christopher Manning']
    WHEN title ILIKE '%deepmind%' THEN ARRAY['Demis Hassabis', 'Shane Legg', 'Mustafa Suleyman']
    WHEN title ILIKE '%openai%' THEN ARRAY['Sam Altman', 'Ilya Sutskever', 'Greg Brockman', 'Dario Amodei']
    WHEN title ILIKE '%anthropic%' THEN ARRAY['Dario Amodei', 'Daniela Amodei', 'Chris Olah', 'Jared Kaplan']
    WHEN title ILIKE '%berkeley%' THEN ARRAY['Stuart Russell', 'Pieter Abbeel', 'Jitendra Malik']
    WHEN title ILIKE '%carnegie mellon%' THEN ARRAY['Tom Mitchell', 'Geoffrey Hinton', 'Raj Reddy']
    WHEN title ILIKE '%google%' AND title ILIKE '%brain%' THEN ARRAY['Jeff Dean', 'Geoffrey Hinton', 'Quoc Le']
    ELSE related_thinkers
  END,
  progress = CASE
    WHEN (related_frameworks IS NULL OR array_length(related_frameworks, 1) < 3) AND exemplar_type = 'institution' THEN LEAST(progress + 5, 80)
    ELSE progress
  END,
  updated_at = now()
WHERE book_slug = 'thinking-engine'
  AND exemplar_type = 'institution'
  AND section_slug = 'thinking-engine-institutions';

-- Link organizations to their founders and key leaders
UPDATE master_4500
SET 
  related_thinkers = CASE
    WHEN title ILIKE '%openai%' THEN ARRAY['Sam Altman', 'Ilya Sutskever', 'Greg Brockman', 'Elon Musk', 'Reid Hoffman']
    WHEN title ILIKE '%anthropic%' THEN ARRAY['Dario Amodei', 'Daniela Amodei', 'Chris Olah', 'Jared Kaplan', 'Sam McCandlish']
    WHEN title ILIKE '%deepmind%' THEN ARRAY['Demis Hassabis', 'Shane Legg', 'Mustafa Suleyman']
    WHEN title ILIKE '%meta%' AND title ILIKE '%ai%' THEN ARRAY['Yann LeCun', 'Joelle Pineau', 'Jerome Pesenti']
    WHEN title ILIKE '%microsoft%' AND title ILIKE '%research%' THEN ARRAY['Eric Horvitz', 'Chris Bishop', 'Jianfeng Gao']
    WHEN title ILIKE '%google%' AND title ILIKE '%ai%' THEN ARRAY['Jeff Dean', 'Demis Hassabis', 'John Giannandrea']
    ELSE related_thinkers
  END,
  related_frameworks = CASE
    WHEN title ILIKE '%openai%' THEN ARRAY['GPT Series', 'DALL-E', 'ChatGPT', 'Reinforcement Learning from Human Feedback']
    WHEN title ILIKE '%anthropic%' THEN ARRAY['Constitutional AI', 'Claude', 'AI Safety Research']
    WHEN title ILIKE '%deepmind%' THEN ARRAY['AlphaGo', 'AlphaFold', 'Deep Q-Networks', 'Reinforcement Learning']
    WHEN title ILIKE '%meta%' AND title ILIKE '%ai%' THEN ARRAY['PyTorch', 'LLaMA', 'FAIR Research']
    ELSE related_frameworks
  END,
  progress = CASE
    WHEN (related_thinkers IS NULL OR array_length(related_thinkers, 1) < 2) AND section_slug = 'thinking-engine-organizations' THEN LEAST(progress + 5, 80)
    ELSE progress
  END,
  updated_at = now()
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-organizations';