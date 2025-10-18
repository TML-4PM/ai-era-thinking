-- Insert GCBAT Vignettes for Arc 2: Cognitive & Social Disruption (Chapters 18-24)
-- Using correct status enum value: 'complete'

INSERT INTO master_4500 (book_slug, section_slug, exemplar_type, title, status, progress, description, original_insight, ai_era_shift, ai_relevance, related_thinkers, case_studies, notes)
VALUES
-- Chapter 18: Memory Fragmentation
('gcbat-vignettes', 'arc-2', 'narrative_vignette', 'The Forgotten Protocol', 'complete', 100,
'Sarah Kim, a compliance officer, discovers her BCI has corrupted crucial security clearance memories, creating gaps in her ability to verify classified protocols.',
'Neural memory systems create new vulnerabilities in identity verification and professional competence when cognitive prosthetics fail.',
'As BCIs become trusted cognitive extensions, memory corruption becomes an existential threat to professional identity and institutional trust.',
'Brain-Computer Interfaces challenge traditional concepts of memory authenticity, professional certification, and personal accountability when neural data becomes unreliable.',
ARRAY['Daniel Kahneman', 'Elizabeth Loftus'],
ARRAY['2032-clearance-verification-failure'],
'Character: Sarah Kim. Tech Challenge: Memory corruption in security clearance verification. Governance Lesson: Need for neural data integrity standards and backup verification methods.'),

-- Chapter 19: Attention Hijacking
('gcbat-vignettes', 'arc-2', 'narrative_vignette', 'The Persuasion Engine', 'complete', 100,
'Marcus Chen, a marketing strategist, creates neural advertising campaigns that bypass conscious awareness, until his own teenage daughter becomes addicted.',
'Direct neural advertising creates unprecedented manipulation capabilities that circumvent rational decision-making processes.',
'When marketing can target pre-conscious neural states, traditional consent models collapse entirely.',
'BCIs enable manipulation at the neurological level, requiring new frameworks for cognitive autonomy and informed consent in commercial contexts.',
ARRAY['B.F. Skinner', 'Shoshana Zuboff'],
ARRAY['2033-neural-advertising-addiction'],
'Character: Marcus Chen. Tech Challenge: Neural advertising bypassing conscious choice. Governance Lesson: Need for pre-conscious manipulation protections and neural advertising standards.'),

-- Chapter 20: Social Connection Dependency
('gcbat-vignettes', 'arc-2', 'narrative_vignette', 'The Empathy Circuit', 'complete', 100,
'Raj Patel, a relationship counselor, helps couples using emotional synchronization BCIs, until a network outage reveals how dependent they have become on artificial emotional connection.',
'Neural synchronization technologies create new forms of intimacy while potentially atrophying natural empathy development.',
'As BCIs mediate emotional connections, authentic human bonding skills may deteriorate, creating dependency on technological intermediaries.',
'Brain-Computer Interfaces in social contexts raise questions about authentic emotional connection, relationship autonomy, and the development of natural social skills.',
ARRAY['John Bowlby', 'Sherry Turkle'],
ARRAY['2034-emotional-sync-dependency'],
'Character: Raj Patel. Tech Challenge: Emotional dependency on neural sync technology. Governance Lesson: Need for balanced integration preserving organic social skill development.'),

-- Chapter 21: Identity Dissolution
('gcbat-vignettes', 'arc-2', 'narrative_vignette', 'The Hive Mind Experiment', 'complete', 100,
'Elena Vasquez, a neuroscience researcher, leads a study on collaborative neural networks, but participants begin losing their sense of individual identity within the collective consciousness.',
'Shared neural states challenge fundamental concepts of individual identity, legal personhood, and personal responsibility.',
'When multiple minds can merge through BCIs, traditional legal and ethical frameworks based on individual agency become inadequate.',
'Brain-Computer Interfaces enabling cognitive merging require new philosophical and legal frameworks for distributed consciousness and collective accountability.',
ARRAY['Thomas Metzinger', 'Andy Clark'],
ARRAY['2035-collective-consciousness-research'],
'Character: Elena Vasquez. Tech Challenge: Loss of individual identity in neural networks. Governance Lesson: Need for identity preservation protocols and consent frameworks for cognitive merging.'),

-- Chapter 22: Dream Invasion
('gcbat-vignettes', 'arc-2', 'narrative_vignette', 'The Nightmare Market', 'complete', 100,
'Aisha Okonkwo, a sleep researcher, discovers a black market for recorded dreams being used for entertainment, blackmail, and corporate espionage.',
'Dreams represent the last frontier of absolute privacy, yet BCIs make even unconscious thoughts accessible and exploitable.',
'When sleep states become transparent, the concept of a protected inner mental life disappears entirely.',
'Brain-Computer Interfaces that access unconscious states require the strongest possible privacy protections and new legal categories for mental privacy.',
ARRAY['Sigmund Freud', 'Matthew Walker'],
ARRAY['2036-dream-data-black-market'],
'Character: Aisha Okonkwo. Tech Challenge: Unauthorized dream recording and exploitation. Governance Lesson: Need for absolute unconscious-state privacy protections and dream data rights.'),

-- Chapter 23: Cognitive Inequality
('gcbat-vignettes', 'arc-2', 'narrative_vignette', 'The Enhancement Gap', 'complete', 100,
'James Anderson, an education policy advisor, witnesses the creation of a cognitive aristocracy as wealthy students gain access to advanced neural enhancements while public schools cannot afford basic BCIs.',
'Neural enhancement technology creates unprecedented cognitive inequality that could stratify society into enhanced and unenhanced classes.',
'When intelligence itself becomes purchasable through BCIs, meritocracy collapses and social mobility becomes biologically determined.',
'Brain-Computer Interfaces as cognitive enhancers require policies ensuring equitable access to prevent the creation of a genetically and technologically stratified society.',
ARRAY['John Rawls', 'Martha Nussbaum'],
ARRAY['2037-education-enhancement-gap'],
'Character: James Anderson. Tech Challenge: Unequal access creating cognitive class divide. Governance Lesson: Need for universal access policies and enhancement equity standards.'),

-- Chapter 24: Language Barriers Collapse
('gcbat-vignettes', 'arc-2', 'narrative_vignette', 'The Tower of Babel 2.0', 'complete', 100,
'Dmitri Volkov experiences real-time neural translation that eliminates language barriers but raises questions about linguistic identity and cultural preservation.',
'Neural translation enables universal communication but threatens linguistic diversity and cultural distinctiveness.',
'When all languages become instantly translatable, questions arise about cultural preservation and the value of multilingualism.',
'Brain-Computer Interfaces enabling translation must balance communication benefits with cultural and linguistic preservation.',
ARRAY['Noam Chomsky', 'Steven Pinker'],
ARRAY['2038-neural-translation-cultural-impact'],
'Character: Dmitri Volkov. Tech Challenge: Loss of linguistic diversity through universal translation. Governance Lesson: Need for cultural preservation alongside communication enhancement.');