-- Tier 2 Thinkers: Part 3/3 - Economics & Culture plus remaining Org Behavior

-- Simon Sinek
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Simon Sinek''s Start With Why framework and Golden Circle model provide essential tools for communicating AI transformation purpose. His work on inspirational leadership, trust-building, and the biology of motivation helps organizations navigate the human dimensions of AI adoption.',
    'key_concepts', jsonb_build_array(
      'Start With Why (Golden Circle: Why, How, What)',
      'The Infinite Game vs. Finite Game',
      'Circle of Safety and trust',
      'Leaders Eat Last',
      'Biology of motivation and belonging',
      'Finding your Why',
      'The Just Cause',
      'Trusting Teams',
      'Courageous leadership',
      'Building resilient cultures'
    ),
    'why_it_matters', 'AI transformation fails without clear purpose and trust. Sinek''s frameworks help organizations articulate compelling AI vision, build trust amid uncertainty, and create cultures where people feel safe enough to learn and adapt.',
    'ai_implications', jsonb_build_array(
      'AI transformation requires compelling "why" beyond efficiency',
      'Trust and safety critical when AI threatens jobs',
      'Infinite game mindset necessary for ongoing AI evolution',
      'Just Cause must address human purpose alongside AI capability',
      'Leaders must create safety amid AI uncertainty'
    ),
    'recommended_practices', jsonb_build_array(
      'Articulate compelling "why" for AI transformation',
      'Build Circle of Safety for AI experimentation',
      'Play the infinite game with AI evolution',
      'Define Just Cause that includes human purpose',
      'Practice courageous leadership in AI uncertainty',
      'Trust teams to find AI solutions',
      'Communicate from Why through How to What',
      'Build belonging amid AI disruption'
    ),
    'common_pitfalls', jsonb_build_array(
      'Leading with What (AI tools) before Why (purpose)',
      'Finite game thinking (beating competitors) over infinite game (worthy cause)',
      'Insufficient trust and safety for AI learning',
      'Just Cause that excludes human purpose',
      'Leadership that protects status over people',
      'Controlling rather than trusting teams with AI',
      'Focusing on AI features rather than purpose'
    ),
    'success_metrics', jsonb_build_array(
      'Clarity and resonance of AI "Why"',
      'Trust and psychological safety levels',
      'Infinite game behaviors vs. finite game',
      'Just Cause articulation quality',
      'Circle of Safety strength',
      'Leadership courage in AI uncertainty',
      'Team autonomy and trust',
      'Sense of belonging during transformation'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Sinek''s frameworks become increasingly vital as AI threatens purpose and belonging, requiring leaders to articulate compelling "why" and build trust strong enough to withstand disruption.',
    'cross_era_relevance', 'His Golden Circle provides the communication framework for every AI era transition, while his infinite game thinking helps organizations navigate continuous AI evolution without losing purpose.',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Articulate AI transformation "why", assess trust and safety levels, begin infinite game thinking, define Just Cause including human purpose.',
      'phase_2', 'Medium-term (6-18 months): Build robust Circle of Safety, practice courageous leadership through AI uncertainty, trust teams with AI decisions, strengthen belonging.',
      'phase_3', 'Long-term (18+ months): Maintain clear purpose through continuous AI evolution, sustain trust and safety, play infinite game successfully, embody Just Cause, build resilient culture.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'What is our "Why" for AI transformation?', 'context', 'Use when AI initiatives lack emotional resonance or commitment.', 'application', 'Apply Sinek''s Golden Circle to articulate purpose that inspires, starting with Why (purpose), moving through How (values), to What (AI tools).'),
      jsonb_build_object('question', 'Are we playing finite or infinite game with AI?', 'context', 'Use when AI strategy focuses on beating competitors rather than worthy cause.', 'application', 'Employ Sinek''s infinite game framework to shift from winning AI race to building enduring value and human-AI collaboration.'),
      jsonb_build_object('question', 'Do people feel safe enough to experiment with AI?', 'context', 'Use when AI adoption stalls due to fear of failure.', 'application', 'Use Sinek''s Circle of Safety to build trust and belonging that enables bold AI experimentation and learning from failure.'),
      jsonb_build_object('question', 'Does our AI Just Cause include human purpose?', 'context', 'Use when people question their relevance alongside AI.', 'application', 'Apply Sinek''s Just Cause framework to articulate vision where AI amplifies human purpose rather than replacing it.'),
      jsonb_build_object('question', 'Are leaders "eating last" during AI transition?', 'context', 'Use when leadership credibility suffers during AI disruption.', 'application', 'Employ Sinek''s servant leadership to ensure leaders sacrifice for teams, create safety, and build trust through AI uncertainty.'),
      jsonb_build_object('question', 'Are we trusting teams to find AI solutions?', 'context', 'Use when AI rollout is overly controlled from top.', 'application', 'Use Sinek''s trust frameworks to give teams autonomy in AI adoption, enabling local innovation and ownership.')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Articulate compelling "why" for AI beyond efficiency, assess trust and psychological safety, begin infinite game framing, define Just Cause including human purpose, communicate from Why to What.',
    'mediumTerm', 'Build robust Circle of Safety for AI learning, practice courageous leadership through uncertainty, trust teams with AI decisions, strengthen belonging, maintain infinite game mindset.',
    'longTerm', 'Sustain clear purpose through continuous AI evolution, maintain trust despite disruption, successfully play infinite game, live Just Cause, build resilient culture of belonging.'
  ),
  related_thinkers = ARRAY['Edgar Schein', 'Brené Brown', 'Jim Collins', 'Daniel Pink', 'Adam Grant']
