-- Phase 1 Final: Complete remaining clusters with ALL 70+ thinkers

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
-- Innovation Strategists
('thinking-engine', 'thinkers', 'Clayton Christensen', 'thinker', 'complete', 100, 'Harvard professor who introduced disruptive innovation theory',
 'Disruptive innovation theory', 'Digital disruption analysis', 'AI-driven innovation', 'Autonomous innovation systems', 'Innovation sensing interfaces',
 ARRAY['Business model innovation', 'Technology adoption'], 
 ARRAY['Geoffrey Moore', 'Peter Drucker'], 
 ARRAY['Disruptive Innovation', 'Jobs To Be Done']),

('thinking-engine', 'thinkers', 'Geoffrey Moore', 'thinker', 'complete', 100, 'Marketing consultant who identified the technology adoption lifecycle chasm',
 'Crossing the chasm strategy', 'Digital adoption curves', 'AI adoption patterns', 'Autonomous market sensing', 'Market signal interfaces',
 ARRAY['Technology marketing', 'Market adoption'], 
 ARRAY['Clayton Christensen', 'Everett Rogers'], 
 ARRAY['Crossing the Chasm', 'Technology Adoption']),

('thinking-engine', 'thinkers', 'Gary Klein', 'thinker', 'complete', 100, 'Psychologist who pioneered naturalistic decision-making and recognition-primed decisions',
 'Naturalistic decision research', 'Expert decision systems', 'AI expertise modeling', 'Autonomous expert agents', 'Intuition sensing interfaces',
 ARRAY['Expert performance', 'Decision making'], 
 ARRAY['Daniel Kahneman', 'Herbert Simon'], 
 ARRAY['Recognition-Primed Decisions', 'Naturalistic Decision Making']),

-- Economics & Strategy
('thinking-engine', 'thinkers', 'Michael Porter', 'thinker', 'seeded', 85, 'Economist who developed competitive strategy framework and value chain analysis',
 'Competitive strategy theory', 'Digital value chains', 'AI competitive analysis', 'Autonomous strategy systems', 'Strategic sensing interfaces',
 ARRAY['Industry analysis', 'Competitive positioning'], 
 ARRAY['Peter Drucker', 'Clayton Christensen'], 
 ARRAY['Five Forces', 'Value Chain']),

('thinking-engine', 'thinkers', 'John Maynard Keynes', 'thinker', 'complete', 100, 'Economist who revolutionized macroeconomic theory and government policy',
 'Keynesian economic policy', 'Digital economic modeling', 'AI economic forecasting', 'Autonomous economic systems', 'Economic sensing interfaces',
 ARRAY['Government fiscal policy', 'Economic stabilization'], 
 ARRAY['Friedrich Hayek', 'Joseph Schumpeter'], 
 ARRAY['Keynesian Economics', 'Aggregate Demand']),

('thinking-engine', 'thinkers', 'Elinor Ostrom', 'thinker', 'seeded', 85, 'Nobel laureate who studied commons governance and collective action',
 'Commons governance research', 'Digital commons management', 'AI commons coordination', 'Autonomous resource management', 'Commons sensing interfaces',
 ARRAY['Resource management', 'Collective governance'], 
 ARRAY['Garrett Hardin', 'Vincent Ostrom'], 
 ARRAY['Governing the Commons', 'Collective Action']),

('thinking-engine', 'thinkers', 'Friedrich Hayek', 'thinker', 'seeded', 80, 'Economist who emphasized spontaneous order and knowledge dispersal in markets',
 'Spontaneous order theory', 'Market information systems', 'AI market dynamics', 'Autonomous market coordination', 'Market sensing interfaces',
 ARRAY['Market economics', 'Information theory'], 
 ARRAY['John Maynard Keynes', 'Ludwig von Mises'], 
 ARRAY['Spontaneous Order', 'Economic Freedom']),

-- Organizational Behavior & Culture
('thinking-engine', 'thinkers', 'Chris Argyris', 'thinker', 'complete', 100, 'Organizational psychologist who developed organizational learning and double-loop learning concepts',
 'Organizational learning research', 'Learning platforms', 'AI-enhanced learning', 'Self-learning organizations', 'Learning sensing interfaces',
 ARRAY['Corporate transformation', 'Leadership development'], 
 ARRAY['Edgar Schein', 'Peter Senge'], 
 ARRAY['Double-Loop Learning', 'Organizational Learning']),

