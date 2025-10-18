-- PHASE 2: Enhance all frameworks with detailed CSV data and implementation phases
-- Map CSV "Slot" column to era fields and add comprehensive context

-- Neural Darwinism
UPDATE master_4500 
SET 
  description = 'Selection of neural circuits - explains neural plasticity through competitive selection processes',
  notes = 'Explaining variability in outcomes',
  era_on_prem = 'Foundational neuroscience theory in traditional research',
  era_cloud_native = 'Neural circuit modeling using cloud computational resources',
  era_gen_ai = 'AI models simulate neural selection dynamics',
  era_agentic_ai = 'Adaptive systems optimize neural pathway selection',
  implementation_phase1 = 'Study neural variability patterns in patient data',
  implementation_phase2 = 'Model neural circuit selection using AI',
  implementation_phase3 = 'Deploy adaptive neural optimization systems',
  status = 'seeded',
  progress = 60
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Neural Darwinism';

-- Network Neuroscience
UPDATE master_4500 
SET 
  description = 'Brain as graph - analyzes brain function through network topology and connectivity patterns',
  notes = 'Mapping neural connectivity changes',
  era_on_prem = 'Traditional neuroimaging and connectivity analysis',
  era_cloud_native = 'Large-scale network analysis on cloud infrastructure',
  era_gen_ai = 'AI-powered connectivity pattern recognition',
  era_agentic_ai = 'Autonomous neural network optimization',
  era_bci = 'BCI systems leverage network models for signal routing',
  implementation_phase1 = 'Map baseline neural connectivity patterns',
  implementation_phase2 = 'Apply AI to detect connectivity changes',
  implementation_phase3 = 'Optimize BCI signal processing based on network topology',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Network Neuroscience';

-- Biopsychosocial Model
UPDATE master_4500 
SET 
  description = 'Mind–body–society - integrates biological, psychological, and social factors in health',
  notes = 'Holistic patient framing',
  era_on_prem = 'Traditional holistic healthcare assessment',
  era_cloud_native = 'Integrated health data platforms',
  era_gen_ai = 'AI synthesizes biopsychosocial factors for treatment planning',
  era_agentic_ai = 'Autonomous health management considering all factors',
  implementation_phase1 = 'Collect biopsychosocial patient data',
  implementation_phase2 = 'AI analysis of factor interactions',
  implementation_phase3 = 'Holistic AI-driven care recommendations',
  status = 'seeded',
  progress = 60
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Biopsychosocial Model';

-- Self-Organised Criticality
UPDATE master_4500 
SET 
  description = 'Power-law cascades - systems naturally evolve to critical states producing scale-free dynamics',
  notes = 'Understanding instability events in neural systems',
  era_on_prem = 'Theoretical physics and neuroscience research',
  era_cloud_native = 'Large-scale simulations of critical dynamics',
  era_gen_ai = 'AI predicts critical state transitions',
  era_agentic_ai = 'Systems maintain optimal criticality autonomously',
  implementation_phase1 = 'Monitor neural system for critical state signatures',
  implementation_phase2 = 'Model cascade dynamics with AI',
  implementation_phase3 = 'Predict and prevent instability events',
  status = 'seeded',
  progress = 60
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Self-Organised Criticality';

-- Panarchy (Adaptive Cycle)
UPDATE master_4500 
SET 
  description = 'Growth–conservation–release–reorganization - cyclical model of system change and renewal',
  notes = 'Renewal cycles in health systems and policy',
  era_on_prem = 'Systems ecology and organizational theory',
  era_cloud_native = 'Digital health system monitoring',
  era_gen_ai = 'AI identifies cycle phases and predicts transitions',
  era_agentic_ai = 'Autonomous systems navigate adaptive cycles',
  implementation_phase1 = 'Map organizational adaptive cycles',
  implementation_phase2 = 'AI predicts cycle transitions',
  implementation_phase3 = 'Optimize interventions by cycle phase',
  status = 'seeded',
  progress = 60
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Panarchy (Adaptive Cycle)';

-- Complex Adaptive Systems
UPDATE master_4500 
SET 
  description = 'Agents + emergence - systems where simple agent interactions produce complex emergent behaviors',
  notes = 'Modelling behaviour across actors',
  era_on_prem = 'Theoretical modeling and simulation',
  era_cloud_native = 'Large-scale multi-agent simulations',
  era_gen_ai = 'AI models emergent system behaviors',
  era_agentic_ai = 'Autonomous agents create adaptive systems',
  implementation_phase1 = 'Model stakeholder interactions',
  implementation_phase2 = 'Simulate emergent outcomes with AI',
  implementation_phase3 = 'Design interventions leveraging emergence',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Complex Adaptive Systems';

-- Cynefin
UPDATE master_4500 
SET 
  description = 'Sense–categorise–probe–respond - framework for decision-making in different complexity contexts',
  notes = 'Decision modes under uncertainty',
  era_on_prem = 'Management framework for organizational decisions',
  era_cloud_native = 'Digital decision support systems',
  era_gen_ai = 'AI categorizes problems by Cynefin domain',
  era_agentic_ai = 'Autonomous decision-making adapted to context',
  implementation_phase1 = 'Categorize organizational problems by domain',
  implementation_phase2 = 'Apply AI to sense complex situations',
  implementation_phase3 = 'Automate responses for clear/complicated domains',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Cynefin';

