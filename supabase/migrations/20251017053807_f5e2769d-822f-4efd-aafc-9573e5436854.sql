-- Tier 1 Thinker Profiles - Batch 2 (Remaining 10 thinkers)

-- 6. RICHARD THALER (Decision Science - Behavioral Economics)
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Richard Thaler founded behavioral economics by integrating psychological insights into economic models. His work on nudges, mental accounting, and choice architecture demonstrates how small environmental changes can dramatically influence decisions. In the AI era, Thaler''s frameworks are essential for designing AI systems that guide human behavior ethically while respecting autonomy and addressing systematic irrationalities.',
    'key_concepts', jsonb_build_array(
      'Nudges and choice architecture',
      'Mental accounting and framing',
      'Endowment effect and status quo bias',
      'Present bias and time inconsistency',
      'Libertarian paternalism',
      'Sludge and friction in decision-making',
      'Default effects and opt-out design'
    ),
    'why_it_matters', 'Thaler''s insights reveal how AI interface design profoundly shapes human decisions. Understanding behavioral economics is critical for creating AI that helps users make better choices without manipulation, and for recognizing how AI recommendations can nudge behavior at unprecedented scale.',
    'ai_implications', jsonb_build_array(
      'AI can implement nudges at scale with personalization',
      'Choice architecture in AI interfaces shapes outcomes dramatically',
      'Risk of manipulative AI using behavioral insights unethically',
      'Opportunity to design AI that corrects for present bias and mental accounting errors',
      'Need for ethical frameworks governing AI nudging'
    ),
    'recommended_practices', jsonb_build_array(
      'Design AI interfaces using choice architecture principles',
      'Implement nudges that help users achieve stated goals',
      'Remove sludge and unnecessary friction from processes',
      'Use defaults ethically to improve outcomes',
      'Make AI recommendations frame-aware',
      'Test for present bias in AI-mediated decisions',
      'Build transparency into nudging mechanisms'
    ),
    'common_pitfalls', jsonb_build_array(
      'Using behavioral insights to manipulate rather than help',
      'Not recognizing AI defaults as powerful nudges',
      'Ignoring mental accounting in AI recommendations',
      'Failing to test for unintended behavioral responses',
      'Creating AI that exploits rather than corrects biases',
      'Lack of transparency about nudging mechanisms'
    ),
    'success_metrics', jsonb_build_array(
      'Improved user outcomes aligned with stated goals',
      'Ethical nudging that respects autonomy',
      'Reduced friction in beneficial processes',
      'Effective correction of present bias',
      'Transparent choice architecture',
      'Measurable behavior improvements'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'comprehensive-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Critical for ethical AI design that influences behavior while respecting autonomy',
    'cross_era_relevance', 'Behavioral economics becomes increasingly important as AI gains power to nudge at scale',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Audit AI for unintended nudges, design ethical choice architecture, implement transparency',
      'phase_2', 'Build AI that actively corrects behavioral biases, create sophisticated nudge frameworks, test for manipulation risks',
      'phase_3', 'Develop adaptive AI that personalizes nudges to individual goals while maintaining ethical boundaries'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'What nudges is our AI creating, intentionally or unintentionally?', 'context', 'When auditing AI influence on behavior', 'application', 'Map defaults and framing, test behavioral responses, ensure alignment with user goals'),
      jsonb_build_object('question', 'How can we design AI choice architecture ethically?', 'context', 'When building AI interfaces that influence decisions', 'application', 'Apply Thaler''s principles, maintain transparency, test for manipulation, respect autonomy'),
      jsonb_build_object('question', 'Where should we remove sludge to improve outcomes?', 'context', 'When users struggle with AI-mediated processes', 'application', 'Identify unnecessary friction, streamline beneficial choices, test completion rates'),
      jsonb_build_object('question', 'Is our AI exploiting or correcting behavioral biases?', 'context', 'When AI influences financial or health decisions', 'application', 'Test for present bias exploitation, verify goal alignment, ensure ethical design'),
      jsonb_build_object('question', 'What defaults should we set in AI recommendations?', 'context', 'When designing AI systems with significant behavioral influence', 'application', 'Choose defaults that benefit users, make changes easy, disclose default effects'),
      jsonb_build_object('question', 'How can we use Thaler''s insights for good?', 'context', 'When planning AI that shapes behavior', 'application', 'Design for user benefit, maintain transparency, respect autonomy, test outcomes')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Audit AI for unintended nudges; design ethical choice architecture; remove harmful sludge from processes',
    'mediumTerm', 'Build AI that corrects behavioral biases; create sophisticated ethical nudge frameworks; implement behavioral testing',
    'longTerm', 'Develop adaptive AI that personalizes beneficial nudges while maintaining strict ethical boundaries and transparency'
  ),
  related_thinkers = ARRAY['Daniel Kahneman', 'Amos Tversky', 'Cass Sunstein', 'Dan Ariely']
