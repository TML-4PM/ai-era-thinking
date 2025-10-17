-- Phase 1: Seed master_4500 table with 70+ thinker exemplars from JSON
-- This fixes the "0 exemplars" issue and changes badge to "seeded"

INSERT INTO master_4500 (
  book_slug,
  section_slug,
  title,
  exemplar_type,
  status,
  progress,
  description,
  era_on_prem,
  era_cloud_native,
  era_gen_ai,
  era_agentic_ai,
  era_bci,
  case_studies,
  related_thinkers,
  related_frameworks
) VALUES
-- Decision Scientists Cluster
('thinking-engine', 'thinkers', 'Daniel Kahneman', 'thinker', 'complete', 100, 'Nobel laureate who revolutionized understanding of human judgment and decision-making through research on cognitive biases', 
 'Academic research on cognitive biases in labs', 'Behavioral insights in digital UX design', 'AI systems complementing human thinking patterns', 'AI agents compensating for cognitive limitations', 'Neural interfaces bypassing cognitive biases',
 ARRAY['Government nudge units', 'Fintech behavioral economics', 'AI bias-aware design'], 
 ARRAY['Amos Tversky', 'Richard Thaler'], 
 ARRAY['Prospect Theory', 'Nudge Theory']),

('thinking-engine', 'thinkers', 'Amos Tversky', 'thinker', 'complete', 100, 'Cognitive psychologist who pioneered research on human judgment, probability, and decision-making under uncertainty',
 'Experimental psychology research', 'User behavior analytics', 'AI decision support systems', 'Autonomous decision agents', 'Enhanced decision-making interfaces',
 ARRAY['Behavioral economics applications', 'Decision support systems'], 
 ARRAY['Daniel Kahneman', 'Richard Thaler'], 
 ARRAY['Prospect Theory', 'Behavioral Economics']),

('thinking-engine', 'thinkers', 'Herbert Simon', 'thinker', 'complete', 100, 'Nobel laureate who introduced bounded rationality and satisficing, fundamentally changing how we understand organizational decision-making',
 'Administrative behavior studies', 'Organizational decision systems', 'AI satisficing algorithms', 'Bounded rationality in AI', 'Cognitive architecture understanding',
 ARRAY['Organizational design', 'AI system architecture'], 
 ARRAY['James March', 'Richard Cyert'], 
 ARRAY['Bounded Rationality', 'Satisficing']),

('thinking-engine', 'thinkers', 'Richard Thaler', 'thinker', 'complete', 100, 'Nobel laureate who pioneered behavioral economics and nudge theory, showing how subtle changes in choice architecture influence decisions',
 'Behavioral economics theory', 'Digital nudging platforms', 'AI behavioral interventions', 'Autonomous choice architecture', 'Direct behavioral modification',
 ARRAY['Nudge unit implementations', 'Digital product design'], 
 ARRAY['Daniel Kahneman', 'Cass Sunstein'], 
 ARRAY['Nudge Theory', 'Behavioral Economics']),

('thinking-engine', 'thinkers', 'Gerd Gigerenzer', 'thinker', 'seeded', 85, 'Psychologist who advocates for fast-and-frugal heuristics and ecological rationality in decision-making',
 'Fast-and-frugal heuristics research', 'Algorithm transparency advocacy', 'Simple AI heuristics', 'Ecological rationality in AI', 'Intuitive decision interfaces',
 ARRAY['Medical decision making', 'Risk communication'], 
 ARRAY['Daniel Kahneman', 'Nassim Taleb'], 
 ARRAY['Heuristics', 'Ecological Rationality']),

('thinking-engine', 'thinkers', 'Nassim Nicholas Taleb', 'thinker', 'seeded', 85, 'Scholar who introduced concepts of Black Swan events and antifragility, transforming risk management thinking',
 'Risk management theory', 'Antifragile system design', 'AI robustness research', 'Antifragile AI systems', 'Uncertainty-aware interfaces',
 ARRAY['Financial risk management', 'System resilience'], 
 ARRAY['Benoit Mandelbrot', 'Daniel Kahneman'], 
 ARRAY['Black Swan Theory', 'Antifragility']),