WHERE thinker_name = 'Simon Sinek';

-- W. Edwards Deming
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'W. Edwards Deming''s System of Profound Knowledge, focus on quality management, and statistical thinking provide essential frameworks for managing AI systems. His work on variation, continuous improvement, and systems thinking enables organizations to deploy AI with rigor and learn systematically.',
    'key_concepts', jsonb_build_array(
      'System of Profound Knowledge',
      'Out of the Crisis and 14 Points',
      'Common cause vs. special cause variation',
      'Statistical process control',
      'PDSA cycle (Plan-Do-Study-Act)',
      'Theory of knowledge and prediction',
      'Psychology of change',
      'Understanding variation',
      'Optimization of systems',
      'Elimination of numerical quotas'
    ),
    'why_it_matters', 'AI systems introduce new sources of variation and require rigorous quality management. Deming''s frameworks provide the scientific approach necessary for reliable AI deployment and continuous improvement.',
    'ai_implications', jsonb_build_array(
      'AI outputs have both common and special cause variation',
      'Statistical thinking essential for AI quality management',
      'PDSA cycles necessary for AI experimentation',
      'AI systems require understanding of variation sources',
      'Optimization must consider AI as part of larger system'
    ),
    'recommended_practices', jsonb_build_array(
      'Apply statistical thinking to AI performance',
      'Distinguish common vs. special cause variation in AI',
      'Use PDSA cycles for AI experimentation',
      'Build System of Profound Knowledge for AI',
      'Eliminate fear and build trust in AI learning',
      'Drive out quotas, manage AI with understanding',
      'Optimize whole system including AI components',
      'Lead cultural transformation for quality AI'
    ),
    'common_pitfalls', jsonb_build_array(
      'Treating all AI variation as special cause',
      'Lacking statistical rigor in AI evaluation',
      'Skipping systematic experimentation (PDSA)',
      'Sub-optimizing AI without system view',
      'Managing AI with targets rather than understanding',
      'Fear-driven AI culture preventing learning',
      'Tampering with AI based on random variation'
    ),
    'success_metrics', jsonb_build_array(
      'AI variation understanding and management',
      'Statistical process control implementation',
      'PDSA cycle utilization for AI',
      'System thinking in AI deployment',
      'Fear reduction in AI experimentation',
      'Movement from targets to understanding',
      'Whole system optimization',
      'Quality culture maturity'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Deming''s frameworks become increasingly essential as AI introduces new variation sources, requires rigorous quality management, and must be optimized within larger systems rather than in isolation.',
    'cross_era_relevance', 'His System of Profound Knowledge provides the foundational framework for scientific AI deployment across all eras, while his cultural transformation principles enable learning-oriented AI adoption.',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Establish statistical thinking for AI, identify variation sources, begin PDSA cycles, assess AI quality management maturity.',
      'phase_2', 'Medium-term (6-18 months): Build System of Profound Knowledge for AI, implement statistical process control, optimize AI within whole system, drive out fear.',
      'phase_3', 'Long-term (18+ months): Achieve mature AI quality culture, continuous PDSA improvement, sophisticated variation management, system-level optimization, scientific AI management.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'Is this AI variation common cause or special cause?', 'context', 'Use when AI performance varies and intervention is considered.', 'application', 'Apply Deming''s variation framework to avoid tampering with common cause variation while addressing true special causes in AI systems.'),
      jsonb_build_object('question', 'Are we using PDSA cycles for AI experimentation?', 'context', 'Use when AI deployment lacks systematic learning.', 'application', 'Employ Deming''s PDSA cycle for rigorous AI experimentation: Plan hypothesis, Do small test, Study results, Act on learning.'),
      jsonb_build_object('question', 'Do we have System of Profound Knowledge for our AI?', 'context', 'Use when AI management lacks theoretical foundation.', 'application', 'Use Deming''s four-part system: appreciation of AI as system, knowledge of variation, theory of knowledge, psychology of AI change.'),
      jsonb_build_object('question', 'Are we optimizing AI or optimizing the whole system?', 'context', 'Use when AI excels locally but system performance suffers.', 'application', 'Apply Deming''s system thinking to optimize the whole including AI rather than sub-optimizing AI components in isolation.'),
      jsonb_build_object('question', 'Is fear preventing AI learning and improvement?', 'context', 'Use when AI failures hidden or experimentation avoided.', 'application', 'Employ Deming''s cultural transformation to eliminate fear, enable scientific AI learning, and build trust for honest AI evaluation.'),
      jsonb_build_object('question', 'Are we managing AI with quotas or with understanding?', 'context', 'Use when AI governed by numerical targets without process understanding.', 'application', 'Use Deming''s principles to replace quotas with deep understanding of AI processes, variation, and capability.')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Establish statistical thinking for AI, identify common vs. special cause variation, begin PDSA experimentation cycles, assess System of Profound Knowledge gaps, reduce fear in AI learning.',
    'mediumTerm', 'Build comprehensive System of Profound Knowledge for AI, implement statistical process control, optimize whole system with AI, replace targets with understanding, drive out fear systematically.',
    'longTerm', 'Achieve mature quality culture for AI, continuous scientific improvement through PDSA, sophisticated variation management, full system optimization, leadership by understanding not quotas.'
  ),
  related_thinkers = ARRAY['Joseph Juran', 'Genichi Taguchi', 'Peter Senge', 'Eliyahu Goldratt', 'Taiichi Ohno']
