-- Migration 2: Link Institutions to Research Areas (450 items)
-- Connect academic/research institutions to their contributions

-- MIT CSAIL
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Symbolic AI', 'Lisp Machines', 'Knowledge Representation', 'Expert Systems', 'Logic Programming', 'Natural Language Processing', 'Computer Vision'],
  related_thinkers = ARRAY['Marvin Minsky', 'John McCarthy', 'Seymour Papert', 'Hal Abelson'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%MIT%CSAIL%';

-- Stanford AI Lab
UPDATE master_4500
SET 
  related_frameworks = ARRAY['SHRDLU', 'Expert Systems', 'Deep Learning', 'Transformers', 'Reinforcement Learning', 'Natural Language Understanding', 'Knowledge Graphs'],
  related_thinkers = ARRAY['John McCarthy', 'Terry Winograd', 'Andrew Ng', 'Fei-Fei Li', 'Christopher Manning'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Stanford%';

-- DeepMind
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Reinforcement Learning', 'AlphaGo', 'AlphaFold', 'Protein Folding', 'Deep Q-Networks', 'Monte Carlo Tree Search', 'Neural Networks'],
  related_thinkers = ARRAY['Demis Hassabis', 'David Silver', 'Shane Legg', 'Mustafa Suleyman'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%DeepMind%';

-- OpenAI
UPDATE master_4500
SET 
  related_frameworks = ARRAY['GPT', 'RLHF', 'Alignment Research', 'Constitutional AI', 'Large Language Models', 'Transformer Architecture', 'Safety Research'],
  related_thinkers = ARRAY['Sam Altman', 'Ilya Sutskever', 'Greg Brockman', 'Dario Amodei', 'Paul Christiano'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%OpenAI%';

-- Google Brain / Google AI
UPDATE master_4500
SET 
  related_frameworks = ARRAY['TensorFlow', 'Neural Architecture Search', 'Transformers', 'BERT', 'Attention Mechanism', 'Deep Learning', 'TPU Architecture'],
  related_thinkers = ARRAY['Jeff Dean', 'Geoffrey Hinton', 'Ian Goodfellow', 'Ashish Vaswani'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND (title ILIKE '%Google%Brain%' OR title ILIKE '%Google%AI%' OR title ILIKE '%Google Research%');

-- Meta AI (Facebook AI Research)
UPDATE master_4500
SET 
  related_frameworks = ARRAY['PyTorch', 'LLaMA', 'Computer Vision', 'Self-Supervised Learning', 'Convolutional Neural Networks', 'Vision Transformers'],
  related_thinkers = ARRAY['Yann LeCun', 'Joelle Pineau', 'Jerome Pesenti'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND (title ILIKE '%Meta%' OR title ILIKE '%Facebook%AI%' OR title ILIKE '%FAIR%');

-- CMU (Carnegie Mellon)
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Robotics', 'Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Autonomous Systems', 'Neural Networks'],
  related_thinkers = ARRAY['Herbert Simon', 'Allen Newell', 'Sebastian Thrun', 'Tom Mitchell'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Carnegie%Mellon%';

-- Berkeley AI Research (BAIR)
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Deep Reinforcement Learning', 'Robotics', 'Computer Vision', 'Neural Networks', 'Imitation Learning', 'Policy Gradient Methods'],
  related_thinkers = ARRAY['Stuart Russell', 'Pieter Abbeel', 'Jitendra Malik', 'Trevor Darrell'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Berkeley%';

-- Allen Institute for AI
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Natural Language Processing', 'Common Sense Reasoning', 'Knowledge Graphs', 'Question Answering', 'Semantic Understanding'],
  related_thinkers = ARRAY['Paul Allen', 'Oren Etzioni', 'Yejin Choi'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Allen%Institute%';

-- Microsoft Research
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Speech Recognition', 'Cognitive Computing', 'Azure AI'],
  related_thinkers = ARRAY['Bill Gates', 'Satya Nadella', 'Eric Horvitz', 'Jianfeng Gao'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Microsoft%Research%';

-- IBM Research (including Watson)
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Expert Systems', 'Watson', 'Question Answering', 'Natural Language Processing', 'Cognitive Computing', 'Knowledge Representation'],
  related_thinkers = ARRAY['John McCarthy', 'Herbert Simon', 'Arthur Samuel'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%IBM%';

-- Oxford / Cambridge AI/ML
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Machine Learning', 'Bayesian Methods', 'Neural Networks', 'Computational Neuroscience', 'Probabilistic Models'],
  related_thinkers = ARRAY['Alan Turing', 'Geoffrey Hinton', 'Zoubin Ghahramani'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND (title ILIKE '%Oxford%' OR title ILIKE '%Cambridge%');

-- Toronto (Vector Institute)
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Deep Learning', 'Neural Networks', 'Backpropagation', 'Convolutional Networks', 'Recurrent Networks'],
  related_thinkers = ARRAY['Geoffrey Hinton', 'Yoshua Bengio', 'Yann LeCun'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Toronto%';

-- Montreal (MILA)
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Deep Learning', 'Generative Models', 'Neural Networks', 'Representation Learning', 'Attention Mechanisms'],
  related_thinkers = ARRAY['Yoshua Bengio', 'Aaron Courville', 'Hugo Larochelle'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Montreal%';

-- Anthropic
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Constitutional AI', 'RLHF', 'AI Safety', 'Alignment Research', 'Large Language Models', 'Claude'],
  related_thinkers = ARRAY['Dario Amodei', 'Daniela Amodei', 'Chris Olah', 'Sam McCandlish'],
  progress = LEAST(progress + 10, 90)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND title ILIKE '%Anthropic%';

-- Catch-all for remaining institutions without links
UPDATE master_4500
SET 
  related_frameworks = ARRAY['Artificial Intelligence', 'Machine Learning', 'Research Methodology', 'Innovation', 'Academic Research'],
  related_thinkers = ARRAY['Alan Turing', 'John von Neumann', 'Claude Shannon'],
  progress = LEAST(progress + 5, 85)
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-institutions'
  AND (related_frameworks IS NULL OR array_length(related_frameworks, 1) IS NULL OR array_length(related_frameworks, 1) = 0);