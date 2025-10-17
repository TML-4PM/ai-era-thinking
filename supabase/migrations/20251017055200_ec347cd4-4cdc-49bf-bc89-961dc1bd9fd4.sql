-- Tier 2 Thinkers: Comprehensive Profile Seeding (Part 2/3 - Organizational Behavior)

-- Chris Argyris
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Chris Argyris pioneered understanding of organizational learning, defensive routines, and the distinction between espoused theory and theory-in-use. His frameworks for double-loop learning and overcoming organizational defensiveness provide essential tools for navigating AI transformation that requires fundamental assumption change.',
    'key_concepts', jsonb_build_array(
      'Single-loop vs. double-loop learning',
      'Espoused theory vs. theory-in-use',
      'Organizational defensive routines',
      'Model I and Model II behavior',
      'Actionable knowledge',
      'Organizational learning systems',
      'Skilled incompetence',
      'Undiscussable issues and their undiscussability',
      'Ladder of inference',
      'Productive reasoning'
    ),
    'why_it_matters', 'AI transformation requires double-loop learning—questioning fundamental assumptions about work, intelligence, and human roles. Argyris'' frameworks help organizations overcome defensive routines that block the deep learning necessary for AI adoption.',
    'ai_implications', jsonb_build_array(
      'AI transformation requires double-loop learning at scale',
      'Defensive routines block necessary assumption change',
      'Gap between espoused AI strategy and actual practice widens',
      'Organizations must surface undiscussable fears about AI',
      'Model II behavior critical for productive human-AI collaboration'
    ),
    'recommended_practices', jsonb_build_array(
      'Implement double-loop learning for AI transformation',
      'Surface and address defensive routines around AI adoption',
      'Align espoused AI strategy with actual organizational practice',
      'Create psychologically safe environments for AI experimentation',
      'Develop Model II behaviors for human-AI teams',
      'Make undiscussable AI concerns discussable',
      'Build actionable knowledge about AI through reflection',
      'Challenge assumptions underlying resistance to AI'
    ),
    'common_pitfalls', jsonb_build_array(
      'Single-loop optimization when double-loop learning required',
      'Ignoring gap between stated AI values and actual behavior',
      'Allowing defensive routines to block AI adoption',
      'Leaving AI fears and concerns undiscussable',
      'Assuming Model I behavior will work with AI',
      'Treating AI resistance as irrational rather than defensive',
      'Failing to question fundamental assumptions about work'
    ),
    'success_metrics', jsonb_build_array(
      'Frequency of double-loop learning conversations',
      'Reduction in defensive routines around AI',
      'Alignment between espoused and actual AI practices',
      'Psychological safety indicators in AI projects',
      'Prevalence of Model II behaviors',
      'Previously undiscussable issues now discussable',
      'Quality of reflection on AI implementation',
      'Assumption-challenging conversations frequency'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Argyris'' frameworks become increasingly critical as each AI era requires deeper assumption change, stronger defensive routines emerge around job security and human purpose, and the gap between espoused AI strategy and actual practice widens.',
    'cross_era_relevance', 'His distinction between single and double-loop learning provides the foundational framework for understanding why AI transformation fails—most organizations attempt single-loop optimization when fundamental assumption change is required.',
    'on_prem', jsonb_build_object(
      'people', 'Workers comfortable with existing mental models; defensive routines protect established practices; single-loop learning dominates; espoused commitment to innovation contradicts actual resistance.',
      'policy', 'Policies espouse innovation but maintain status quo; defensive routines institutionalized; undiscussable issues protected; Model I behavior normalized.',
      'process', 'Processes optimized through single-loop learning; no questioning of fundamental assumptions; defensive routines embedded in workflows; theory-in-use disconnected from espoused theory.',
      'technology', 'Technology adoption through single-loop integration; no fundamental rethinking; defensive routines prevent deep change; AI treated as automation not transformation.'
    ),
    'cloud', jsonb_build_object(
      'people', 'Some workers developing double-loop capacity; defensive routines around cloud transformation emerge; gap between digital-first rhetoric and actual practice visible.',
      'policy', 'Policies begin requiring assumption examination; some defensive routines challenged; psychological safety for experimentation increases; more Model II behavior.',
      'process', 'Processes designed for continuous learning; some double-loop capacity; defensive routines about traditional ways of working surface and get addressed.',
      'technology', 'Cloud computing requires some double-loop learning; assumptions about control and ownership challenged; defensive routines about data and security must be overcome.'
    ),
    'gen_ai', jsonb_build_object(
      'people', 'Workers face fundamental assumption challenges about intelligence and contribution; strong defensive routines emerge; gap between AI enthusiasm and actual adoption widens; Model II critical.',
      'policy', 'Policies must enable double-loop learning about work''s nature; defensive routines about job security must become discussable; psychological safety paramount.',
      'process', 'Processes require constant double-loop learning as AI transforms fundamentals; defensive routines around human relevance must be surfaced and addressed.',
      'technology', 'Generative AI forces double-loop learning about intelligence, creativity, knowledge work; defensive routines intense; espoused AI strategy often disconnected from practice.'
    ),
    'agentic_ai', jsonb_build_object(
      'people', 'Humans must engage in continuous double-loop learning about purpose and agency; defensive routines around human uniqueness surface; Model II behavior essential for human-AI teams.',
      'policy', 'Policies enabling triple-loop learning about human purpose; all assumptions about work constantly questioned; defensive routines must be actively dismantled.',
      'process', 'All processes in continuous double-loop evolution; defensive routines around human agency must be surfaced; espoused human-AI partnership must match reality.',
      'technology', 'Agentic AI requires deepest double-loop learning yet; assumptions about agency and decision-making fundamentally questioned; defensive routines most intense.'
    ),
    'bci', jsonb_build_object(
      'people', 'Neural augmentation enables faster double-loop learning; defensive routines about human biological limits directly addressed; Model II thinking potentially enhanced.',
      'policy', 'Policies for governing enhanced cognition require new frameworks beyond Argyris; defensive routines about human nature itself must be examined.',
      'process', 'Thought-speed double-loop learning possible; defensive routines about biological limitations overcome; espoused and actual practice potentially aligned through augmentation.',
      'technology', 'Brain-computer interfaces enable direct examination of mental models; defensive routines potentially visible in neural patterns; double-loop learning enhanced.'
    ),
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Identify defensive routines blocking AI adoption, create psychological safety for AI experimentation, surface undiscussable AI fears, begin double-loop learning conversations, align espoused AI strategy with actual practice.',
      'phase_2', 'Medium-term (6-18 months): Build organizational capacity for double-loop learning, systematically dismantle defensive routines, develop Model II behaviors for human-AI collaboration, make all AI assumptions discussable, create reflection systems.',
      'phase_3', 'Long-term (18+ months): Establish continuous double-loop learning culture, eliminate major defensive routines, align espoused and actual AI practices, build assumption-challenging capability, enable productive reasoning about AI transformation.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object(
        'question', 'What defensive routines are blocking our AI adoption?',
        'context', 'Use when AI initiatives face unexplained resistance or passive non-compliance.',
        'application', 'Apply Argyris'' defensive routine framework to identify self-protective behaviors, surface hidden resistance, and create safe spaces for examining real concerns.'
      ),
      jsonb_build_object(
        'question', 'Are we engaging in single-loop or double-loop learning with AI?',
        'context', 'Use when AI projects optimize existing practices without questioning fundamentals.',
        'application', 'Employ Argyris'' learning frameworks to distinguish between incremental optimization and fundamental assumption change, shifting to double-loop when needed.'
      ),
      jsonb_build_object(
        'question', 'What is the gap between our espoused AI strategy and our actual practice?',
        'context', 'Use when stated AI commitment doesn''t match actual behavior and investment.',
        'application', 'Use Argyris'' espoused/theory-in-use distinction to surface disconnects, align rhetoric with reality, and build authentic AI transformation.'
      ),
      jsonb_build_object(
        'question', 'What AI concerns are undiscussable in our organization?',
        'context', 'Use when important AI topics are avoided in meetings and planning sessions.',
        'application', 'Apply Argyris'' frameworks to surface undiscussable issues (job loss fears, skill obsolescence), create psychological safety, enable productive conversations.'
      ),
      jsonb_build_object(
        'question', 'Are we using Model I or Model II behavior with AI?',
        'context', 'Use when human-AI collaboration is contentious or defensive.',
        'application', 'Employ Argyris'' Models to shift from defensive, win-lose AI interactions toward collaborative, learning-oriented human-AI partnerships.'
      ),
      jsonb_build_object(
        'question', 'What assumptions about work need to be questioned for AI success?',
        'context', 'Use when AI initiatives produce disappointing results despite technical success.',
        'application', 'Use Argyris'' frameworks to identify and challenge fundamental assumptions about intelligence, contribution, and human purpose that block AI value.'
      )
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Identify defensive routines blocking AI adoption, create psychological safety for AI discussions, surface gap between espoused AI strategy and actual practice, begin making undiscussable AI concerns discussable, start double-loop learning conversations.',
    'mediumTerm', 'Build organizational capacity for continuous double-loop learning, systematically address defensive routines, develop Model II behaviors for human-AI teams, align espoused and actual AI practices, create reflection systems for assumption examination.',
    'longTerm', 'Establish culture of continuous assumption questioning, eliminate defensive routines around AI, maintain full alignment between stated and actual AI practices, build organizational wisdom about human-AI collaboration, enable productive reasoning at scale.'
  ),
  related_thinkers = ARRAY['Donald Schön', 'Edgar Schein', 'Peter Senge', 'Karl Weick', 'James March']
