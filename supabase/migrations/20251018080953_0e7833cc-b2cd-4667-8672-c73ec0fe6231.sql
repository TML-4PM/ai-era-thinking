-- Update WorkFamilyAI book record to be standalone
UPDATE books 
SET 
  collection = 'Standalone',
  series_name = 'WorkFamilyAI',
  subtitle = 'AI-Powered Work-Family Alignment System'
WHERE slug = 'workfamilyai';

-- Add story metadata columns to book_chapters for GCBAT enhancement
ALTER TABLE book_chapters 
ADD COLUMN IF NOT EXISTS story_arc INTEGER,
ADD COLUMN IF NOT EXISTS primary_character_id UUID REFERENCES gcbat_characters(id),
ADD COLUMN IF NOT EXISTS risk_tier TEXT,
ADD COLUMN IF NOT EXISTS chapter_tags TEXT[];

-- Update GCBAT chapter 11 with metadata
UPDATE book_chapters
SET 
  story_arc = 1,
  risk_tier = 'Infrastructure Collapse',
  chapter_tags = ARRAY['Arc 1', 'Infrastructure', 'Elena Vasquez']
WHERE book_id = (SELECT id FROM books WHERE slug = 'gcbat-vignettes')
  AND chapter_order = 11;