WHERE thinker_name = 'Richard Thaler';

-- 7. GERD GIGERENZER (Decision Science - Fast and Frugal Heuristics)
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Gerd Gigerenzer challenges the bias-and-heuristics paradigm by demonstrating that simple heuristics often outperform complex algorithms in real-world conditions. His work on fast and frugal decision-making reveals when less information produces better decisions. For AI, Gigerenzer''s insights show that sophisticated algorithms aren''t always superior and that understanding environmental structure is key to effective decision-making.',
    'key_concepts', jsonb_build_array(
      'Fast and frugal heuristics',
      'Recognition heuristic and ecological rationality',
      'Less-is-more effects',
      'Adaptive toolbox of decision strategies',
      'Risk literacy and probabilistic thinking',
      'Simple rules in complex environments',
      'Environmental structure matching'
    ),
    'why_it_matters', 'Gigerenzer''s research reveals that AI sophistication doesn''t guarantee performance and that simple rules often work better in uncertain environments. His framework is essential for knowing when to use simple AI versus complex models and for understanding that more data and computation can degrade decisions.',
    'ai_implications', jsonb_build_array(
      'Simple AI models may outperform complex ones in uncertain environments',
      'Need to match AI complexity to environmental structure',
      'More training data can sometimes hurt performance',
      'Fast and frugal AI appropriate for many real-world contexts',
      'Recognition-based AI has power in specific domains'
    ),
    'recommended_practices', jsonb_build_array(
      'Test simple models before complex ones',
      'Match AI complexity to environmental predictability',
      'Build adaptive toolbox of AI strategies',
      'Use recognition heuristics where appropriate',
      'Design for ecological rationality not just accuracy',
      'Teach risk literacy alongside AI implementation',
      'Know when less information produces better decisions'
    ),
    'common_pitfalls', jsonb_build_array(
      'Assuming complex AI always outperforms simple rules',
      'Not matching model complexity to environment',
      'Using more data when less would be better',
      'Ignoring environmental structure in model design',
      'Failing to test simple heuristics as baselines',
      'Optimizing for laboratory conditions not real-world'
    ),
    'success_metrics', jsonb_build_array(
      'Simple models outperforming complex ones',
      'AI matched appropriately to environment',
      'Improved real-world generalization',
      'Effective use of recognition heuristics',
      'Better decisions with less information',
      'Enhanced risk literacy in organization'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'comprehensive-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Essential for understanding when simple AI outperforms complex models',
    'cross_era_relevance', 'Ecological rationality becomes critical as AI complexity grows without matching environmental structure',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Test simple AI baselines, audit model complexity versus environment, build adaptive toolbox',
      'phase_2', 'Implement fast and frugal AI where appropriate, develop environmental structure analysis, train teams on when to use simple rules',
      'phase_3', 'Create adaptive AI that selects strategy based on environmental structure, build systems that know their own limits'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'Could a simple rule outperform our complex AI model?', 'context', 'Before deploying sophisticated AI', 'application', 'Test simple heuristics as baselines, compare real-world performance, consider environmental structure'),
      jsonb_build_object('question', 'Is our AI too complex for the environmental structure?', 'context', 'When complex models underperform expectations', 'application', 'Analyze predictability, test simpler alternatives, match complexity to environment'),
      jsonb_build_object('question', 'Are we using too much data for this decision?', 'context', 'When more training data degrades performance', 'application', 'Test less-is-more effects, identify key cues, simplify feature sets'),
      jsonb_build_object('question', 'Which fast and frugal heuristics apply here?', 'context', 'When facing uncertain or time-pressured decisions', 'application', 'Build adaptive toolbox, match heuristics to context, test performance'),
      jsonb_build_object('question', 'Does recognition provide useful signal?', 'context', 'When brand or familiarity might indicate quality', 'application', 'Implement recognition heuristics, test validity, use appropriately'),
      jsonb_build_object('question', 'How can we improve risk literacy?', 'context', 'When users misunderstand AI probabilities', 'application', 'Teach natural frequencies, use clear visualizations, test comprehension')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Test simple AI baselines before complex models; audit model-environment fit; build adaptive strategy toolbox',
    'mediumTerm', 'Implement fast and frugal AI where appropriate; develop environmental structure analysis capabilities; train on ecological rationality',
    'longTerm', 'Create adaptive AI that selects optimal strategy based on environmental structure; build self-aware systems that know complexity limits'
  ),
  related_thinkers = ARRAY['Daniel Kahneman', 'Amos Tversky', 'Herbert Simon', 'Gary Klein']