('thinking-engine', 'thinkers', 'Edgar Schein', 'thinker', 'complete', 100, 'Psychologist who defined organizational culture and psychological safety',
 'Organizational culture models', 'Digital culture analysis', 'AI culture assessment', 'Autonomous culture sensing', 'Culture sensing interfaces',
 ARRAY['Culture change', 'Leadership coaching'], 
 ARRAY['Chris Argyris', 'Kurt Lewin'], 
 ARRAY['Organizational Culture', 'Psychological Safety']),

('thinking-engine', 'thinkers', 'Simon Sinek', 'thinker', 'complete', 100, 'Leadership expert who popularized Start With Why and Golden Circle framework',
 'Why-driven leadership', 'Purpose-driven platforms', 'AI purpose alignment', 'Autonomous purpose discovery', 'Purpose sensing interfaces',
 ARRAY['Purpose-driven organizations', 'Leadership inspiration'], 
 ARRAY['Peter Drucker', 'Jim Collins'], 
 ARRAY['Golden Circle', 'Start With Why']),

('thinking-engine', 'thinkers', 'Erving Goffman', 'thinker', 'seeded', 75, 'Sociologist who analyzed social interactions and impression management',
 'Dramaturgical analysis', 'Digital identity management', 'AI social intelligence', 'Autonomous social agents', 'Social sensing interfaces',
 ARRAY['Social behavior', 'Identity management'], 
 ARRAY['Herbert Simon', 'Mary Parker Follett'], 
 ARRAY['Dramaturgical Analysis', 'Frame Analysis']),

('thinking-engine', 'thinkers', 'Malcolm Gladwell', 'thinker', 'seeded', 75, 'Writer who explored tipping points and outliers in social phenomena',
 'Tipping point analysis', 'Viral digital phenomena', 'AI trend detection', 'Autonomous trend sensing', 'Social pattern interfaces',
 ARRAY['Social epidemics', 'Trend analysis'], 
 ARRAY['Seth Godin', 'Chip Heath'], 
 ARRAY['Tipping Point', 'Outliers']),

-- Ethics & Philosophy
('thinking-engine', 'thinkers', 'John Rawls', 'thinker', 'complete', 100, 'Philosopher who developed theory of justice as fairness',
 'Justice theory research', 'Digital fairness frameworks', 'AI ethics and fairness', 'Autonomous ethical systems', 'Fairness sensing interfaces',
 ARRAY['Social justice', 'Ethical frameworks'], 
 ARRAY['Amartya Sen', 'Martha Nussbaum'], 
 ARRAY['Theory of Justice', 'Veil of Ignorance']),

('thinking-engine', 'thinkers', 'Amartya Sen', 'thinker', 'complete', 100, 'Nobel laureate who introduced capability approach to welfare economics',
 'Capability approach theory', 'Digital capability measurement', 'AI capability enhancement', 'Autonomous capability development', 'Capability sensing interfaces',
 ARRAY['Development economics', 'Social choice'], 
 ARRAY['John Rawls', 'Martha Nussbaum'], 
 ARRAY['Capability Approach', 'Development as Freedom']),

('thinking-engine', 'thinkers', 'Isaiah Berlin', 'thinker', 'complete', 100, 'Philosopher who distinguished positive and negative liberty',
 'Liberty theory analysis', 'Digital rights frameworks', 'AI and human freedom', 'Autonomous liberty preservation', 'Freedom sensing interfaces',
 ARRAY['Political philosophy', 'Human rights'], 
 ARRAY['John Rawls', 'Hannah Arendt'], 
 ARRAY['Two Concepts of Liberty', 'Value Pluralism']),

('thinking-engine', 'thinkers', 'Martha Nussbaum', 'thinker', 'seeded', 80, 'Philosopher who expanded capability approach and human dignity theory',
 'Capability theory development', 'Digital human development', 'AI human flourishing', 'Autonomous dignity preservation', 'Dignity sensing interfaces',
 ARRAY['Human development', 'Social justice'], 
 ARRAY['Amartya Sen', 'John Rawls'], 
 ARRAY['Capabilities Approach', 'Human Dignity']),