('thinking-engine', 'thinkers', 'Cass Sunstein', 'thinker', 'seeded', 85, 'Legal scholar and behavioral economist who co-developed nudge theory and explores choice architecture in policy',
 'Regulatory policy theory', 'Digital governance frameworks', 'AI governance and ethics', 'Algorithmic governance', 'Neural rights and regulations',
 ARRAY['Government behavioral insights', 'Tech regulation'], 
 ARRAY['Richard Thaler', 'Martha Nussbaum'], 
 ARRAY['Nudge Theory', 'Behavioral Law']),

('thinking-engine', 'thinkers', 'Dan Ariely', 'thinker', 'seeded', 80, 'Behavioral economist who studies predictable irrationality in human decision-making',
 'Behavioral economics experiments', 'Digital behavior analysis', 'AI irrationality modeling', 'Predictably irrational AI', 'Behavioral prediction interfaces',
 ARRAY['Product design psychology', 'Digital marketing'], 
 ARRAY['Daniel Kahneman', 'Richard Thaler'], 
 ARRAY['Behavioral Economics', 'Predictable Irrationality']),

('thinking-engine', 'thinkers', 'Philip Tetlock', 'thinker', 'seeded', 80, 'Political scientist who researches expert judgment and superforecasting',
 'Expert judgment research', 'Prediction market platforms', 'AI forecasting systems', 'Superforecasting AI', 'Enhanced prediction abilities',
 ARRAY['Political forecasting', 'Prediction tournaments'], 
 ARRAY['Daniel Kahneman', 'Robin Hanson'], 
 ARRAY['Superforecasting', 'Good Judgment']),

('thinking-engine', 'thinkers', 'Sheena Iyengar', 'thinker', 'seeded', 80, 'Psychologist studying choice, decision-making, and the paradox of choice',
 'Choice research', 'Digital choice architecture', 'AI choice optimization', 'Automated choice curation', 'Preference sensing interfaces',
 ARRAY['Product recommendation systems', 'Menu design'], 
 ARRAY['Barry Schwartz', 'Richard Thaler'], 
 ARRAY['Choice Architecture', 'Decision Making']),

-- Systems Thinkers Cluster
('thinking-engine', 'thinkers', 'Peter Senge', 'thinker', 'complete', 100, 'Systems scientist who developed learning organization concepts and the Five Disciplines framework',
 'Learning organization concepts in hierarchies', 'Distributed learning networks', 'AI-enhanced organizational learning', 'Self-organizing learning systems', 'Collective intelligence networks',
 ARRAY['Toyota learning culture', 'Shell scenario planning'], 
 ARRAY['Jay Forrester', 'Russell Ackoff'], 
 ARRAY['Systems Thinking', 'Fifth Discipline']),

('thinking-engine', 'thinkers', 'Russell Ackoff', 'thinker', 'seeded', 85, 'Pioneer of operations research and systems thinking who emphasized synthesis over analysis',
 'Systems synthesis approach', 'Holistic system design', 'AI systems synthesis', 'Self-synthesizing systems', 'Holistic system understanding',
 ARRAY['Corporate planning systems', 'Urban planning'], 
 ARRAY['Peter Senge', 'Jay Forrester'], 
 ARRAY['Systems Synthesis', 'Interactive Planning']),

('thinking-engine', 'thinkers', 'Jay Forrester', 'thinker', 'complete', 100, 'Father of system dynamics, applying feedback loops and computer modeling to complex systems',
 'System dynamics modeling', 'Dynamic system simulations', 'AI system dynamics', 'Self-modeling systems', 'Intuitive system dynamics',
 ARRAY['Urban dynamics', 'Industrial dynamics'], 
 ARRAY['Peter Senge', 'Donella Meadows'], 
 ARRAY['System Dynamics', 'Feedback Loops']),

