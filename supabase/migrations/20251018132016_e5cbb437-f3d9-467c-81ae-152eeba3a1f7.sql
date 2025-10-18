-- Add The Thinking Engine book to database
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
  'thinking-engine',
  'The Thinking Engine',
  'Cognitive Systems, Decision-Making, and Intelligent Design',
  'A comprehensive 15-volume exploration of how humans and machines think, decide, and evolve together across five technological eras. From foundational principles to cutting-edge agentic systems.',
  '/assets/covers/thinking-engine-hub.jpg',
  'Tech for Humanity',
  'Complete Collection',
  'writing',
  1,
  'Tech for Humanity Team',
  true,
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  lead_description = EXCLUDED.lead_description,
  updated_at = now();

-- Add 15 chapters for The Thinking Engine (check if book exists first)
DO $$
DECLARE
  v_book_id uuid;
BEGIN
  -- Get the book ID
  SELECT id INTO v_book_id FROM books WHERE slug = 'thinking-engine';
  
  -- Only insert if book exists and chapters don't already exist
  IF v_book_id IS NOT NULL THEN
    -- Check if chapters already exist
    IF NOT EXISTS (SELECT 1 FROM book_chapters WHERE book_id = v_book_id) THEN
      INSERT INTO book_chapters (book_id, title, slug, chapter_order, progress_percentage, created_at, updated_at)
      VALUES
        (v_book_id, 'Principles', 'principles', 1, 0, now(), now()),
        (v_book_id, 'Institutions', 'institutions', 2, 0, now(), now()),
        (v_book_id, 'Doctrines', 'doctrines', 3, 0, now(), now()),
        (v_book_id, 'Frameworks', 'frameworks', 4, 0, now(), now()),
        (v_book_id, 'Thinkers', 'thinkers', 5, 84, now(), now()),
        (v_book_id, 'Disciplines', 'disciplines', 6, 60, now(), now()),
        (v_book_id, 'Technologies', 'technologies', 7, 60, now(), now()),
        (v_book_id, 'Organizations', 'organizations', 8, 0, now(), now()),
        (v_book_id, 'Cultures', 'cultures', 9, 0, now(), now()),
        (v_book_id, 'Roles', 'roles', 10, 65, now(), now()),
        (v_book_id, 'Products', 'products', 11, 0, now(), now()),
        (v_book_id, 'Eras', 'eras', 12, 66, now(), now()),
        (v_book_id, 'Environment', 'environment', 13, 0, now(), now()),
        (v_book_id, 'Energy and Forces', 'energy-and-forces', 14, 0, now(), now()),
        (v_book_id, 'Unstructured', 'unstructured', 15, 0, now(), now());
    END IF;
  END IF;
END $$;