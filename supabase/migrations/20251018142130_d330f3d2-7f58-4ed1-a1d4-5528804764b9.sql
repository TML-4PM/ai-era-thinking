-- Comprehensive Content Seeding for The Thinking Engine
-- This migration seeds all scaffold records with descriptions, era mappings, and AI context

-- ============================================================================
-- PHASE 1: UPDATE 100 FRAMEWORKS FROM CSV DATA
-- ============================================================================

-- Update Free Energy Principle
UPDATE master_4500 
SET 
  description = 'Prediction error minimisation - the brain constantly generates predictions and updates them based on sensory input.',
  notes = 'Neuroscience foundation for BCI signal processing',
  era_on_prem = 'Foundational neuroscience theory established in traditional research settings',
  era_cloud_native = 'Computational models scaled using cloud infrastructure for signal processing',
  era_gen_ai = 'AI models predict neural patterns and minimize prediction errors',
  era_agentic_ai = 'Autonomous systems adapt based on prediction error feedback',
  ai_relevance = 'Core principle for BCI signal interpretation and adaptive neural interfaces',
  ai_era_shift = 'From theoretical neuroscience to practical AI-driven neural decoding',
  status = 'seeded',
  progress = 60
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'frameworks'
  AND title = 'Free Energy Principle';

-- Update Active Inference
UPDATE master_4500 
SET 
  description = 'Action equals perception updates - organisms act to confirm predictions and minimize surprise.',
  notes = 'Translating neural intent into adaptive behaviours',
  era_on_prem = 'Signal processing for neural intent detection',
  era_cloud_native = 'Distributed inference systems for behavior prediction',
  era_gen_ai = 'AI interprets neural signals as behavioral intent',
  era_agentic_ai = 'Autonomous agents translate neural commands into actions',
  era_bci = 'Direct brain-to-action interfaces using active inference principles',
  ai_relevance = 'Enables BCIs to predict and execute user intentions before explicit commands',
  ai_era_shift = 'From passive signal reading to active intention prediction',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'frameworks'
  AND title = 'Active Inference';

-- Update Hebbian Learning
UPDATE master_4500 
SET 
  description = 'Neurons that fire together wire together - synaptic connections strengthen with correlated activity.',
  notes = 'Neuroplasticity models in rehabilitation',
  era_on_prem = 'Basic neuroscience principle in traditional research',
  era_cloud_native = 'Cloud-based neuroplasticity tracking systems',
  era_gen_ai = 'AI models simulate and predict neural rewiring patterns',
  era_agentic_ai = 'Adaptive systems optimize rehabilitation protocols',
  era_bci = 'BCIs leverage Hebbian learning for neural rehabilitation',
  ai_relevance = 'Foundation for adaptive BCIs that strengthen neural pathways through use',
  ai_era_shift = 'From observational neuroscience to AI-optimized neural training',
  status = 'seeded',
  progress = 60
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'frameworks'
  AND title = 'Hebbian Learning';

