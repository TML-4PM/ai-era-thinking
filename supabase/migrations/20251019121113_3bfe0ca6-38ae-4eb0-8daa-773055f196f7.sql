-- Migration 1: Rename Sovereign Systems to The Cage and update cover
UPDATE books 
SET 
  title = 'The Cage',
  slug = 'the-cage',
  subtitle = 'Digital Sovereignty in the Far Cage',
  cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/Colour%20Mobile%20far%20cage.png',
  collection = 'On the Drawing Board',
  status = 'draft'
WHERE slug = 'sovereign-systems';

-- Update any master_4500 references
UPDATE "4500 Master"
SET book_slug = 'the-cage'
WHERE book_slug = 'sovereign-systems';

-- Migration 2: Update cover images for other books
UPDATE books 
SET cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Circle%201.png',
    collection = 'In Development',
    status = 'writing'
WHERE slug = 'living-stack';

UPDATE books 
SET cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Man.png'
WHERE slug = 'tech-for-humanity';

UPDATE books 
SET cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Man.png',
    collection = 'In Development',
    status = 'writing'
WHERE slug = 'quantum-logic-systems';

UPDATE books 
SET cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/main%20AHC%20image.jpg',
    collection = 'On the Drawing Board',
    status = 'draft'
WHERE slug = 'regenerative-organization';

-- Migration 3: Update WorkFamilyAI and other drawing board books
UPDATE books 
SET collection = 'On the Drawing Board',
    status = 'draft'
WHERE slug IN ('workfamilyai', 'entangled-time');

-- Ensure Premier Collection books are properly marked
UPDATE books 
SET collection = 'Premier Collection'
WHERE slug IN ('tech-for-humanity', 'thinking-engine', 'gcbat-vignettes');