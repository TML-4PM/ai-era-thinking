-- Update Tech for Humanity book cover in database
UPDATE books 
SET cover_url = 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Man.png'
WHERE slug = 'tech-for-humanity';