('thinking-engine', 'thinkers', 'Hannah Arendt', 'thinker', 'seeded', 80, 'Political theorist who analyzed totalitarianism and human condition',
 'Political theory analysis', 'Digital public sphere', 'AI and political action', 'Autonomous civic systems', 'Political sensing interfaces',
 ARRAY['Political philosophy', 'Democracy studies'], 
 ARRAY['Isaiah Berlin', 'Martha Nussbaum'], 
 ARRAY['Human Condition', 'Origins of Totalitarianism']),

-- Futures & Foresight
('thinking-engine', 'thinkers', 'Nick Bostrom', 'thinker', 'seeded', 85, 'Philosopher studying existential risk and superintelligence',
 'Existential risk research', 'AI safety frameworks', 'Superintelligence scenarios', 'AGI alignment', 'Existential risk sensing',
 ARRAY['AI safety', 'Existential risk'], 
 ARRAY['Ray Kurzweil', 'Eliezer Yudkowsky'], 
 ARRAY['Superintelligence', 'Existential Risk']),

('thinking-engine', 'thinkers', 'Ray Kurzweil', 'thinker', 'seeded', 85, 'Futurist who predicted technological singularity and exponential growth',
 'Singularity prediction', 'Exponential technology tracking', 'AGI development paths', 'Post-human futures', 'Singularity sensing',
 ARRAY['Technology forecasting', 'AI development'], 
 ARRAY['Nick Bostrom', 'Vernor Vinge'], 
 ARRAY['Singularity', 'Law of Accelerating Returns']),

('thinking-engine', 'thinkers', 'Kevin Kelly', 'thinker', 'seeded', 85, 'Technology forecaster exploring inevitable technological trends',
 'Technology trend analysis', 'Digital inevitabilities', 'AI evolution patterns', 'Autonomous tech development', 'Tech trend sensing',
 ARRAY['Tech forecasting', 'Digital culture'], 
 ARRAY['Ray Kurzweil', 'Tim O''Reilly'], 
 ARRAY['Inevitable', 'What Technology Wants']),

('thinking-engine', 'thinkers', 'Alvin Toffler', 'thinker', 'seeded', 80, 'Futurist who predicted information age and future shock',
 'Future shock analysis', 'Information age transitions', 'AI societal impacts', 'Autonomous social adaptation', 'Future sensing interfaces',
 ARRAY['Societal change', 'Technology futures'], 
 ARRAY['Daniel Bell', 'John Naisbitt'], 
 ARRAY['Future Shock', 'Third Wave']),

-- Change & Transformation
('thinking-engine', 'thinkers', 'Kotter', 'thinker', 'seeded', 80, 'Change management expert who developed 8-step change process',
 'Change management processes', 'Digital transformation frameworks', 'AI change facilitation', 'Autonomous change management', 'Change sensing interfaces',
 ARRAY['Organizational transformation', 'Change leadership'], 
 ARRAY['John Kotter', 'Kurt Lewin'], 
 ARRAY['8-Step Process', 'Leading Change']),

('thinking-engine', 'thinkers', 'Everett Rogers', 'thinker', 'seeded', 80, 'Communication scholar who theorized innovation diffusion',
 'Diffusion theory research', 'Digital adoption patterns', 'AI innovation spread', 'Autonomous diffusion tracking', 'Adoption sensing interfaces',
 ARRAY['Technology adoption', 'Innovation diffusion'], 
 ARRAY['Geoffrey Moore', 'Clayton Christensen'], 
 ARRAY['Diffusion of Innovations', 'Adoption Curve']),

-- Media & Society
('thinking-engine', 'thinkers', 'Marshall McLuhan', 'thinker', 'seeded', 75, 'Media theorist who coined "medium is the message"',
 'Media ecology theory', 'Digital media effects', 'AI media transformation', 'Autonomous media systems', 'Media sensing interfaces',
 ARRAY['Media studies', 'Communication theory'], 
 ARRAY['Neil Postman', 'Douglas Rushkoff'], 
 ARRAY['Medium is Message', 'Global Village']),

('thinking-engine', 'thinkers', 'Shoshana Zuboff', 'thinker', 'seeded', 75, 'Scholar analyzing surveillance capitalism and digital power',
 'Surveillance capitalism analysis', 'Data privacy frameworks', 'AI power dynamics', 'Autonomous surveillance systems', 'Privacy sensing interfaces',
 ARRAY['Digital capitalism', 'Data rights'], 
 ARRAY['Jaron Lanier', 'Cathy O''Neil'], 
 ARRAY['Surveillance Capitalism', 'Digital Power']),