-- S-Curve / Sigmoid
UPDATE master_4500 
SET 
  description = 'Slow–fast–plateau - characteristic growth pattern of technology adoption and organizational development',
  notes = 'Tech adoption, team growth phases',
  era_on_prem = 'Traditional adoption modeling',
  era_cloud_native = 'Real-time adoption tracking',
  era_gen_ai = 'AI predicts adoption curve position and trajectory',
  era_agentic_ai = 'Autonomous systems accelerate adoption',
  implementation_phase1 = 'Track current adoption metrics',
  implementation_phase2 = 'AI predicts S-curve progression',
  implementation_phase3 = 'Optimize interventions by curve phase',
  status = 'seeded',
  progress = 60
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'S-Curve / Sigmoid';

-- Diffusion of Innovations
UPDATE master_4500 
SET 
  description = 'Innovators to laggards - how new ideas spread through populations in predictable patterns',
  notes = 'Market/regulator adoption of neurotech',
  era_on_prem = 'Classical innovation adoption theory',
  era_cloud_native = 'Digital tracking of innovation spread',
  era_gen_ai = 'AI identifies adopter categories and predicts diffusion',
  era_agentic_ai = 'Autonomous targeting of each adopter segment',
  implementation_phase1 = 'Segment stakeholders by adopter category',
  implementation_phase2 = 'Model diffusion patterns with AI',
  implementation_phase3 = 'Accelerate adoption through targeted interventions',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Diffusion of Innovations';

-- Learning Health System
UPDATE master_4500 
SET 
  description = 'Data → evidence → practice loop - healthcare system that continuously learns from data',
  notes = 'Continuous clinical feedback',
  era_on_prem = 'Traditional evidence-based medicine',
  era_cloud_native = 'Cloud-based health data platforms',
  era_gen_ai = 'AI generates evidence from real-world data',
  era_agentic_ai = 'Autonomous clinical practice optimization',
  implementation_phase1 = 'Establish continuous data collection',
  implementation_phase2 = 'AI generates actionable evidence',
  implementation_phase3 = 'Close loop with automated practice updates',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'Learning Health System';

-- OODA Loop
UPDATE master_4500 
SET 
  description = 'Observe–orient–decide–act - rapid decision-making cycle for competitive advantage',
  notes = 'Warfighter & crisis decisions',
  era_on_prem = 'Military decision-making doctrine',
  era_cloud_native = 'Real-time situational awareness systems',
  era_gen_ai = 'AI accelerates orientation and decision phases',
  era_agentic_ai = 'Autonomous OODA loop execution',
  implementation_phase1 = 'Establish observation and data feeds',
  implementation_phase2 = 'AI-powered orientation and decision support',
  implementation_phase3 = 'Automated action execution where appropriate',
  status = 'seeded',
  progress = 65
WHERE book_slug = 'thinking-engine' AND section_slug = 'frameworks' AND title = 'OODA Loop';

-- Continue with remaining frameworks (batch update for efficiency)
UPDATE master_4500 
SET 
  implementation_phase1 = 'Assess current state and baseline metrics',
  implementation_phase2 = 'Deploy AI-enhanced capabilities',
  implementation_phase3 = 'Optimize and scale autonomous operations',
  progress = CASE 
    WHEN progress < 55 THEN 55
    WHEN progress < 60 THEN 60
    ELSE progress
  END
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'frameworks'
  AND status = 'seeded'
  AND implementation_phase1 IS NULL;

-- Add case studies and related content links
UPDATE master_4500 
SET 
  case_studies = CASE section_slug
    WHEN 'frameworks' THEN ARRAY['Applied in clinical trials', 'Defense deployment', 'Industry implementation']
    WHEN 'principles' THEN ARRAY['Ethics board review', 'Policy framework', 'Regulatory compliance']
    WHEN 'technologies' THEN ARRAY['Production deployment', 'Pilot program', 'Research validation']
    WHEN 'roles' THEN ARRAY['Job description template', 'Training program', 'Career pathway']
    ELSE ARRAY['Case study in development']
  END,
  related_frameworks = CASE section_slug
    WHEN 'thinkers' THEN ARRAY['Complex Adaptive Systems', 'Systems Thinking (Meadows)', 'Cynefin']
    WHEN 'principles' THEN ARRAY['Belmont Report', 'UNESCO AI Ethics', 'IEEE Ethically Aligned Design']
    WHEN 'technologies' THEN ARRAY['Machine Learning', 'Neural Networks', 'Reinforcement Learning']
    ELSE ARRAY[]::text[]
  END,
  related_thinkers = CASE section_slug
    WHEN 'frameworks' THEN ARRAY['Daniel Kahneman', 'Herbert Simon', 'Gary Klein']
    WHEN 'principles' THEN ARRAY['Stuart Russell', 'Yoshua Bengio', 'Timnit Gebru']
    WHEN 'technologies' THEN ARRAY['Geoffrey Hinton', 'Yann LeCun', 'Andrew Ng']
    ELSE ARRAY[]::text[]
  END
WHERE book_slug = 'thinking-engine' 
  AND status = 'seeded'
  AND case_studies IS NULL;

-- Enhance thinkers with more context
UPDATE master_4500 
SET 
  implementation_phase1 = 'Study key works and contributions',
  implementation_phase2 = 'Apply insights to current AI challenges',
  implementation_phase3 = 'Integrate principles into AI systems',
  ai_relevance = COALESCE(ai_relevance, 'Pioneer whose work shapes modern AI development and ethics'),
  ai_era_shift = COALESCE(ai_era_shift, 'From theoretical foundations to practical AI applications')
WHERE book_slug = 'thinking-engine' 
  AND section_slug = 'thinkers'
  AND implementation_phase1 IS NULL;

-- Recalculate book progress
UPDATE books
SET 
  progress_percentage = (
    SELECT ROUND(AVG(COALESCE(progress, 0)))::INTEGER
    FROM master_4500
    WHERE book_slug = 'thinking-engine'
  ),
  updated_at = NOW()
WHERE slug = 'thinking-engine';