-- Update all remaining frameworks with basic seeding
UPDATE master_4500 
SET 
  status = 'seeded',
  progress = 55,
  ai_relevance = 'Framework applicable to AI-enhanced cognitive and organizational systems',
  ai_era_shift = 'Evolved from traditional implementation to AI-augmented application'
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'frameworks'
  AND status = 'scaffold'
  AND title IN (
    'Neural Darwinism', 'Network Neuroscience', 'Biopsychosocial Model',
    'Self-Organised Criticality', 'Panarchy (Adaptive Cycle)', 'Complex Adaptive Systems',
    'Cynefin', 'S-Curve / Sigmoid', 'Diffusion of Innovations', 'Learning Health System',
    'OODA Loop', 'Systems Thinking (Meadows)', 'Resilience Engineering',
    'High Reliability Org (HRO)', 'Dynamic Capabilities (Teece)', 'Core–Edge Innovation',
    'Spiral Dynamics', 'Integral Theory (Wilber)', 'Antifragility (Taleb)',
    'Appreciative Inquiry', 'Kotter 8 Steps', 'Prosci ADKAR', 'McKinsey 7-S',
    'Viable System Model (Beer)', 'Stakeholder Theory (Freeman)', 'Public Value Framework',
    'Commons Theory (Ostrom)', 'Game Theory (Nash)', 'Trust Game',
    'Principal–Agent Problem', 'Belmont Report', 'Triple Bottom Line',
    'Doughnut Economics (Raworth)', 'ESG / B-Corp Principles', 'Gartner Hype Cycle',
    'Technology Readiness Levels (TRL)', 'Horizon Scanning', 'Blue Ocean Strategy',
    'Christensen Disruption', 'Porter''s Value Chain', 'Platform Economy Models',
    'Network Effects', 'Metcalfe''s Law', 'Jevons Paradox', 'Amara''s Law',
    'Belmont 2.0 (extended ethics)', 'IEEE Ethically Aligned Design', 'UNESCO AI Ethics',
    'OECD AI Principles', 'Responsible Innovation (Stilgoe)', 'FAT ML Principles',
    'Algorithmic Accountability', 'Differential Privacy', 'Human-in-the-Loop AI',
    'Continuous Learning Culture (SAFe)', 'DevOps CALMS', 'SRE (Google)',
    'ITIL v3/v4', 'SIAM', 'COBIT', 'ISO 38500', 'TOGAF', 'IT4IT',
    'NIST Cybersecurity Framework', 'Zero Trust', 'Data Mesh', 'Data Fabric',
    'Open Innovation', 'Knowledge Spiral (Nonaka)', 'Design Thinking',
    'Lean Startup', 'Agile Manifesto', 'SAFe (Scaled Agile)', 'Kanban',
    'Scrum', 'PRINCE2', 'BABOK', 'Six Sigma', 'Lean', 'TQM (Total Quality Mgmt)',
    'Balanced Scorecard', 'EFQM Model', 'Kaizen', 'OKRs', 'KPI Frameworks',
    'Value Stream Mapping', 'Hoshin Kanri', 'McKinsey Horizons', 'Shell Scenarios',
    'PESTEL', 'SWOT', 'Porter 5 Forces', 'BCG Matrix', 'Ansoff Matrix',
    'Tipping Point (Gladwell)', 'Black Swan (Taleb)', 'Slow Science'
  );

-- ============================================================================
-- PHASE 2: SEED PRINCIPLES (AI Ethics & Governance)
-- ============================================================================

-- Update existing principles with comprehensive content
UPDATE master_4500 
SET 
  description = CASE title
    WHEN 'Transparency' THEN 'AI systems and their decision-making processes should be open and explainable to stakeholders'
    WHEN 'Fairness' THEN 'AI systems must avoid bias and discrimination, treating all individuals and groups equitably'
    WHEN 'Accountability' THEN 'Clear responsibility and oversight mechanisms for AI system outcomes and impacts'
    WHEN 'Privacy' THEN 'Protection of personal data and individual privacy rights in AI systems'
    WHEN 'Safety' THEN 'AI systems must be secure, reliable, and operate safely under all conditions'
    ELSE 'Core principle for ethical AI development and deployment'
  END,
  notes = CASE title
    WHEN 'Transparency' THEN 'Essential for trust and regulatory compliance in AI systems'
    WHEN 'Fairness' THEN 'Critical for preventing discrimination and ensuring equitable outcomes'
    WHEN 'Accountability' THEN 'Enables governance and responsibility frameworks'
    WHEN 'Privacy' THEN 'Foundational for data protection and user rights'
    WHEN 'Safety' THEN 'Paramount for deployment in critical systems'
    ELSE 'Fundamental ethical consideration for AI systems'
  END,
  era_cloud_native = 'Principle embedded in cloud-based AI governance frameworks',
  era_gen_ai = 'Critical principle for generative AI oversight and control',
  era_agentic_ai = 'Essential for autonomous AI system governance',
  era_bci = 'Vital for cognitive interface ethics and safety',
  ai_relevance = 'Core ethical principle shaping AI development, deployment, and regulation',
  ai_era_shift = 'From theoretical ethics to enforceable AI governance requirements',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'principles'
  AND status IN ('scaffold', 'seeded');

-- ============================================================================
-- PHASE 3: SEED TECHNOLOGIES
-- ============================================================================

