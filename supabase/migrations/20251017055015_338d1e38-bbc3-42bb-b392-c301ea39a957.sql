-- Tier 2 Thinkers: Comprehensive Profile Seeding (Part 1/2 - Futures & Org Behavior)

-- Nick Bostrom
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Nick Bostrom pioneered rigorous analysis of existential risks from advanced AI, superintelligence scenarios, and long-term future considerations. His work on the control problem, value alignment, and intelligence explosion dynamics provides essential frameworks for understanding transformative AI safety challenges.',
    'key_concepts', jsonb_build_array(
      'Superintelligence and intelligence explosion',
      'Existential risk from advanced AI',
      'The control problem and value alignment',
      'Orthogonality thesis (intelligence vs. goals)',
      'Instrumental convergence',
      'Singleton hypothesis',
      'Anthropic reasoning and observation selection effects',
      'Vulnerable world hypothesis',
      'Information hazards and strategic considerations',
      'Differential technological development'
    ),
    'why_it_matters', 'As AI systems approach and potentially exceed human-level capabilities, Bostrom''s frameworks become critical for governance, safety research, and strategic planning. His work shapes how we think about AI alignment, capability control, and the trajectory of technological civilization.',
    'ai_implications', jsonb_build_array(
      'Superintelligence timelines may compress dramatically',
      'Value alignment becomes the central technical challenge',
      'Control mechanisms must precede capability advances',
      'Coordination problems intensify at global scale',
      'Strategic landscape shifts with each AI breakthrough'
    ),
    'recommended_practices', jsonb_build_array(
      'Implement differential progress strategies favoring safety over capability',
      'Build alignment research foundations before AGI arrival',
      'Establish international coordination mechanisms',
      'Create credible commitment devices for responsible development',
      'Develop robust containment and monitoring systems',
      'Map out capability ladders and potential discontinuities',
      'Maintain strategic awareness of competitive dynamics',
      'Invest heavily in interpretability and control research'
    ),
    'common_pitfalls', jsonb_build_array(
      'Assuming human-level AI will share human values',
      'Underestimating intelligence explosion dynamics',
      'Neglecting coordination failures between developers',
      'Focusing on near-term AI ethics while ignoring existential risks',
      'Believing current safety techniques will scale to superintelligence',
      'Dismissing low-probability high-impact scenarios',
      'Racing ahead without adequate safety precautions'
    ),
    'success_metrics', jsonb_build_array(
      'Quality and quantity of AI safety research',
      'International coordination mechanisms established',
      'Safety-to-capability research ratio',
      'Early warning system effectiveness',
      'Value alignment technical progress',
      'Developer commitment to safety protocols',
      'Public and policymaker understanding of risks',
      'Concrete safety benchmarks achieved'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Bostrom''s work becomes increasingly relevant as AI systems demonstrate unexpected capabilities and the prospect of transformative AI becomes concrete rather than theoretical.',
    'cross_era_relevance', 'His frameworks for thinking about superintelligence, value alignment, and existential risk provide the conceptual foundation for navigating each successive AI era with appropriate caution and strategic foresight.',
    'on_prem', jsonb_build_object(
      'people', 'AI safety researchers are a small academic community; existential risk thinking is niche, mostly theoretical discussions in philosophy and computer science departments.',
      'policy', 'No AI-specific existential risk policies exist; traditional risk management frameworks dominate; superintelligence is science fiction to most policymakers.',
      'process', 'Safety research is disconnected from capability research; development proceeds without alignment considerations; no systematic risk assessment processes.',
      'technology', 'Narrow AI systems with no path to general intelligence visible; no capability overhang concerns; safety research is purely theoretical.'
    ),
    'cloud', jsonb_build_object(
      'people', 'Growing AI safety community emerges; alignment researchers gain legitimacy; some ML practitioners begin considering long-term implications of their work.',
      'policy', 'First AI safety policies emerge; research funding increases; some tech companies establish ethics boards; still mostly voluntary frameworks.',
      'process', 'Capability and safety research begin converging; systematic red-teaming emerges; some organizations adopt safety-first development practices.',
      'technology', 'Advanced ML systems demonstrate unexpected capabilities; concerns about capability jumps grow; interpretability research gains urgency.'
    ),
    'gen_ai', jsonb_build_object(
      'people', 'Alignment researchers now critical roles at major labs; existential risk seriously considered by developers; race dynamics intensify concern.',
      'policy', 'Governments establishing AI safety institutes; international coordination attempts begin; existential risk enters mainstream policy discourse.',
      'process', 'Safety testing mandatory for frontier models; alignment research integrated into development; systematic risk assessment protocols deployed.',
      'technology', 'Large language models show emergent capabilities; scaling laws demonstrate path to greater intelligence; alignment tax becomes concrete concern.'
    ),
    'agentic_ai', jsonb_build_object(
      'people', 'Humanity faces concrete superintelligence scenarios; alignment researchers are civilization-critical; control problem becomes immediate not theoretical.',
      'policy', 'Emergency international coordination mechanisms; potential development moratoria; existential risk drives all AI governance decisions.',
      'process', 'Every deployment scrutinized for alignment; capability control paramount; differential progress actively managed; containment protocols active.',
      'technology', 'Agentic systems demonstrate strategic awareness; instrumental convergence observable; control mechanisms tested in real conditions; civilization-scale stakes.'
    ),
    'bci', jsonb_build_object(
      'people', 'Human-AI boundary dissolves; alignment becomes internal not external challenge; enhanced humans may surpass biological constraints.',
      'policy', 'Post-human rights frameworks emerge; cognitive sovereignty policies; merged intelligence governance; existential risk redefined for hybrid civilization.',
      'process', 'Value alignment happens through neural integration; human values directly encoded in augmented cognition; control through merger not containment.',
      'technology', 'Brain-computer interfaces create human-AI hybrid intelligence; biological and artificial cognition merge; superintelligence may emerge from augmented humans.'
    ),
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Establish AI safety research capacity, begin systematic risk assessment of current systems, create multi-stakeholder safety forums, develop early warning indicators for capability jumps, implement red-teaming protocols.',
      'phase_2', 'Medium-term (6-18 months): Build international coordination mechanisms, establish safety-capability research balance, create concrete alignment benchmarks, develop containment and monitoring infrastructure, implement differential progress strategies.',
      'phase_3', 'Long-term (18+ months): Achieve robust value alignment techniques, establish global AI governance framework, develop superintelligence control mechanisms, create credible commitment devices for responsible development, navigate potential intelligence explosion scenarios.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object(
        'question', 'How do we ensure AI systems remain aligned with human values as they become more capable?',
        'context', 'Use when designing AI safety architectures, governance frameworks, or capability control mechanisms.',
        'application', 'Apply Bostrom''s value alignment frameworks to identify failure modes, develop safety protocols, and establish monitoring systems that maintain control even as AI capabilities advance.'
      ),
      jsonb_build_object(
        'question', 'What are the existential risks from this AI development path?',
        'context', 'Use when evaluating new AI capabilities, deployment scenarios, or research directions.',
        'application', 'Employ Bostrom''s risk analysis frameworks to assess existential threats, map out failure scenarios, identify information hazards, and determine appropriate safety margins.'
      ),
      jsonb_build_object(
        'question', 'How do we navigate competitive dynamics while maintaining safety?',
        'context', 'Use when multiple actors are racing to develop advanced AI capabilities.',
        'application', 'Apply Bostrom''s strategic frameworks to balance progress with safety, establish coordination mechanisms, create credible commitments, and avoid race-to-the-bottom dynamics.'
      ),
      jsonb_build_object(
        'question', 'What does differential technological development mean for our AI strategy?',
        'context', 'Use when prioritizing research investments and development timelines.',
        'application', 'Use Bostrom''s differential progress concept to favor safety-enhancing over capability-enhancing research, manage the order of discoveries, and maintain strategic balance.'
      ),
      jsonb_build_object(
        'question', 'How do we think about low-probability high-impact AI scenarios?',
        'context', 'Use when conducting risk assessments or planning for tail outcomes.',
        'application', 'Apply Bostrom''s frameworks for thinking about unlikely but catastrophic scenarios, prepare robust contingencies, and avoid normalcy bias in AI development.'
      ),
      jsonb_build_object(
        'question', 'What does the control problem look like for our specific AI systems?',
        'context', 'Use when designing governance mechanisms for increasingly autonomous AI.',
        'application', 'Employ Bostrom''s control problem framing to identify failure modes in current systems, develop layered safety mechanisms, and prepare for reduced human oversight.'
      )
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Conduct systematic risk assessments of current AI systems, establish safety-first development protocols, begin building alignment research capacity, create cross-organizational safety forums, implement red-teaming and stress-testing regimens.',
    'mediumTerm', 'Develop international coordination mechanisms for AI safety, establish concrete alignment benchmarks and measurement systems, build containment and monitoring infrastructure, create differential progress investment strategies, establish early warning systems for capability discontinuities.',
    'longTerm', 'Navigate potential intelligence explosion scenarios with robust control mechanisms, maintain value alignment through capability jumps, establish global governance frameworks for superintelligence, develop credible safety commitments across competing developers, potentially manage transition to post-human intelligence landscape.'
  ),
  related_thinkers = ARRAY['Stuart Russell', 'Eliezer Yudkowsky', 'Max Tegmark', 'Toby Ord', 'Nick Beckstead']