WHERE thinker_name = 'Gerd Gigerenzer';

-- 8. PETER SENGE (Systems Thinking - Learning Organizations)
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Peter Senge revolutionized organizational learning by revealing how mental models, shared vision, and systems thinking enable collective intelligence. His Fifth Discipline framework demonstrates that learning organizations adapt faster and innovate more effectively. For AI transformation, Senge''s insights are critical for building organizations that can learn alongside AI systems rather than being disrupted by them.',
    'key_concepts', jsonb_build_array(
      'Five disciplines of learning organizations',
      'Mental models and organizational learning',
      'Shared vision and team learning',
      'Personal mastery and systems thinking',
      'Balancing advocacy and inquiry',
      'Creative tension and generative learning',
      'Learning disabilities in organizations'
    ),
    'why_it_matters', 'Senge''s framework explains why some organizations thrive with AI while others struggle despite similar technology investments. Building learning capability is more critical than deploying AI tools, as organizational learning velocity determines adaptation success in rapid technological change.',
    'ai_implications', jsonb_build_array(
      'Organizations must learn faster than AI disrupts',
      'Mental models about AI shape what''s possible',
      'AI can enhance or hinder organizational learning',
      'Team learning must include human-AI collaboration',
      'Need for shared vision of AI-augmented future'
    ),
    'recommended_practices', jsonb_build_array(
      'Build learning capability before deploying AI',
      'Surface and challenge mental models about AI',
      'Create shared vision of AI-augmented organization',
      'Design AI to enhance team learning',
      'Balance advocacy and inquiry in AI decisions',
      'Use systems thinking to understand AI impacts',
      'Enable personal mastery with AI tools'
    ),
    'common_pitfalls', jsonb_build_array(
      'Deploying AI without building learning capability',
      'Not surfacing limiting mental models',
      'Lacking shared vision of AI future',
      'AI that fragments rather than enhances team learning',
      'Pure advocacy without inquiry in AI strategy',
      'Missing systems perspective on AI transformation'
    ),
    'success_metrics', jsonb_build_array(
      'Increased organizational learning velocity',
      'Effective mental model evolution',
      'Strong shared vision of AI future',
      'Enhanced team learning with AI',
      'Balanced dialogue about AI strategy',
      'Systems thinking applied to AI transformation'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'comprehensive-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Critical for building organizations that learn faster than AI disrupts',
    'cross_era_relevance', 'Learning organization principles become essential as AI transformation accelerates',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Assess learning capability, surface mental models about AI, create shared vision',
      'phase_2', 'Build learning infrastructure, design AI to enhance team learning, develop systems thinking capacity',
      'phase_3', 'Create continuously learning organization that evolves with AI, embed learning in all processes'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'What mental models about AI are limiting our organization?', 'context', 'When AI initiatives face resistance or fail to scale', 'application', 'Surface assumptions, challenge limiting beliefs, create shared understanding'),
      jsonb_build_object('question', 'Do we have shared vision of our AI-augmented future?', 'context', 'When AI strategy lacks alignment', 'application', 'Build collective vision, ensure understanding, create pull toward future state'),
      jsonb_build_object('question', 'Is our organizational learning velocity sufficient for AI transformation?', 'context', 'When organization struggles to adapt', 'application', 'Assess learning capability, identify disabilities, build learning infrastructure'),
      jsonb_build_object('question', 'How can we design AI that enhances team learning?', 'context', 'When implementing collaborative AI tools', 'application', 'Enable knowledge sharing, support collective intelligence, avoid fragmenting teams'),
      jsonb_build_object('question', 'Are we balancing advocacy and inquiry in AI decisions?', 'context', 'When AI strategy discussions are one-sided', 'application', 'Promote genuine dialogue, test assumptions, integrate perspectives'),
      jsonb_build_object('question', 'How can we apply systems thinking to AI transformation?', 'context', 'When AI creates unintended consequences', 'application', 'Map system dynamics, identify leverage points, design holistically')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Assess organizational learning capability; surface mental models about AI; create shared vision of AI future',
    'mediumTerm', 'Build learning infrastructure; design AI that enhances team learning; develop systems thinking capacity across organization',
    'longTerm', 'Create continuously learning organization that evolves with AI; embed learning in all processes and structures'
  ),
  related_thinkers = ARRAY['Donella Meadows', 'Chris Argyris', 'Edgar Schein', 'Jay Forrester']
WHERE thinker_name = 'Peter Senge';

