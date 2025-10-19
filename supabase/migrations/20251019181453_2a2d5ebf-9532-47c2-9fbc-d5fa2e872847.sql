-- Insert missing books with correct cover URLs
INSERT INTO books (slug, title, subtitle, lead_description, cover_url, collection, status, series_name, ready_flag)
VALUES (
  'tech-for-humanity',
  'Tech for Humanity',
  'Complete Collection',
  'A comprehensive 15-part exploration of technology''s role in human flourishing.',
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Man.png',
  'Premier Collection',
  'writing',
  'Tech for Humanity',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  cover_url = EXCLUDED.cover_url,
  collection = EXCLUDED.collection,
  status = EXCLUDED.status,
  ready_flag = EXCLUDED.ready_flag;

INSERT INTO books (slug, title, subtitle, lead_description, cover_url, collection, status, series_name, ready_flag)
VALUES (
  'quantum-logic-systems',
  'Quantum Logic Systems',
  'Quantum Foundations for Biological and Cognitive Systems',
  'Exploring quantum principles in biological systems and their implications for AI and consciousness.',
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Man.png',
  'In Development',
  'writing',
  'Quantum Logic Systems',
  false
)
ON CONFLICT (slug) DO UPDATE SET
  cover_url = EXCLUDED.cover_url,
  collection = EXCLUDED.collection,
  status = EXCLUDED.status,
  ready_flag = EXCLUDED.ready_flag;

INSERT INTO books (slug, title, subtitle, lead_description, cover_url, collection, status, series_name, ready_flag)
VALUES (
  'regenerative-organization',
  'The Regenerative Organization',
  'STRIP-MAP-UPDATE Framework for Adaptive Systems',
  'A practical framework for building adaptive, regenerative organizational systems.',
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/main%20AHC%20image.jpg',
  'On the Drawing Board',
  'draft',
  'The Regenerative Organization',
  false
)
ON CONFLICT (slug) DO UPDATE SET
  cover_url = EXCLUDED.cover_url,
  collection = EXCLUDED.collection,
  status = EXCLUDED.status,
  ready_flag = EXCLUDED.ready_flag;

INSERT INTO books (slug, title, subtitle, lead_description, cover_url, collection, status, series_name, ready_flag, due_date)
VALUES (
  'entangled-time',
  'Entangled Time',
  'Temporal Intelligence for Complex Systems',
  'A comprehensive guide to time-aware planning across families, teams, and cities.',
  '/assets/covers/time-tree.jpg',
  'On the Drawing Board',
  'draft',
  'Entangled Time',
  false,
  '2026-01-15'
)
ON CONFLICT (slug) DO UPDATE SET
  cover_url = EXCLUDED.cover_url,
  collection = EXCLUDED.collection,
  status = EXCLUDED.status,
  ready_flag = EXCLUDED.ready_flag,
  due_date = EXCLUDED.due_date;