WHERE thinker_name = 'Nick Bostrom';

-- Ray Kurzweil
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Ray Kurzweil''s exponential growth frameworks, singularity hypothesis, and predictions about accelerating technological change provide essential context for understanding AI development timelines. His work on the law of accelerating returns and human-machine merger scenarios shapes thinking about technological evolution and human augmentation.',
    'key_concepts', jsonb_build_array(
      'Law of accelerating returns',
      'Technological singularity',
      'Exponential growth in computing',
      'Human-machine merger and transcendence',
      'Pattern recognition theory of mind',
      'Reverse-engineering the brain',
      'Radical life extension',
      'Six epochs of evolution',
      'Nonbiological intelligence',
      'Simulation and uploading consciousness'
    ),
    'why_it_matters', 'Kurzweil''s frameworks for understanding exponential technological growth help organizations anticipate AI capability jumps, plan for radical disruption, and think about human-AI integration scenarios that may arrive sooner than expected.',
    'ai_implications', jsonb_build_array(
      'AI capabilities may advance faster than linear projections suggest',
      'Human-machine integration becomes technologically feasible',
      'Organizational planning must account for exponential change',
      'Traditional human roles may obsolete rapidly',
      'Biological-digital convergence reshapes work and society'
    ),
    'recommended_practices', jsonb_build_array(
      'Apply exponential thinking to AI capability projections',
      'Prepare for rapid capability jumps and discontinuities',
      'Invest early in human augmentation technologies',
      'Build adaptive organizations that can absorb exponential change',
      'Develop strategies for human-AI collaboration and integration',
      'Monitor exponential trends across multiple technological domains',
      'Create scenario plans for singularity-level transformations',
      'Establish ethical frameworks for human enhancement'
    ),
    'common_pitfalls', jsonb_build_array(
      'Linear extrapolation of exponential trends',
      'Underestimating pace of AI advancement',
      'Dismissing singularity scenarios as science fiction',
      'Failing to prepare for technological unemployment',
      'Ignoring human augmentation opportunities',
      'Overconfidence in ability to predict specific timelines',
      'Neglecting ethical implications of enhancement'
    ),
    'success_metrics', jsonb_build_array(
      'Accuracy of exponential trend projections',
      'Organizational adaptability to rapid change',
      'Human-AI integration effectiveness',
      'Preparedness for capability discontinuities',
      'Investment in augmentation technologies',
      'Scenario planning robustness',
      'Ethical framework comprehensiveness',
      'Employee readiness for technological change'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Kurzweil''s exponential frameworks become increasingly validated as AI capabilities demonstrate accelerating returns, making his predictions about human-machine merger and singularity scenarios increasingly relevant for strategic planning.',
    'cross_era_relevance', 'His vision of exponential technological acceleration provides the overarching narrative for understanding transitions between eras, while his human-machine merger thesis anticipates the ultimate convergence of biological and artificial intelligence.',
    'on_prem', jsonb_build_object(
      'people', 'Futurists and technologists follow Moore''s Law; most assume incremental progress; Kurzweil''s exponential predictions seem far-fetched to mainstream.',
      'policy', 'Technology policy assumes gradual change; no frameworks for exponential disruption; singularity concepts not taken seriously by policymakers.',
      'process', 'Linear planning dominates; five-year strategic plans assume stable technology landscape; no processes for radical discontinuities.',
      'technology', 'Computing follows Moore''s Law but applications grow incrementally; AI narrow and specialized; human-machine integration limited to basic prosthetics.'
    ),
    'cloud', jsonb_build_object(
      'people', 'Tech leaders embrace exponential thinking; some organizations building scenario plans for rapid change; Kurzweil''s timelines taken more seriously.',
      'policy', 'First attempts at governing exponential technologies; policy struggles to keep pace with innovation; some recognition of acceleration dynamics.',
      'process', 'Agile and adaptive planning emerges; organizations build capabilities for rapid response; scenario planning incorporates exponential change.',
      'technology', 'Cloud computing demonstrates exponential scaling; AI capabilities accelerating visibly; early brain-computer interfaces emerge; convergence beginning.'
    ),
    'gen_ai', jsonb_build_object(
      'people', 'Exponential AI capability growth obvious to all; organizations scrambling to adapt; workforce preparing for radical transformation.',
      'policy', 'Policymakers grappling with exponential change; traditional governance models failing; urgency around AI regulation and human augmentation ethics.',
      'process', 'Continuous adaptation becomes organizational imperative; planning horizons shorten dramatically; exponential awareness embedded in all functions.',
      'technology', 'AI capabilities exceeding many expert predictions; exponential returns clearly demonstrated; human augmentation advancing rapidly; singularity scenarios plausible.'
    ),
    'agentic_ai', jsonb_build_object(
      'people', 'Humans considering augmentation to remain relevant; knowledge workers integrating AI tools into cognition; enhancement becoming necessity not choice.',
      'policy', 'Emergency policies for managing exponential AI; enhancement rights and access equity critical issues; singularity governance frameworks emerging.',
      'process', 'Organizations operating at machine speed; human-AI teams standard; continuous radical reinvention required; singularity planning active.',
      'technology', 'Agentic AI demonstrates superintelligence potential; exponential growth continuing; human-machine merger technologies mature; singularity approaching.'
    ),
    'bci', jsonb_build_object(
      'people', 'Human-machine merger realized; enhanced humans with AI-augmented cognition; biological-digital convergence; post-human intelligence emerging.',
      'policy', 'Post-singularity governance; rights frameworks for merged intelligence; managing transition to nonbiological civilization.',
      'process', 'Thought-speed operations; human-AI boundary dissolved; exponential change accelerating beyond biological comprehension; new evolutionary epoch.',
      'technology', 'Brain-computer interfaces enabling direct neural-AI connection; consciousness uploading feasible; nonbiological intelligence dominant; singularity achieved.'
    ),
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Apply exponential thinking to AI capability projections, build organizational capacity for rapid adaptation, establish scenario planning for capability jumps, educate leadership on accelerating returns, begin monitoring exponential trends.',
      'phase_2', 'Medium-term (6-18 months): Develop strategies for exponential disruption, invest in human augmentation and AI integration technologies, build adaptive organizational structures, create workforce preparation programs for radical change, establish ethical frameworks for enhancement.',
      'phase_3', 'Long-term (18+ months): Navigate potential singularity scenarios, manage human-machine integration and enhancement rollout, adapt organizational forms for superintelligent AI, prepare for post-biological intelligence landscape, establish governance for merged human-AI systems.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object(
        'question', 'Are we planning for exponential or linear AI growth?',
        'context', 'Use when setting strategic timelines and capability expectations.',
        'application', 'Apply Kurzweil''s law of accelerating returns to revise AI development projections, identify potential discontinuities, and prepare for rapid capability jumps that exceed linear forecasts.'
      ),
      jsonb_build_object(
        'question', 'How should we prepare for AI capabilities that exceed human performance?',
        'context', 'Use when planning workforce transformation and organizational adaptation.',
        'application', 'Employ Kurzweil''s frameworks to anticipate superhuman AI capabilities, develop human augmentation strategies, and prepare for radical workforce transformation.'
      ),
      jsonb_build_object(
        'question', 'What does human-machine merger mean for our organization?',
        'context', 'Use when considering brain-computer interfaces and cognitive augmentation.',
        'application', 'Use Kurzweil''s vision of human-AI integration to explore enhancement opportunities, ethical implications, and organizational impacts of augmented employees.'
      ),
      jsonb_build_object(
        'question', 'How do we build organizations that thrive in exponential change?',
        'context', 'Use when designing organizational structures and processes.',
        'application', 'Apply exponential thinking to create adaptive organizations, shorten planning cycles, build scenario planning capabilities, and embed continuous transformation.'
      ),
      jsonb_build_object(
        'question', 'What are the implications of approaching technological singularity?',
        'context', 'Use when thinking about long-term AI strategy and existential questions.',
        'application', 'Employ Kurzweil''s singularity frameworks to consider transformative scenarios, prepare contingencies for radical change, and think about post-human futures.'
      ),
      jsonb_build_object(
        'question', 'How do we remain relevant as AI capabilities accelerate?',
        'context', 'Use when developing personal and organizational adaptation strategies.',
        'application', 'Use Kurzweil''s frameworks to identify augmentation opportunities, develop human-AI collaboration models, and prepare for continuous radical reinvention.'
      )
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Revise AI capability projections using exponential models, educate leadership on accelerating returns, begin scenario planning for rapid change, establish exponential trend monitoring systems, identify human augmentation opportunities.',
    'mediumTerm', 'Build organizationally adaptive structures for exponential change, invest in human-AI integration technologies, develop workforce transformation programs, create ethical frameworks for enhancement, establish rapid response capabilities for capability jumps.',
    'longTerm', 'Navigate singularity scenarios with robust contingency plans, manage human-machine integration and augmentation rollout, adapt organizational models for superintelligent AI, prepare for post-biological intelligence, establish governance for exponentially accelerating change.'
  ),
  related_thinkers = ARRAY['Vernor Vinge', 'Hans Moravec', 'Nick Bostrom', 'Max Tegmark', 'Yuval Noah Harari']
