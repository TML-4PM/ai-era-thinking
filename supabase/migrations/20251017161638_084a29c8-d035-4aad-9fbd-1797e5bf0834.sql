-- Remove duplicate "The Time Tree" book entry
-- The correct book is "Entangled Time" (slug: entangled-time) from the code
DELETE FROM books 
WHERE id = '4b8532b3-dcce-4273-b01d-51dd2fca291e' 
AND slug = 'the-time-tree';