-- 9. JAY FORRESTER (Systems Thinking - System Dynamics)
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Jay Forrester founded system dynamics, creating mathematical modeling techniques for understanding complex feedback systems. His work reveals how systems generate their own behavior through internal structure and why counter-intuitive effects emerge from feedback loops. For AI, Forrester''s methods are essential for modeling how AI interventions propagate through organizations and predicting unintended consequences.',
    'key_concepts', jsonb_build_array(
      'System dynamics and feedback loops',
      'Stock and flow structures',
      'Delays and accumulations',
      'Counter-intuitive behavior of systems',
      'Policy resistance and unintended consequences',
      'Endogenous versus exogenous factors',
      'Dynamic complexity and simulation'
    ),
    'why_it_matters', 'Forrester''s framework enables rigorous modeling of AI impacts before deployment, revealing counter-intuitive effects that qualitative analysis misses. System dynamics shows how AI creates feedback loops that generate behavior often opposite to intentions, making simulation essential for effective AI strategy.',
    'ai_implications', jsonb_build_array(
      'AI interventions create complex feedback loops',
      'Need to model AI impacts before deployment',
      'Counter-intuitive effects emerge from AI at scale',
      'Delays between AI implementation and consequences',
      'Policy resistance when AI conflicts with system structure'
    ),
    'recommended_practices', jsonb_build_array(
      'Model system dynamics before deploying AI',
      'Identify stocks, flows, and feedback loops',
      'Simulate AI interventions and test for unintended consequences',
      'Account for delays in system response',
      'Design AI aware of endogenous behavior generation',
      'Test for policy resistance',
      'Use dynamic complexity thinking in AI strategy'
    ),
    'common_pitfalls', jsonb_build_array(
      'Not modeling before deploying AI',
      'Missing key feedback loops',
      'Ignoring delays in system response',
      'Treating symptoms rather than system structure',
      'Failing to test for counter-intuitive effects',
      'Not recognizing policy resistance patterns'
    ),
    'success_metrics', jsonb_build_array(
      'Accurate prediction of AI system impacts',
      'Reduced unintended consequences',
      'Effective intervention in feedback loops',
      'Successfully navigated policy resistance',
      'Counter-intuitive effects anticipated',
      'System behavior improved not just symptoms'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'comprehensive-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Essential for rigorous modeling of AI impacts and predicting counter-intuitive effects',
    'cross_era_relevance', 'System dynamics becomes critical as AI creates increasingly complex feedback loops',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Build system dynamics modeling capability, map current state, simulate AI interventions',
      'phase_2', 'Create comprehensive models of AI impacts, test interventions virtually, design feedback-aware strategies',
      'phase_3', 'Embed system dynamics in all AI strategy, build real-time simulation capabilities, anticipate emergent behaviors'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'What feedback loops will our AI create?', 'context', 'Before deploying AI interventions', 'application', 'Map stocks and flows, identify reinforcing and balancing loops, simulate behavior'),
      jsonb_build_object('question', 'What counter-intuitive effects should we anticipate?', 'context', 'When AI seems likely to have straightforward impacts', 'application', 'Model system dynamics, test for opposite effects, identify delays'),
      jsonb_build_object('question', 'Will our AI face policy resistance?', 'context', 'When AI conflicts with existing system structures', 'application', 'Identify structural conflicts, anticipate resistance, redesign or accept limits'),
      jsonb_build_object('question', 'What delays exist between AI implementation and consequences?', 'context', 'When planning AI rollout timelines', 'application', 'Map delay structures, account for accumulation effects, set realistic expectations'),
      jsonb_build_object('question', 'Is AI treating symptoms or addressing system structure?', 'context', 'When AI addresses surface problems', 'application', 'Identify root causes, design structural interventions, avoid symptomatic fixes'),
      jsonb_build_object('question', 'How can we use system dynamics in AI strategy?', 'context', 'When planning comprehensive AI transformation', 'application', 'Build models, simulate scenarios, test interventions, design system-aware strategies')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Build system dynamics modeling capability; map current state stocks and flows; simulate AI interventions before deployment',
    'mediumTerm', 'Create comprehensive models of AI impacts; develop expertise in dynamic complexity; design feedback-aware AI strategies',
    'longTerm', 'Embed system dynamics in all AI strategy and decision-making; build real-time simulation capabilities; anticipate emergent system behaviors'
  ),
  related_thinkers = ARRAY['Donella Meadows', 'Peter Senge', 'Geoffrey West', 'Elinor Ostrom']
WHERE thinker_name = 'Jay Forrester';