-- Update existing technologies
UPDATE master_4500 
SET 
  description = CASE title
    WHEN 'Machine Learning' THEN 'Algorithms that improve automatically through experience and data'
    WHEN 'Neural Networks' THEN 'Computing systems inspired by biological neural networks'
    WHEN 'Natural Language Processing' THEN 'AI capability to understand, interpret, and generate human language'
    WHEN 'Computer Vision' THEN 'AI systems that derive information from digital images and videos'
    WHEN 'Reinforcement Learning' THEN 'Learning paradigm where agents learn through trial, error, and rewards'
    ELSE 'Core AI/ML technology enabling intelligent systems'
  END,
  era_on_prem = 'Initial development in traditional computing environments',
  era_cloud_native = 'Scaled through distributed cloud infrastructure',
  era_gen_ai = 'Enhanced with generative capabilities and large-scale models',
  era_agentic_ai = 'Integrated into autonomous decision-making systems',
  era_bci = 'Applied to brain-computer interface applications',
  ai_relevance = 'Foundational technology for modern AI systems and applications',
  ai_era_shift = 'From narrow task automation to general-purpose intelligence',
  status = 'seeded',
  progress = 70
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'technologies'
  AND status IN ('scaffold', 'seeded');

-- ============================================================================
-- PHASE 4: SEED ROLES
-- ============================================================================

-- Update existing roles with AI context
UPDATE master_4500 
SET 
  description = CASE title
    WHEN 'AI Ethics Officer' THEN 'Responsible for ensuring AI systems align with ethical principles and societal values'
    WHEN 'ML Engineer' THEN 'Develops and deploys machine learning models and systems'
    WHEN 'Data Scientist' THEN 'Extracts insights from data using statistical and ML techniques'
    WHEN 'AI Product Manager' THEN 'Defines strategy and roadmap for AI-powered products'
    WHEN 'Prompt Engineer' THEN 'Optimizes interactions with large language models through prompt design'
    ELSE 'Professional role in AI/ML ecosystem'
  END,
  notes = CASE title
    WHEN 'AI Ethics Officer' THEN 'Emerging role critical for responsible AI development'
    WHEN 'ML Engineer' THEN 'High demand role across industries'
    WHEN 'Data Scientist' THEN 'Foundation role for data-driven AI systems'
    WHEN 'AI Product Manager' THEN 'Bridges technical and business AI strategy'
    WHEN 'Prompt Engineer' THEN 'New role emerging with generative AI adoption'
    ELSE 'Role evolving with AI advancement'
  END,
  era_cloud_native = 'Role scaled with cloud AI infrastructure',
  era_gen_ai = 'Role transformed by generative AI capabilities',
  era_agentic_ai = 'Role focuses on autonomous AI system oversight',
  ai_relevance = 'Professional role essential for AI system development and governance',
  ai_era_shift = 'From traditional IT/business roles to AI-specialized positions',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'roles'
  AND status IN ('scaffold', 'seeded');

-- ============================================================================
-- PHASE 5: SEED INSTITUTIONS
-- ============================================================================

-- Update institutions with research and governance context
UPDATE master_4500 
SET 
  description = 'Leading institution in AI research, development, or governance',
  notes = 'Major contributor to AI advancement and policy',
  era_on_prem = 'Traditional research in institutional settings',
  era_cloud_native = 'Research scaled with cloud infrastructure',
  era_gen_ai = 'Focus on generative AI research and ethics',
  era_agentic_ai = 'Research on autonomous AI systems',
  era_bci = 'Exploring cognitive interfaces and neural technology',
  ai_relevance = 'Shapes AI research directions, standards, and policies',
  ai_era_shift = 'From academic research to applied AI development and governance',
  status = 'seeded',
  progress = 50
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'institutions'
  AND status = 'scaffold';

-- ============================================================================
-- PHASE 6: SEED ORGANIZATIONS
-- ============================================================================

UPDATE master_4500 
SET 
  description = 'Organization involved in AI development, deployment, or governance',
  notes = 'Key player in AI ecosystem',
  era_cloud_native = 'Organization leverages cloud AI infrastructure',
  era_gen_ai = 'Organization develops or uses generative AI',
  era_agentic_ai = 'Organization builds autonomous AI systems',
  ai_relevance = 'Contributes to AI industry development and standards',
  ai_era_shift = 'Adapting business models for AI-first operations',
  status = 'seeded',
  progress = 45
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'organizations'
  AND status = 'scaffold';

