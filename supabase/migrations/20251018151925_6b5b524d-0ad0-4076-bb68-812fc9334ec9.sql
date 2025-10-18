-- Migration 4: Boost Progress Scores Based on Link Density and Content Completeness
-- Update progress scores to reflect the actual content quality

-- Items with 3+ related_frameworks AND 3+ related_thinkers AND complete content → 90%
UPDATE master_4500
SET progress = 90
WHERE book_slug = 'thinking-engine'
  AND status IN ('seeded', 'complete')
  AND array_length(related_frameworks, 1) >= 3
  AND array_length(related_thinkers, 1) >= 3
  AND description IS NOT NULL AND description != ''
  AND cross_era_evolution IS NOT NULL AND cross_era_evolution != ''
  AND implementation_phase1 IS NOT NULL AND implementation_phase1 != '';

-- Items with 2+ of each AND complete content → 85%
UPDATE master_4500
SET progress = 85
WHERE book_slug = 'thinking-engine'
  AND status IN ('seeded', 'complete')
  AND array_length(related_frameworks, 1) >= 2
  AND array_length(related_thinkers, 1) >= 2
  AND description IS NOT NULL AND description != ''
  AND cross_era_evolution IS NOT NULL AND cross_era_evolution != ''
  AND progress < 85;

-- Items with 1+ of each AND complete content → 80%
UPDATE master_4500
SET progress = 80
WHERE book_slug = 'thinking-engine'
  AND status IN ('seeded', 'complete')
  AND array_length(related_frameworks, 1) >= 1
  AND array_length(related_thinkers, 1) >= 1
  AND description IS NOT NULL AND description != ''
  AND progress < 80;

-- Boost Thinkers section from 60% → 85% (they have all content, just underscored)
UPDATE master_4500
SET progress = 85
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-thinkers'
  AND description IS NOT NULL AND description != ''
  AND ai_relevance IS NOT NULL AND ai_relevance != ''
  AND progress < 85;

-- Boost Technologies section from 60% → 85%
UPDATE master_4500
SET progress = 85
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-technologies'
  AND description IS NOT NULL AND description != ''
  AND cross_era_evolution IS NOT NULL AND cross_era_evolution != ''
  AND progress < 85;

-- Boost Principles section to 90% (highest quality content)
UPDATE master_4500
SET progress = 90
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-principles'
  AND description IS NOT NULL AND description != ''
  AND cross_era_evolution IS NOT NULL AND cross_era_evolution != ''
  AND array_length(case_studies, 1) >= 1;

-- Boost Frameworks section to 90% (highest quality content)
UPDATE master_4500
SET progress = 90
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-frameworks'
  AND description IS NOT NULL AND description != ''
  AND cross_era_evolution IS NOT NULL AND cross_era_evolution != ''
  AND array_length(case_studies, 1) >= 1;

-- Boost well-documented Roles to 85%
UPDATE master_4500
SET progress = 85
WHERE book_slug = 'thinking-engine'
  AND section_slug = 'thinking-engine-roles'
  AND description IS NOT NULL AND description != ''
  AND cross_era_evolution IS NOT NULL AND cross_era_evolution != ''
  AND array_length(case_studies, 1) >= 1
  AND progress < 85;

-- Special boost for items with author statements (highest editorial quality)
UPDATE master_4500
SET progress = 95
WHERE book_slug = 'thinking-engine'
  AND status = 'complete'
  AND author_original_insight IS NOT NULL AND author_original_insight != ''
  AND author_ai_era_shift IS NOT NULL AND author_ai_era_shift != ''
  AND description IS NOT NULL AND description != ''
  AND cross_era_evolution IS NOT NULL AND cross_era_evolution != ''
  AND array_length(related_frameworks, 1) >= 2
  AND array_length(related_thinkers, 1) >= 2;

-- Ensure scaffold items stay at appropriate levels
UPDATE master_4500
SET progress = GREATEST(progress, 50)
WHERE book_slug = 'thinking-engine'
  AND status = 'scaffold'
  AND progress < 50;