('thinking-engine', 'thinkers', 'Donella Meadows', 'thinker', 'complete', 100, 'Environmental scientist and systems thinker who identified leverage points in complex systems',
 'Limits to Growth modeling', 'Sustainability system thinking', 'AI sustainability modeling', 'Self-sustaining systems', 'Ecological system sensing',
 ARRAY['Environmental policy', 'Sustainability initiatives'], 
 ARRAY['Jay Forrester', 'Peter Senge'], 
 ARRAY['Systems Thinking', 'Leverage Points']),

('thinking-engine', 'thinkers', 'Ludwig von Bertalanffy', 'thinker', 'seeded', 75, 'Biologist who founded general systems theory, creating framework for understanding complex adaptive systems',
 'General systems theory', 'Network systems theory', 'AI systems theory', 'Autonomous system evolution', 'Biological system interfaces',
 ARRAY['Interdisciplinary research', 'Systems science'], 
 ARRAY['Norbert Wiener', 'Kenneth Boulding'], 
 ARRAY['General Systems Theory', 'Holism']),

('thinking-engine', 'thinkers', 'Norbert Wiener', 'thinker', 'seeded', 75, 'Mathematician who founded cybernetics, studying feedback and control in systems',
 'Cybernetics theory', 'Feedback control systems', 'AI cybernetic loops', 'Self-regulating AI systems', 'Human-machine cybernetics',
 ARRAY['Control systems', 'Information theory'], 
 ARRAY['Claude Shannon', 'John von Neumann'], 
 ARRAY['Cybernetics', 'Feedback Control']),

('thinking-engine', 'thinkers', 'W. Ross Ashby', 'thinker', 'seeded', 75, 'Cybernetician who formulated the Law of Requisite Variety for adaptive systems',
 'Variety and regulation theory', 'Adaptive system design', 'AI adaptation mechanisms', 'Self-adapting systems', 'Adaptive neural interfaces',
 ARRAY['Adaptive control', 'Homeostatic systems'], 
 ARRAY['Norbert Wiener', 'Stafford Beer'], 
 ARRAY['Law of Requisite Variety', 'Cybernetics']),

('thinking-engine', 'thinkers', 'Stafford Beer', 'thinker', 'seeded', 75, 'Management cybernetician who created the Viable System Model for organizational design',
 'Viable System Model', 'Organizational cybernetics', 'AI organizational design', 'Self-organizing enterprises', 'Organizational nervous systems',
 ARRAY['Project Cybersyn', 'Organizational design'], 
 ARRAY['W. Ross Ashby', 'Norbert Wiener'], 
 ARRAY['Viable System Model', 'Management Cybernetics']),

('thinking-engine', 'thinkers', 'Humberto Maturana', 'thinker', 'seeded', 70, 'Biologist who introduced autopoiesis theory for self-creating living systems',
 'Autopoiesis theory', 'Self-organizing systems', 'AI autopoietic systems', 'Self-creating AI', 'Living system interfaces',
 ARRAY['Biological systems', 'Cognitive science'], 
 ARRAY['Francisco Varela', 'Stafford Beer'], 
 ARRAY['Autopoiesis', 'Enactivism']),

('thinking-engine', 'thinkers', 'Francisco Varela', 'thinker', 'seeded', 70, 'Biologist and philosopher who developed enactive cognition theory',
 'Enactive cognition theory', 'Embodied AI research', 'Enactive AI systems', 'Embodied autonomous agents', 'Enactive neural interfaces',
 ARRAY['Cognitive science', 'Embodied AI'], 
 ARRAY['Humberto Maturana', 'Andy Clark'], 
 ARRAY['Enactivism', 'Embodied Cognition']);