WHERE thinker_name = 'W. Edwards Deming';

-- John Maynard Keynes
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'John Maynard Keynes'' frameworks for understanding economic systems, the role of government intervention, animal spirits, and the paradoxes of saving and thrift provide essential context for thinking about AI''s economic implications. His work on aggregate demand, investment psychology, and managing economic transitions helps frame AI transformation economics.',
    'key_concepts', jsonb_build_array(
      'Aggregate demand and economic equilibrium',
      'Animal spirits and investment psychology',
      'Paradox of thrift',
      'Government intervention in markets',
      'Liquidity preference and uncertainty',
      'Marginal propensity to consume',
      'Sticky wages and prices',
      'Keynesian economics and stimulus',
      'Economic Possibilities for our Grandchildren',
      'Beauty contest theory of markets'
    ),
    'why_it_matters', 'AI drives fundamental economic transformation requiring Keynesian-scale intervention thinking. His frameworks for managing aggregate demand, investment psychology, and transitions help navigate AI''s economic disruption.',
    'ai_implications', jsonb_build_array(
      'AI may trigger aggregate demand shortfall as jobs automated',
      'Animal spirits around AI investment drive boom-bust cycles',
      'Paradox of AI: individual firm optimization may harm aggregate economy',
      'Government intervention may be necessary for AI transition management',
      'Uncertainty about AI economic impact creates investment hesitation'
    ),
    'recommended_practices', jsonb_build_array(
      'Monitor aggregate demand effects of AI automation',
      'Manage animal spirits in AI investment cycles',
      'Recognize paradoxes where rational AI adoption harms whole',
      'Consider intervention to smooth AI economic transition',
      'Address liquidity preference during AI uncertainty',
      'Plan for sticky wage adjustment to AI',
      'Stimulate demand as AI displaces workers',
      'Think long-term about AI economic possibilities'
    ),
    'common_pitfalls', jsonb_build_array(
      'Assuming AI productivity automatically increases prosperity',
      'Ignoring aggregate demand effects of automation',
      'Underestimating animal spirits in AI investment',
      'Neglecting transition management and intervention needs',
      'Failing to address coordination problems',
      'Assuming wages adjust frictionlessly to AI',
      'Missing paradoxes of AI optimization'
    ),
    'success_metrics', jsonb_build_array(
      'Aggregate demand stability during AI transition',
      'Investment volatility management',
      'Employment and income maintenance',
      'Intervention effectiveness when needed',
      'Smooth economic adjustment to AI',
      'Prosperity broadly shared',
      'Long-term economic possibility realization',
      'Coordination problem resolution'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Keynesian frameworks become critical as AI automation threatens aggregate demand, creates investment booms/busts driven by animal spirits, and requires intervention to manage economic transition.',
    'cross_era_relevance', 'His thinking about economic transitions, government role, and long-term possibilities provides essential context for understanding AI''s economic transformation across all eras.',
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Monitor AI''s aggregate demand effects, track investment psychology and animal spirits, identify potential paradoxes, assess intervention needs.',
      'phase_2', 'Medium-term (6-18 months): Manage AI investment cycles, address aggregate demand shortfalls, smooth economic transition, coordinate across actors, maintain prosperity.',
      'phase_3', 'Long-term (18+ months): Navigate complete AI economic transformation, realize long-term economic possibilities, manage sustained prosperity, resolve macro-level paradoxes.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object('question', 'What are aggregate demand effects of our AI automation?', 'context', 'Use when AI increases productivity but may reduce purchasing power.', 'application', 'Apply Keynesian aggregate demand framework to assess whether AI automation maintains sufficient demand to buy AI-produced output.'),
      jsonb_build_object('question', 'Are animal spirits driving our AI investment decisions?', 'context', 'Use when AI investment shows boom-bust patterns.', 'application', 'Employ Keynes'' animal spirits concept to recognize when psychological factors overwhelm rational AI investment analysis.'),
      jsonb_build_object('question', 'What paradoxes exist where rational AI adoption harms the whole?', 'context', 'Use when individual AI optimization reduces collective welfare.', 'application', 'Use Keynesian paradox thinking (paradox of thrift) to identify where rational firm-level AI decisions create system-level problems.'),
      jsonb_build_object('question', 'Does AI economic transition require intervention?', 'context', 'Use when market forces alone may not manage AI disruption well.', 'application', 'Apply Keynesian intervention framework to identify when active management, stimulus, or coordination needed for smooth AI transition.'),
      jsonb_build_object('question', 'How does AI uncertainty affect investment and liquidity?', 'context', 'Use when AI uncertainty freezes investment and economic activity.', 'application', 'Employ Keynes'' liquidity preference to understand how AI uncertainty drives cash hoarding, reducing investment and economic activity.'),
      jsonb_build_object('question', 'What are AI''s long-term economic possibilities?', 'context', 'Use when thinking beyond immediate AI disruption to future prosperity.', 'application', 'Use Keynes'' "Economic Possibilities" thinking to envision abundance, leisure, and human flourishing enabled by AI productivity.')
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Monitor aggregate demand effects of AI, track animal spirits in AI investment, identify potential economic paradoxes, assess intervention needs, address liquidity preference during uncertainty.',
    'mediumTerm', 'Manage AI investment cycles and animal spirits, address aggregate demand maintenance, coordinate economic transition smoothly, resolve paradoxes through intervention when needed.',
    'longTerm', 'Navigate complete AI economic transformation with managed aggregate demand, realize Keynesian vision of abundance and possibility, maintain broadly shared prosperity, resolve macro-level coordination problems.'
  ),
  related_thinkers = ARRAY['Friedrich Hayek', 'Paul Krugman', 'Joseph Stiglitz', 'Hyman Minsky', 'Joan Robinson']
WHERE thinker_name = 'John Maynard Keynes';