WHERE thinker_name = 'Chris Argyris';

-- Edgar Schein  
UPDATE thinker_profiles
SET
  metadata = jsonb_build_object(
    'summary', 'Edgar Schein''s frameworks for understanding organizational culture, psychological safety, and the three levels of culture provide essential tools for navigating AI transformation. His work on humble inquiry, helping relationships, and culture change enables organizations to shift deeply held assumptions necessary for AI success.',
    'key_concepts', jsonb_build_array(
      'Three levels of culture (artifacts, values, assumptions)',
      'Psychological safety and learning anxiety',
      'Humble inquiry and helping relationships',
      'Process consultation',
      'Culture change and transformation',
      'Organizational learning culture',
      'Survival anxiety vs. learning anxiety',
      'The role of leadership in culture formation',
      'Career anchors and identity',
      'Coercive persuasion and influence'
    ),
    'why_it_matters', 'AI transformation requires changing deep cultural assumptions about intelligence, contribution, and human value. Schein''s frameworks provide the roadmap for cultural change at the level necessary for genuine AI integration.',
    'ai_implications', jsonb_build_array(
      'AI transformation requires culture change at assumption level',
      'Psychological safety critical for AI experimentation and learning',
      'Humble inquiry becomes essential skill for human-AI collaboration',
      'Career anchors and identities disrupted by AI require renegotiation',
      'Survival anxiety around AI must overcome learning anxiety'
    ),
    'recommended_practices', jsonb_build_array(
      'Assess and address all three culture levels for AI readiness',
      'Build psychological safety for AI experimentation and failure',
      'Practice humble inquiry when working with AI systems',
      'Use process consultation for AI transformation',
      'Surface and examine cultural assumptions about intelligence',
      'Balance survival anxiety and learning anxiety around AI',
      'Develop helping relationships for AI skill development',
      'Lead culture change through AI transformation'
    ),
    'common_pitfalls', jsonb_build_array(
      'Working only at artifacts level (policies, tools) not assumptions',
      'Insufficient psychological safety for AI learning',
      'Tell-and-sell approach rather than humble inquiry',
      'Ignoring deep cultural assumptions about human superiority',
      'Letting learning anxiety block AI adoption',
      'Failing to help people renegotiate career identities',
      'Top-down culture change without examining assumptions'
    ),
    'success_metrics', jsonb_build_array(
      'Cultural alignment across all three levels (artifacts, values, assumptions)',
      'Psychological safety indicators in AI projects',
      'Humble inquiry practice frequency and quality',
      'Cultural assumptions about AI openly examined',
      'Learning anxiety manageable despite survival anxiety',
      'Career renegotiation support effectiveness',
      'Leadership culture-shaping behaviors',
      'Process consultation utilization'
    ),
    'seeded_at', NOW(),
    'source', 'curated',
    'method', 'tier2-seed',
    'quality_score', 5.0
  ),
  cross_era_relevance = jsonb_build_object(
    'ai_relevance', 'Schein''s frameworks become increasingly essential as AI requires deeper cultural transformation, stronger psychological safety for learning, and more fundamental assumption change at each era transition.',
    'cross_era_relevance', 'His three-level culture model provides the diagnostic tool for understanding why surface AI initiatives fail—they address artifacts and espoused values while leaving deep assumptions unchanged.',
    'on_prem', jsonb_build_object(
      'people', 'Workers operate on assumptions of human superiority in intelligence; career anchors tied to specialized expertise; learning anxiety low with familiar technology.',
      'policy', 'Policies reflect artifacts and values of industrial-age culture; basic assumptions about human centrality unquestioned; psychological safety variable.',
      'process', 'Processes embody assumptions about human judgment supremacy; hierarchical helping relationships; tell-and-sell culture change approaches common.',
      'technology', 'Technology reinforces existing cultural assumptions; AI narrow enough not to threaten basic beliefs; humble inquiry toward machines not considered.'
    ),
    'cloud', jsonb_build_object(
      'people', 'Workers beginning to question expertise as sole anchor; some psychological safety for digital experimentation; learning anxiety about cloud transformation manageable.',
      'policy', 'Policies evolving to reflect some new assumptions about distributed intelligence; psychological safety explicitly valued; humble inquiry emerging.',
      'process', 'Processes beginning to reflect learning culture assumptions; helping relationships more common; process consultation for change increasing; culture change more participative.',
      'technology', 'Cloud computing challenges some assumptions about control and ownership; cultural artifacts evolving; values shifting toward collaboration; basic human supremacy unchallenged.'
    ),
    'gen_ai', jsonb_build_object(
      'people', 'Workers facing fundamental assumption challenges about intelligence; career anchors disrupted; psychological safety critical; learning anxiety intense; survival anxiety high.',
      'policy', 'Policies must reflect new assumptions about intelligence and contribution; psychological safety for AI failure essential; humble inquiry toward AI systems necessary.',
      'process', 'Processes require culture change at assumption level; helping relationships critical for identity renegotiation; process consultation vital for AI transformation.',
      'technology', 'Generative AI directly challenges basic assumptions about human uniqueness; all three culture levels must align; deep assumption examination required.'
    ),
    'agentic_ai', jsonb_build_object(
      'people', 'Humans renegotiating core identity assumptions; career anchors fundamentally disrupted; psychological safety paramount; learning anxiety must be managed despite existential survival anxiety.',
      'policy', 'Policies reflecting post-human-supremacy assumptions; psychological safety for existential questions; humble inquiry toward agentic systems; culture change at civilization level.',
      'process', 'All processes require continuous assumption examination; helping relationships for existential renegotiation; process consultation for species-level transition.',
      'technology', 'Agentic AI forces deepest cultural assumption change; human superiority belief dismantled; all three culture levels in transformation; artifacts, values, assumptions must align.'
    ),
    'bci', jsonb_build_object(
      'people', 'Enhanced humans with new assumptions about biological limits; career anchors transcending organic constraints; psychological safety for cognitive enhancement.',
      'policy', 'Policies for culture of merged human-AI intelligence; assumptions about human nature itself transformed; humble inquiry toward own augmented cognition.',
      'process', 'Culture change enabled through neural enhancement; helping relationships for transition to augmented state; assumption examination potentially enhanced.',
      'technology', 'Brain-computer interfaces enable new cultural assumptions about consciousness; three-level model must expand for hybrid intelligence; culture itself may be augmentable.'
    ),
    'implementation_timeline', jsonb_build_object(
      'phase_1', 'Immediate (0-6 months): Assess organizational culture at all three levels for AI readiness, build psychological safety for AI experimentation, begin practicing humble inquiry with AI, surface survival vs. learning anxiety dynamics.',
      'phase_2', 'Medium-term (6-18 months): Lead culture change at assumption level, develop helping relationships for AI transition, use process consultation for transformation, help people renegotiate career anchors, align artifacts/values/assumptions.',
      'phase_3', 'Long-term (18+ months): Achieve cultural alignment supporting AI at all three levels, maintain high psychological safety, embed humble inquiry as organizational norm, successfully navigate identity transitions, build learning culture for continuous AI evolution.'
    )
  ),
  usage_prompts = jsonb_build_object(
    'prompts', jsonb_build_array(
      jsonb_build_object(
        'question', 'What are our deep cultural assumptions about intelligence and contribution?',
        'context', 'Use when AI initiatives face subtle, hard-to-articulate resistance.',
        'application', 'Apply Schein''s three-level model to surface tacit assumptions about human superiority, identify artifacts and values that conflict with AI transformation.'
      ),
      jsonb_build_object(
        'question', 'Do we have sufficient psychological safety for AI experimentation?',
        'context', 'Use when people avoid AI tools or hide AI failures.',
        'application', 'Employ Schein''s psychological safety framework to create environments where AI experimentation, failure, and learning are safe and encouraged.'
      ),
      jsonb_build_object(
        'question', 'Are we practicing humble inquiry with our AI systems?',
        'context', 'Use when human-AI collaboration feels adversarial or humans dismiss AI suggestions.',
        'application', 'Use Schein''s humble inquiry approach to develop curious, learning-oriented relationships with AI rather than dominant or submissive stances.'
      ),
      jsonb_build_object(
        'question', 'How do we help people renegotiate their career anchors with AI?',
        'context', 'Use when employees struggle with identity and purpose amid AI transformation.',
        'application', 'Apply Schein''s career anchor and helping relationship frameworks to support identity renegotiation, find new sources of meaning and contribution.'
      ),
      jsonb_build_object(
        'question', 'Is learning anxiety or survival anxiety blocking our AI adoption?',
        'context', 'Use when people resist AI despite understanding its necessity.',
        'application', 'Employ Schein''s anxiety balance framework to increase survival anxiety (consequences of not adopting) while decreasing learning anxiety (making AI learning safe).'
      ),
      jsonb_build_object(
        'question', 'Are we changing culture at all three levels for AI?',
        'context', 'Use when surface AI initiatives (new tools, stated values) don''t produce deep change.',
        'application', 'Use Schein''s three-level model to ensure AI transformation addresses artifacts, espoused values, AND deep assumptions about intelligence and human contribution.'
      )
    )
  ),
  practical_applications = jsonb_build_object(
    'immediate', 'Assess culture at all three levels for AI readiness, build psychological safety for AI experimentation and failure, begin humble inquiry practices, surface and examine assumptions about intelligence, identify survival vs. learning anxiety dynamics.',
    'mediumTerm', 'Lead systematic culture change at assumption level, develop helping relationships for AI transition, use process consultation for transformation, support career anchor renegotiation, align artifacts/values/assumptions for AI.',
    'longTerm', 'Achieve full cultural alignment supporting AI transformation, maintain robust psychological safety, embed humble inquiry as norm, successfully navigate identity transitions, build learning culture that continuously evolves with AI.'
  ),
  related_thinkers = ARRAY['Chris Argyris', 'Peter Senge', 'Amy Edmondson', 'William Bridges', 'Karl Weick']
WHERE thinker_name = 'Edgar Schein';

-- Continue with remaining Tier 2 thinkers in next migration...