-- 10. GEOFFREY WEST (Systems Thinking - Scaling Laws)
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Geoffrey West discovered mathematical scaling laws that govern cities, companies, and biological systems. His research reveals why companies slow down as they grow while cities accelerate, and how innovation rates relate to organizational scale. For AI, West''s insights explain how AI implementation scales differently than traditional technology and why organizational size affects AI transformation dynamics.',
    'key_concepts', jsonb_build_array(
      'Scaling laws and power laws',
      'Sublinear versus superlinear scaling',
      'Innovation rates and organizational size',
      'Metabolic theory of organizations',
      'Network effects and scaling',
      'Inevitability of collapse or transformation',
      'Acceleration of innovation cycles'
    ),
    'why_it_matters', 'West''s framework reveals fundamental constraints on how organizations scale and innovate, showing why AI transformation faces different dynamics at different organizational sizes. Understanding scaling laws is critical for predicting AI adoption patterns and designing strategies appropriate to organizational scale.',
    'ai_implications', jsonb_build_array(
      'AI scaling may follow different laws than organizations',
      'Network effects change how AI capabilities compound',
      'Innovation rate acceleration with AI may prevent corporate decline',
      'Organizational size affects AI transformation feasibility',
      'Need to understand AI''s scaling economics'
    ),
    'recommended_practices', jsonb_build_array(
      'Understand scaling laws for your organizational size',
      'Design AI strategy appropriate to scale',
      'Leverage network effects in AI deployment',
      'Accelerate innovation cycles with AI',
      'Test for sublinear versus superlinear scaling',
      'Build AI that compounds capabilities',
      'Plan for transformation not just optimization'
    ),
    'common_pitfalls', jsonb_build_array(
      'Assuming linear scaling of AI benefits',
      'Not accounting for organizational size effects',
      'Missing network effects in AI systems',
      'Failing to accelerate innovation cycles',
      'Treating AI as incremental not transformational',
      'Not recognizing scaling law constraints'
    ),
    'success_metrics', jsonb_build_array(
      'Superlinear scaling of AI capabilities',
      'Network effects successfully leveraged',
      'Innovation cycle acceleration',
      'Scale-appropriate AI deployment',
      'Compounding capability improvements',
      'Transformation achieved not just optimization'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'comprehensive-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Essential for understanding how AI scales and compounds differently than traditional technology',
    'cross_era_relevance', 'Scaling laws explain AI transformation dynamics across organizational sizes',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Understand scaling dynamics for your organization, measure current innovation rates, design scale-appropriate AI strategy',
      'phase_2', 'Build AI that leverages network effects, accelerate innovation cycles, test for superlinear scaling',
      'phase_3', 'Achieve transformational not just incremental change, break through organizational scaling constraints with AI'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'What scaling laws govern our organization and how does AI change them?', 'context', 'When planning AI transformation strategy', 'application', 'Map current scaling dynamics, test how AI affects them, design accordingly'),
      jsonb_build_object('question', 'Are we achieving superlinear scaling with AI?', 'context', 'When measuring AI impact', 'application', 'Test for network effects, measure compounding benefits, adjust strategy if scaling linearly'),
      jsonb_build_object('question', 'How can we leverage network effects in AI deployment?', 'context', 'When AI capabilities can compound across users', 'application', 'Design for network effects, enable data sharing, create feedback loops'),
      jsonb_build_object('question', 'Is our innovation cycle accelerating with AI?', 'context', 'When assessing AI transformation progress', 'application', 'Measure cycle times, identify bottlenecks, use AI to accelerate'),
      jsonb_build_object('question', 'Does our AI strategy match our organizational scale?', 'context', 'When AI initiatives feel inappropriate to organization size', 'application', 'Understand scale constraints, design appropriately, set realistic expectations'),
      jsonb_build_object('question', 'How can we use scaling laws to improve AI strategy?', 'context', 'When planning long-term AI roadmap', 'application', 'Apply West''s framework, design for transformation, leverage scaling dynamics')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Understand scaling dynamics for your organization; measure current innovation rates; design scale-appropriate AI strategy',
    'mediumTerm', 'Build AI that leverages network effects; accelerate innovation cycles; test for and achieve superlinear scaling of capabilities',
    'longTerm', 'Achieve transformational change through AI; break through organizational scaling constraints; sustain accelerating innovation'
  ),
  related_thinkers = ARRAY['Donella Meadows', 'Clayton Christensen', 'Peter Senge', 'W. Edwards Deming']
WHERE thinker_name = 'Geoffrey West';

-- Continue with remaining 5 Tier 1 thinkers in next batch...
-- Geoffrey Moore, Peter Drucker, Isaiah Berlin, John Rawls, Amartya Sen