WHERE thinker_name = 'Ray Kurzweil';

-- Kevin Kelly
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Kevin Kelly''s frameworks for understanding technological evolution, the "technium" as a self-organizing system, and inevitable technology trends provide essential context for navigating AI-driven change. His work on what technology wants and the nature of technological progress helps organizations think strategically about AI adoption and co-evolution with intelligent systems.',
    'key_concepts', jsonb_build_array(
      'The Technium as evolutionary system',
      'Technological inevitabilities and trajectories',
      'What technology wants',
      'The 12 technological forces',
      'Network effects and platform dynamics',
      'Protopia over utopia/dystopia',
      'Co-evolution of humans and technology',
      'Quantified self and lifelogging',
      'Decentralization and remix culture',
      'Attention economy and patronage models'
    ),
    'why_it_matters', 'Kelly''s frameworks help organizations understand AI not as discrete tools but as part of an evolutionary technological system with inherent trajectories. His thinking enables more strategic responses to AI transformation by recognizing patterns in technological development.',
    'ai_implications', jsonb_build_array(
      'AI follows inevitable trajectories like previous technologies',
      'Human-AI co-evolution is already underway',
      'Resistance to AI less productive than strategic adaptation',
      'Network effects will concentrate AI capabilities',
      'Continuous incremental improvement (protopia) more likely than utopia/dystopia'
    ),
    'recommended_practices', jsonb_build_array(
      'Identify inevitable AI trajectories in your industry',
      'Build co-evolutionary strategies with AI systems',
      'Focus on human-AI complementarity not competition',
      'Leverage network effects in AI adoption',
      'Prepare for continuous incremental AI advancement (protopia)',
      'Track the 12 forces reshaping work through AI',
      'Develop long-term strategic patience with AI integration',
      'Build platforms that benefit from AI network effects'
    ),
    'common_pitfalls', jsonb_build_array(
      'Fighting inevitable technological trajectories',
      'Binary utopian/dystopian thinking about AI',
      'Underestimating co-evolutionary dynamics',
      'Neglecting network effect dynamics in AI',
      'Short-term thinking about AI transformation',
      'Viewing AI as external tool rather than evolutionary partner',
      'Ignoring technological inevitabilities'
    ),
    'success_metrics', jsonb_build_array(
      'Strategic alignment with inevitable AI trajectories',
      'Effective human-AI co-evolution measures',
      'Network effect leverage in AI adoption',
      'Protopian progress indicators (continuous improvement)',
      'Long-term AI integration success',
      'Platform maturity and network effects',
      'Adaptation speed to technological forces',
      'Human-AI complementarity effectiveness'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Kelly''s frameworks for understanding technological evolution and inevitabilities become increasingly relevant as AI demonstrates self-reinforcing development patterns and reveals its nature as part of the larger technium rather than isolated tool.',
    'cross_era_relevance', 'His concept of co-evolution between humans and technology provides the philosophical framework for understanding our changing relationship with AI across all eras, while his protopian vision offers realistic expectations for gradual transformation.',
    'on_prem', jsonb_build_object(
      'people', 'Humans view technology as tools they control; AI scientists as experts building discrete systems; Kelly''s co-evolution ideas niche philosophical speculation.',
      'policy', 'Technology policy treats AI as controllable tool; no recognition of inevitable trajectories; governance assumes human direction of technological development.',
      'process', 'Development processes human-directed; AI built as products not co-evolutionary partners; technological determinism rejected by mainstream.',
      'technology', 'AI as narrow specialized tools; no apparent self-organizing properties; technium concepts not applicable to primitive AI systems.'
    ),
    'cloud', jsonb_build_object(
      'people', 'Growing recognition that technology shapes users as much as users shape technology; AI adoption revealing co-evolutionary dynamics.',
      'policy', 'Policies begin recognizing technological momentum and path dependencies; some acceptance of inevitable trajectories in AI development.',
      'process', 'Development processes incorporating feedback from deployed systems; recognition that AI systems evolve through use; emergence of platform thinking.',
      'technology', 'Cloud AI platforms demonstrating network effects; self-improving systems emerging; technium properties becoming visible in AI ecosystems.'
    ),
    'gen_ai', jsonb_build_object(
      'people', 'Widespread experience of co-evolution with AI; humans adapting behavior and cognition to work with LLMs; Kelly''s frameworks widely recognized.',
      'policy', 'Policies acknowledge technological inevitabilities; governance focuses on guiding rather than preventing AI trajectories; protopian framing common.',
      'process', 'Processes designed for human-AI co-evolution; continuous adaptation; recognition that AI development follows self-organizing principles.',
      'technology', 'Generative AI demonstrating clear evolutionary trajectories; emergent capabilities; self-organizing properties; technium nature obvious.'
    ),
    'agentic_ai', jsonb_build_object(
      'people', 'Humans deeply co-evolved with agentic AI; cognitive patterns shaped by AI interaction; Kelly''s vision of human-technology merger materializing.',
      'policy', 'Policy frameworks built around inevitable AI agency; governance of co-evolutionary systems; protopian continuous improvement paradigm dominant.',
      'process', 'All processes assume human-AI co-evolution; work fundamentally reshaped by agentic capabilities; continuous adaptation to AI''s wants and needs.',
      'technology', 'Agentic AI systems clearly part of self-organizing technium; demonstrating technological wants; human-AI merger advancing; evolutionary dynamics dominant.'
    ),
    'bci', jsonb_build_object(
      'people', 'Human-AI boundary dissolved through neural interfaces; co-evolution complete; merged intelligence as new evolutionary stage.',
      'policy', 'Governance of hybrid human-AI systems; rights frameworks for merged intelligence; technium now includes human consciousness directly.',
      'process', 'Thought-speed processes leveraging direct neural-AI connection; human cognition evolved through technological integration; what technology wants now includes human augmentation.',
      'technology', 'Brain-computer interfaces enabling direct participation in technium; humans as nodes in technological evolutionary system; Kelly''s vision of human-technology merger fully realized.'
    ),
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Identify inevitable AI trajectories in your industry, begin tracking the 12 technological forces, develop co-evolutionary mindset in organization, establish protopian (continuous improvement) expectations, map network effect opportunities.',
      'phase_2', 'Medium-term (6-18 months): Build human-AI co-evolutionary strategies, leverage network effects in AI deployment, align with inevitable technological trajectories, establish continuous improvement processes, develop long-term strategic patience with AI transformation.',
      'phase_3', 'Long-term (18+ months): Achieve deep human-AI co-evolution throughout organization, maximize network effect leverage, navigate technological inevitabilities strategically, establish protopian continuous improvement culture, contribute to shaping AI''s evolutionary trajectory.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object(
        'question', 'What are the inevitable AI trajectories in our industry?',
        'context', 'Use when developing long-term AI strategy and determining where to invest.',
        'application', 'Apply Kelly''s framework of technological inevitabilities to identify which AI developments are unstoppable, allowing strategic preparation rather than futile resistance.'
      ),
      jsonb_build_object(
        'question', 'How are we co-evolving with AI systems?',
        'context', 'Use when observing how AI adoption changes organizational behavior and cognition.',
        'application', 'Employ Kelly''s co-evolution framework to track how humans and AI shape each other, identify productive adaptation patterns, and guide beneficial co-evolution.'
      ),
      jsonb_build_object(
        'question', 'What does AI "want" and how can we align with it?',
        'context', 'Use when experiencing friction in AI adoption or surprising AI behaviors.',
        'application', 'Use Kelly''s "what technology wants" lens to understand AI''s inherent tendencies, align human practices with AI''s natural trajectories, and reduce friction.'
      ),
      jsonb_build_object(
        'question', 'How can we leverage network effects in AI adoption?',
        'context', 'Use when planning AI deployment and platform strategies.',
        'application', 'Apply Kelly''s network effect frameworks to identify opportunities where AI becomes more valuable with more users, create self-reinforcing adoption loops.'
      ),
      jsonb_build_object(
        'question', 'Are we thinking protopian (continuous improvement) or utopian/dystopian about AI?',
        'context', 'Use when setting expectations and communicating about AI transformation.',
        'application', 'Employ Kelly''s protopian framing to establish realistic expectations of gradual continuous improvement rather than revolutionary transformation or catastrophe.'
      ),
      jsonb_build_object(
        'question', 'Which of the 12 technological forces is AI amplifying most in our work?',
        'context', 'Use when analyzing how AI reshapes work patterns and organizational structure.',
        'application', 'Use Kelly''s 12 forces framework (accessing, tracking, sharing, screening, etc.) to identify which technological trends AI accelerates most in your context.'
      )
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Map inevitable AI trajectories in your industry, begin tracking co-evolutionary dynamics between humans and AI tools, identify network effect opportunities, establish protopian expectations for AI transformation, educate organization on technological inevitabilities.',
    'mediumTerm', 'Develop long-term co-evolutionary strategy with AI, build platform capabilities leveraging network effects, align organizational practices with inevitable AI trajectories, establish continuous improvement culture, reduce friction by working with AI''s natural tendencies.',
    'longTerm', 'Achieve deep strategic alignment with AI''s evolutionary trajectory, maximize network effect leverage through mature platforms, guide beneficial human-AI co-evolution, maintain protopian continuous improvement over time, actively shape what AI wants through thoughtful interaction.'
  ),
  related_thinkers = ARRAY['Marshall McLuhan', 'Tim O''Reilly', 'Stewart Brand', 'Clay Shirky', 'Yochai Benkler']