-- ============================================================================
-- PHASE 7: SEED DOCTRINES
-- ============================================================================

UPDATE master_4500 
SET 
  description = 'Philosophical or operational doctrine relevant to AI systems',
  notes = 'Guiding principle for AI development or deployment',
  era_gen_ai = 'Doctrine applied to generative AI contexts',
  era_agentic_ai = 'Doctrine governs autonomous AI behavior',
  ai_relevance = 'Shapes philosophical and operational approach to AI',
  ai_era_shift = 'From human-centric to AI-inclusive doctrines',
  status = 'seeded',
  progress = 40
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'doctrines'
  AND status = 'scaffold';

-- ============================================================================
-- PHASE 8: SEED CULTURES
-- ============================================================================

UPDATE master_4500 
SET 
  description = 'Cultural perspective or practice relevant to AI adoption',
  notes = 'Cultural factor influencing AI integration',
  era_gen_ai = 'Cultural adaptation to generative AI',
  era_agentic_ai = 'Cultural response to autonomous AI systems',
  era_bci = 'Cultural perspectives on cognitive interfaces',
  ai_relevance = 'Cultural factors shape AI acceptance and use patterns',
  ai_era_shift = 'From technology resistance to AI-augmented culture',
  status = 'seeded',
  progress = 40
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'cultures'
  AND status = 'scaffold';

-- ============================================================================
-- PHASE 9: SEED PRODUCTS
-- ============================================================================

UPDATE master_4500 
SET 
  description = 'AI-powered product or platform',
  notes = 'Commercial AI product or service',
  era_cloud_native = 'Product built on cloud AI infrastructure',
  era_gen_ai = 'Product leverages generative AI capabilities',
  era_agentic_ai = 'Product features autonomous AI agents',
  ai_relevance = 'Commercial AI product serving specific use cases',
  ai_era_shift = 'From traditional software to AI-native products',
  status = 'seeded',
  progress = 45
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'products'
  AND status = 'scaffold';

-- ============================================================================
-- PHASE 10: SEED ENVIRONMENT
-- ============================================================================

UPDATE master_4500 
SET 
  description = 'Environmental consideration or factor for AI systems',
  notes = 'Environmental impact or sustainability consideration',
  era_cloud_native = 'Environmental impact of cloud AI infrastructure',
  era_gen_ai = 'Energy and resource considerations for large AI models',
  era_agentic_ai = 'Sustainability of autonomous AI deployments',
  ai_relevance = 'Environmental sustainability factor in AI development',
  ai_era_shift = 'From unconstrained growth to sustainable AI practices',
  status = 'seeded',
  progress = 40
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'environment'
  AND status = 'scaffold';

-- ============================================================================
-- PHASE 11: SEED ENERGY/FORCES
-- ============================================================================

UPDATE master_4500 
SET 
  description = 'Energy system or force relevant to AI and cognitive systems',
  notes = 'Power or force consideration in AI systems',
  era_cloud_native = 'Energy requirements for cloud AI infrastructure',
  era_gen_ai = 'Computational energy for generative models',
  era_agentic_ai = 'Power systems for autonomous AI agents',
  era_bci = 'Neural energy and signal processing power',
  ai_relevance = 'Energy and power considerations for AI system operation',
  ai_era_shift = 'From traditional computing power to AI-optimized energy systems',
  status = 'seeded',
  progress = 40
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'energy-forces'
  AND status = 'scaffold';

-- ============================================================================
-- PHASE 12: SEED ERAS
-- ============================================================================

