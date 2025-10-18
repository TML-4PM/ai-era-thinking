-- Insert Living Stack book with valid status
INSERT INTO books (
  slug, 
  title, 
  subtitle, 
  lead_description, 
  cover_url,
  series_name, 
  collection, 
  status, 
  progress_percentage,
  owner,
  ready_flag,
  created_at,
  updated_at
) VALUES (
  'living-stack',
  'Living Stack',
  'A Cognitive Reef Architecture for Signal-Driven Systems',
  'Treating tasks as signals, roles that mutate in real-time, and recovery mechanisms that ensure continuity across human-machine collaboration.',
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/T4H%20Logo%201.jpg',
  'Tech for Humanity',
  'Tech for Humanity Suite',
  'writing',
  35,
  'Tech for Humanity Team',
  true,
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  cover_url = EXCLUDED.cover_url,
  updated_at = now();

-- Insert book chapters for Living Stack
INSERT INTO book_chapters (book_id, title, chapter_order, progress_percentage, sections)
SELECT 
  b.id,
  'Foundation Concepts',
  1,
  17,
  '["The Coordination Problem", "Tasks as Signals"]'::jsonb
FROM books b WHERE b.slug = 'living-stack'
ON CONFLICT (book_id, chapter_order) DO UPDATE SET
  title = EXCLUDED.title,
  progress_percentage = EXCLUDED.progress_percentage,
  sections = EXCLUDED.sections;

INSERT INTO book_chapters (book_id, title, chapter_order, progress_percentage, sections)
SELECT 
  b.id,
  'Cognitive Reef Architecture',
  2,
  16,
  '["Agent Roster Design", "Mutation Protocols", "Recovery Mechanisms"]'::jsonb
FROM books b WHERE b.slug = 'living-stack'
ON CONFLICT (book_id, chapter_order) DO UPDATE SET
  title = EXCLUDED.title,
  progress_percentage = EXCLUDED.progress_percentage,
  sections = EXCLUDED.sections;

INSERT INTO book_chapters (book_id, title, chapter_order, progress_percentage, sections)
SELECT 
  b.id,
  'Implementation Patterns',
  3,
  11,
  '["Time Tree Integration", "Cognitive Load Management", "Multi-Agent Orchestration"]'::jsonb
FROM books b WHERE b.slug = 'living-stack'
ON CONFLICT (book_id, chapter_order) DO UPDATE SET
  title = EXCLUDED.title,
  progress_percentage = EXCLUDED.progress_percentage,
  sections = EXCLUDED.sections;