('thinking-engine', 'thinkers', 'Yuval Noah Harari', 'thinker', 'seeded', 75, 'Historian exploring human future and AI implications',
 'Human history analysis', 'Digital humanity evolution', 'AI consciousness questions', 'Post-human scenarios', 'Existential sensing',
 ARRAY['Human futures', 'AI ethics'], 
 ARRAY['Nick Bostrom', 'Ray Kurzweil'], 
 ARRAY['Sapiens', 'Homo Deus']),

('thinking-engine', 'thinkers', 'Jane Jacobs', 'thinker', 'seeded', 70, 'Urban theorist who championed organic city development',
 'Urban planning theory', 'Smart city frameworks', 'AI urban optimization', 'Autonomous urban systems', 'City sensing interfaces',
 ARRAY['Urban development', 'Community design'], 
 ARRAY['Christopher Alexander', 'Kevin Lynch'], 
 ARRAY['Death and Life of Great Cities', 'Urban Planning']),

-- Tech Philosophy
('thinking-engine', 'thinkers', 'Tim O''Reilly', 'thinker', 'seeded', 75, 'Tech publisher who coined Web 2.0 and advocates for algorithmic accountability',
 'Web 2.0 concept', 'Platform economics', 'AI governance frameworks', 'Autonomous platform regulation', 'Tech policy sensing',
 ARRAY['Platform development', 'Tech policy'], 
 ARRAY['Kevin Kelly', 'Clay Shirky'], 
 ARRAY['Web 2.0', 'WTF Economy']),

('thinking-engine', 'thinkers', 'Vernor Vinge', 'thinker', 'seeded', 75, 'Computer scientist who popularized technological singularity concept',
 'Singularity theory', 'Exponential AI growth', 'Superintelligence scenarios', 'Post-singularity futures', 'Singularity tracking',
 ARRAY['AI forecasting', 'Sci-fi futures'], 
 ARRAY['Ray Kurzweil', 'Nick Bostrom'], 
 ARRAY['Technological Singularity', 'Intelligence Explosion']),

('thinking-engine', 'thinkers', 'William Gibson', 'thinker', 'seeded', 70, 'Sci-fi author who coined "cyberspace" and predicted digital culture',
 'Cyberspace vision', 'Digital culture emergence', 'AI societal integration', 'Cyberpunk futures', 'Digital culture sensing',
 ARRAY['Digital culture', 'Tech forecasting'], 
 ARRAY['Neal Stephenson', 'Bruce Sterling'], 
 ARRAY['Cyberspace', 'Neuromancer']),

('thinking-engine', 'thinkers', 'Neal Stephenson', 'thinker', 'seeded', 70, 'Sci-fi author who predicted metaverse and cryptocurrency',
 'Metaverse concept', 'Virtual worlds', 'AI virtual integration', 'Metaverse futures', 'Virtual reality sensing',
 ARRAY['Virtual worlds', 'Digital economies'], 
 ARRAY['William Gibson', 'Jaron Lanier'], 
 ARRAY['Snow Crash', 'Cryptonomicon']),

('thinking-engine', 'thinkers', 'Margaret Atwood', 'thinker', 'seeded', 70, 'Author exploring dystopian technology futures',
 'Dystopian analysis', 'Tech ethics warnings', 'AI societal risks', 'Dystopian prevention', 'Risk sensing interfaces',
 ARRAY['Speculative fiction', 'Tech ethics'], 
 ARRAY['Ursula K. Le Guin', 'Octavia Butler'], 
 ARRAY['Handmaid''s Tale', 'MaddAddam']),

-- Additional Cluster
('thinking-engine', 'thinkers', 'Geoffrey West', 'thinker', 'complete', 100, 'Physicist who applied scaling laws to cities and organizations',
 'Scaling law research', 'Organizational growth patterns', 'AI scaling dynamics', 'Autonomous growth optimization', 'Scaling sensing interfaces',
 ARRAY['Urban scaling', 'Company growth'], 
 ARRAY['Jane Jacobs', 'Peter Senge'], 
 ARRAY['Scaling Laws', 'Network Theory']);