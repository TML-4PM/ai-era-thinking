-- Update GCBAT book and arc progress to 100%
-- Calculate actual progress from master_4500 records
WITH arc_progress AS (
  SELECT 
    section_slug,
    COUNT(*) as total_vignettes,
    ROUND(AVG(progress)) as avg_progress
  FROM public.master_4500
  WHERE book_slug = 'gcbat-vignettes'
    AND section_slug IN ('arc-2', 'arc-3', 'arc-4', 'arc-5')
  GROUP BY section_slug
),
book_progress AS (
  SELECT 
    COUNT(*) as total_vignettes,
    ROUND(AVG(progress)) as overall_progress
  FROM public.master_4500
  WHERE book_slug = 'gcbat-vignettes'
)
UPDATE public.books
SET 
  progress_percentage = CASE
    WHEN slug = 'gcbat-vignettes' THEN (SELECT overall_progress FROM book_progress)
    WHEN slug = 'arc-2' THEN (SELECT avg_progress FROM arc_progress WHERE section_slug = 'arc-2')
    WHEN slug = 'arc-3' THEN (SELECT avg_progress FROM arc_progress WHERE section_slug = 'arc-3')
    WHEN slug = 'arc-4' THEN (SELECT avg_progress FROM arc_progress WHERE section_slug = 'arc-4')
    WHEN slug = 'arc-5' THEN (SELECT avg_progress FROM arc_progress WHERE section_slug = 'arc-5')
    ELSE progress_percentage
  END,
  ready_flag = CASE
    WHEN slug IN ('gcbat-vignettes', 'arc-2', 'arc-3', 'arc-4', 'arc-5') THEN true
    ELSE ready_flag
  END,
  updated_at = now()
WHERE slug IN ('gcbat-vignettes', 'arc-2', 'arc-3', 'arc-4', 'arc-5');