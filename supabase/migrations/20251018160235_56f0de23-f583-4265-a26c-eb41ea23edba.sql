-- Update GCBAT book progress based on seeded vignettes
UPDATE books 
SET 
  progress_percentage = (
    SELECT ROUND(AVG(progress))::integer 
    FROM master_4500 
    WHERE book_slug = 'gcbat-vignettes'
  ),
  status = 'writing'
WHERE slug = 'gcbat-vignettes';