UPDATE master_4500 
SET 
  description = CASE title
    WHEN 'On-Premise Era' THEN 'Traditional computing in local data centers and private infrastructure'
    WHEN 'Cloud-Native Era' THEN 'Distributed computing leveraging scalable cloud infrastructure'
    WHEN 'Generative AI Era' THEN 'Large language models and generative AI capabilities'
    WHEN 'Agentic AI Era' THEN 'Autonomous AI systems making independent decisions'
    WHEN 'BCI Era' THEN 'Brain-computer interfaces and cognitive augmentation'
    ELSE 'Technological era in AI evolution'
  END,
  notes = CASE title
    WHEN 'On-Premise Era' THEN 'Foundation of traditional computing infrastructure'
    WHEN 'Cloud-Native Era' THEN 'Enabled massive scaling of AI capabilities'
    WHEN 'Generative AI Era' THEN 'Breakthrough in AI content generation and reasoning'
    WHEN 'Agentic AI Era' THEN 'Shift to autonomous AI decision-making'
    WHEN 'BCI Era' THEN 'Integration of AI with human cognition'
    ELSE 'Key period in technological evolution'
  END,
  era_on_prem = 'Era characterized by on-premise infrastructure',
  era_cloud_native = 'Era characterized by cloud-native architecture',
  era_gen_ai = 'Era characterized by generative AI capabilities',
  era_agentic_ai = 'Era characterized by autonomous AI agents',
  era_bci = 'Era characterized by brain-computer interfaces',
  ai_relevance = 'Defines major shift in AI capabilities and architecture',
  ai_era_shift = 'Represents fundamental transformation in how AI is built and deployed',
  status = 'seeded',
  progress = 70
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'eras'
  AND status IN ('scaffold', 'seeded');

-- ============================================================================
-- PHASE 13: SEED DISCIPLINES
-- ============================================================================

UPDATE master_4500 
SET 
  description = CASE title
    WHEN 'Cognitive Science' THEN 'Interdisciplinary study of mind, intelligence, and behavior'
    WHEN 'Neuroscience' THEN 'Scientific study of the nervous system and brain function'
    WHEN 'Computer Science' THEN 'Study of computation, information processing, and algorithmic systems'
    WHEN 'Philosophy' THEN 'Study of fundamental questions about existence, knowledge, and ethics'
    WHEN 'Psychology' THEN 'Scientific study of mind and behavior'
    ELSE 'Academic discipline relevant to AI and cognition'
  END,
  notes = CASE title
    WHEN 'Cognitive Science' THEN 'Foundation for understanding artificial intelligence'
    WHEN 'Neuroscience' THEN 'Informs neural network architectures and BCI development'
    WHEN 'Computer Science' THEN 'Core discipline for AI algorithms and systems'
    WHEN 'Philosophy' THEN 'Addresses fundamental questions about AI consciousness and ethics'
    WHEN 'Psychology' THEN 'Informs human-AI interaction and cognitive modeling'
    ELSE 'Contributing field to AI development'
  END,
  era_on_prem = 'Traditional academic research in the discipline',
  era_cloud_native = 'Research scaled with computational infrastructure',
  era_gen_ai = 'Discipline transformed by generative AI tools',
  era_agentic_ai = 'Discipline adapts to autonomous AI systems',
  era_bci = 'Discipline explores cognitive augmentation',
  ai_relevance = 'Academic discipline contributing fundamental insights to AI',
  ai_era_shift = 'From theoretical study to applied AI research and development',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'disciplines'
  AND status IN ('scaffold', 'seeded');

-- ============================================================================
-- PHASE 14: SEED UNSTRUCTURED CONTENT
-- ============================================================================

UPDATE master_4500 
SET 
  description = 'Emergent topic or concept in AI and cognitive systems',
  notes = 'Exploratory content requiring further development',
  era_gen_ai = 'Relevant to generative AI era',
  era_agentic_ai = 'Applicable to autonomous AI systems',
  ai_relevance = 'Emerging topic in AI development and deployment',
  ai_era_shift = 'New concept arising from AI advancement',
  status = 'seeded',
  progress = 35
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'unstructured'
  AND status = 'scaffold';

-- ============================================================================
-- FINAL: UPDATE BOOK PROGRESS
-- ============================================================================

-- Recalculate overall book progress
UPDATE books
SET 
  progress_percentage = (
    SELECT ROUND(AVG(COALESCE(progress, 0)))::INTEGER
    FROM master_4500
    WHERE book_slug = 'thinking-engine'
  ),
  updated_at = NOW()
WHERE slug = 'thinking-engine';