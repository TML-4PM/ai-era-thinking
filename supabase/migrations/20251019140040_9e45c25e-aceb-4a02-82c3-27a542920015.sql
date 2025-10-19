-- Rename "The Cage" to "The Far Cage"
UPDATE books 
SET 
  title = 'The Far Cage',
  slug = 'the-far-cage',
  subtitle = 'Digital Sovereignty and the Architecture of Control',
  lead_description = 'Exploring digital sovereignty, identity, autonomy, and control in the age of pervasive computation',
  cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/Colour%20Mobile%20far%20cage.png'
WHERE slug IN ('the-cage', 'sovereign-systems');

-- Update any master_4500 references
UPDATE "4500 Master"
SET book_slug = 'the-far-cage'
WHERE book_slug IN ('the-cage', 'sovereign-systems');