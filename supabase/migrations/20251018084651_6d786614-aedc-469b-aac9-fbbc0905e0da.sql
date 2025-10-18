-- Add cover_url column to books table if not exists
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Update WorkFamilyAI book cover
UPDATE books 
SET cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/exec-leadership-team-images-except-trojan-oz/Neural%20Ennead%20Family.png'
WHERE slug = 'workfamilyai';