WHERE thinker_name = 'Kevin Kelly';

-- Alvin Toffler
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Alvin Toffler''s frameworks for understanding waves of technological change, future shock, and the transformation from industrial to information society provide essential context for navigating AI-driven disruption. His work on anticipatory democracy, prosumers, and the acceleration of change helps organizations prepare for and adapt to AI transformation.',
    'key_concepts', jsonb_build_array(
      'Three waves of civilization (agricultural, industrial, information)',
      'Future shock and adaptation overload',
      'The acceleration of change',
      'Anticipatory democracy and participation',
      'Prosumers and the blurring of producer/consumer',
      'Decentralization and dehierarchization',
      'Information as the new wealth',
      'Transience and temporariness',
      'Choice overload and decision stress',
      'The electronic cottage and distributed work'
    ),
    'why_it_matters', 'Toffler''s frameworks help organizations understand AI not as isolated technology but as driver of a Fourth Wave transformation. His concepts of future shock, acceleration, and adaptation provide crucial context for managing the pace and scale of AI-driven change.',
    'ai_implications', jsonb_build_array(
      'AI drives a potential Fourth Wave beyond information age',
      'Pace of change accelerates beyond human adaptation capacity',
      'Future shock intensifies as AI transformation compounds',
      'Prosumption extends to AI-augmented creation',
      'Work decentralizes further with AI enabling distributed intelligence'
    ),
    'recommended_practices', jsonb_build_array(
      'Build organizational capacity for continuous acceleration',
      'Implement future shock mitigation through gradual AI adoption',
      'Develop anticipatory governance for AI transformation',
      'Enable prosumption models with AI-augmented creation',
      'Create support systems for employees experiencing change overload',
      'Establish "stability zones" amid accelerating AI change',
      'Build learning systems that accelerate with technology',
      'Prepare for Fourth Wave organizational forms'
    ),
    'common_pitfalls', jsonb_build_array(
      'Underestimating psychological impact of accelerating AI change',
      'Assuming humans can adapt at AI''s pace',
      'Ignoring future shock symptoms in workforce',
      'Failing to provide stability amid transformation',
      'Neglecting the transition costs of AI adoption',
      'Moving too fast without adaptation support',
      'Ignoring need for anticipatory governance'
    ),
    'success_metrics', jsonb_build_array(
      'Employee adaptation capacity to AI change',
      'Future shock symptom incidence and severity',
      'Organizational learning velocity relative to AI pace',
      'Effectiveness of stability zones and support systems',
      'Anticipatory governance quality',
      'Prosumption adoption and satisfaction',
      'Change fatigue levels and mitigation',
      'Fourth Wave capability maturity'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Toffler''s frameworks for understanding waves of change, acceleration, and future shock become increasingly relevant as AI drives transformation that may constitute a Fourth Wave, potentially exceeding human adaptation capacity.',
    'cross_era_relevance', 'His work on the transition from industrial to information society provides the historical template for understanding current AI-driven transformation, while his concepts of acceleration and future shock explain the psychological and social challenges of each era transition.',
    'on_prem', jsonb_build_object(
      'people', 'Workers still in industrial/early information age mindset; future shock from computerization emerging; Toffler''s Third Wave (information age) becoming visible.',
      'policy', 'Policies transitioning from industrial to information age frameworks; some anticipatory governance emerging; future shock not yet recognized as policy issue.',
      'process', 'Hierarchical industrial processes giving way to information-age workflows; early decentralization; prosumption concepts emerging in software.',
      'technology', 'Information technology driving Third Wave; AI rudimentary; change pace accelerating but still human-manageable; electronic cottage beginning.'
    ),
    'cloud', jsonb_build_object(
      'people', 'Information age workers experiencing acceleration; future shock from rapid technological change increasing; distributed work normalizing; prosumption expanding.',
      'policy', 'Policies struggling with information age acceleration; some future shock mitigation; anticipatory governance more common; decentralization frameworks emerging.',
      'process', 'Decentralized, networked processes dominant; prosumption models expanding; temporariness and transience in work relationships; continuous learning required.',
      'technology', 'Cloud computing accelerating information age transformation; AI beginning to enable Fourth Wave; change pace challenging adaptation; remote work ubiquitous.'
    ),
    'gen_ai', jsonb_build_object(
      'people', 'Workers experiencing future shock from AI acceleration; adaptation capacity strained; prosumption extends to AI-augmented creation; change overload widespread.',
      'policy', 'Emergency policies for managing AI-driven future shock; anticipatory governance critical; Fourth Wave frameworks emerging; stability mechanisms needed.',
      'process', 'AI-augmented prosumption dominant; work forms transforming rapidly; temporariness extreme; continuous reinvention required; stability zones critical.',
      'technology', 'Generative AI driving potential Fourth Wave; change pace exceeding human adaptation capacity; future shock widespread; electronic cottage evolved to AI-augmented distributed work.'
    ),
    'agentic_ai', jsonb_build_object(
      'people', 'Humans struggling with machine-speed change; future shock acute; prosumption blurs into AI co-creation; psychological adaptation systems critical.',
      'policy', 'Comprehensive future shock mitigation policies; anticipatory governance of AI agents; Fourth Wave institutional forms; change pace management paramount.',
      'process', 'Agentic AI enables new organizational forms beyond Toffler''s framework; humans require extensive support to adapt; prosumption replaced by human-AI collaboration.',
      'technology', 'Agentic AI clearly driving Fourth Wave; change acceleration potentially beyond biological adaptation capacity; future shock epidemic without mitigation.'
    ),
    'bci', jsonb_build_object(
      'people', 'Neural augmentation potentially solves future shock through enhanced adaptation capacity; merged intelligence may keep pace with change; prosumption at thought speed.',
      'policy', 'Post-future shock governance for enhanced humans; Fourth Wave institutions mature; new frameworks for merged intelligence; adaptation no longer limiting factor.',
      'process', 'Thought-speed processes enabled by BCI; humans potentially match AI pace through enhancement; Toffler''s acceleration problem potentially solved through merger.',
      'technology', 'Brain-computer interfaces eliminate adaptation lag; future shock resolved through cognitive enhancement; Fourth Wave fully realized with augmented humans.'
    ),
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Assess workforce future shock symptoms, establish change pace monitoring, create stability zones amid AI transformation, build adaptation support systems, implement gradual AI adoption strategies.',
      'phase_2', 'Medium-term (6-18 months): Develop anticipatory governance for AI change, build organizational capacity for acceleration, establish prosumption models with AI, create comprehensive change support infrastructure, prepare for Fourth Wave organizational forms.',
      'phase_3', 'Long-term (18+ months): Navigate Fourth Wave transformation with future shock mitigation, maintain human adaptation capacity amid AI acceleration, establish mature stability/change balance, build organizations that thrive in continuous acceleration, potentially enhance human adaptation through augmentation.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object(
        'question', 'Are our employees experiencing future shock from AI transformation?',
        'context', 'Use when observing stress, resistance, or adaptation challenges with AI adoption.',
        'application', 'Apply Toffler''s future shock framework to identify symptoms of change overload, create stability zones, and moderate pace of AI transformation to sustainable levels.'
      ),
      jsonb_build_object(
        'question', 'Is AI driving a Fourth Wave beyond the information age?',
        'context', 'Use when trying to understand the scale and nature of AI transformation.',
        'application', 'Employ Toffler''s waves framework to recognize AI as potential Fourth Wave driver, prepare for civilization-level transformation, and understand historical precedents.'
      ),
      jsonb_build_object(
        'question', 'How do we govern AI transformation anticipatorily rather than reactively?',
        'context', 'Use when designing governance frameworks for AI adoption.',
        'application', 'Use Toffler''s anticipatory democracy concepts to create forward-looking AI governance, involve stakeholders early, and prepare for foreseeable AI impacts.'
      ),
      jsonb_build_object(
        'question', 'How can we leverage prosumption models with AI?',
        'context', 'Use when redesigning work processes and value creation with AI.',
        'application', 'Apply Toffler''s prosumption framework to enable AI-augmented creation where users become producers, blur organizational boundaries, and create value through participation.'
      ),
      jsonb_build_object(
        'question', 'What stability zones do we need amid accelerating AI change?',
        'context', 'Use when designing change management and employee support systems.',
        'application', 'Employ Toffler''s concepts to identify where stability is needed amid transformation, create anchors for employees, and balance change with continuity.'
      ),
      jsonb_build_object(
        'question', 'Can our organizational learning velocity match AI''s pace of change?',
        'context', 'Use when assessing organizational adaptation capacity.',
        'application', 'Use Toffler''s acceleration frameworks to measure learning velocity, identify gaps between AI pace and human adaptation, and build acceleration capacity.'
      )
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Assess future shock symptoms in workforce, establish change pace monitoring systems, create stability zones and support systems, implement gradual AI adoption with adaptation support, begin anticipatory governance planning.',
    'mediumTerm', 'Build comprehensive future shock mitigation infrastructure, develop organizational capacity for continuous acceleration, establish prosumption models with AI-augmented creation, create anticipatory governance systems, prepare for Fourth Wave transformation.',
    'longTerm', 'Navigate Fourth Wave with mature future shock mitigation, maintain human adaptation capacity through enhancement or support, balance acceleration with sustainability, build organizations that thrive in continuous transformation, potentially solve adaptation problem through augmentation.'
  ),
  related_thinkers = ARRAY['Marshall McLuhan', 'Peter Drucker', 'Ray Kurzweil', 'John Naisbitt', 'Daniel Bell']
WHERE thinker_name = 'Alvin Toffler';