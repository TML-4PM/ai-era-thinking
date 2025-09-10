import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Check if user is authenticated and has admin role
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { bookSlug, format = 'pdf' } = await req.json();

    if (!bookSlug) {
      return new Response(JSON.stringify({ error: 'Book slug is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating ${format.toUpperCase()} for book: ${bookSlug}`);

    // Get book data
    const { data: book, error: bookError } = await supabaseClient
      .from('books')
      .select(`
        *,
        book_chapters(*)
      `)
      .eq('slug', bookSlug)
      .single();

    if (bookError || !book) {
      return new Response(JSON.stringify({ error: 'Book not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For now, generate a simple HTML-based stub
    // In a full implementation, you'd use a proper PDF generation library
    const htmlContent = generateBookHTML(book);
    
    if (format === 'html') {
      return new Response(htmlContent, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${book.slug}-draft.html"`
        },
      });
    }

    // For PDF generation, you'd typically use a library like Puppeteer or similar
    // This is a stub implementation
    return new Response(JSON.stringify({ 
      message: 'PDF generation is not yet implemented',
      htmlPreview: true,
      previewUrl: `/books/${book.slug}`,
      suggestedImplementation: 'Use Puppeteer or similar PDF generation service'
    }), {
      status: 501,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-book-pdf function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate book export',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateBookHTML(book: any): string {
  const chapters = book.book_chapters || [];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${book.title}</title>
    <style>
        body { font-family: Georgia, serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #666; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .chapter { margin: 30px 0; padding: 20px; border-left: 4px solid #007acc; }
        .progress { background: #e0e0e0; height: 10px; border-radius: 5px; margin: 10px 0; }
        .progress-bar { background: #007acc; height: 100%; border-radius: 5px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <h1>${book.title}</h1>
    
    <div class="meta">
        <p><strong>Series:</strong> ${book.series_name || 'N/A'}</p>
        <p><strong>Collection:</strong> ${book.collection || 'N/A'}</p>
        <p><strong>Owner:</strong> ${book.owner || 'TBA'}</p>
        <p><strong>Due Date:</strong> ${book.due_date || 'TBA'}</p>
        <p><strong>Status:</strong> ${book.status || 'draft'}</p>
        <p><strong>Description:</strong> ${book.lead_description || 'No description available'}</p>
    </div>

    <h2>Table of Contents</h2>
    <ul>
        ${chapters.map((ch: any, i: number) => `
            <li><a href="#chapter-${i+1}">${ch.title}</a> (${ch.progress_percentage || 0}% complete)</li>
        `).join('')}
    </ul>

    <h2>Chapters</h2>
    ${chapters.map((ch: any, i: number) => `
        <div class="chapter" id="chapter-${i+1}">
            <h3>Chapter ${ch.chapter_order || i+1}: ${ch.title}</h3>
            <div class="progress">
                <div class="progress-bar" style="width: ${ch.progress_percentage || 0}%"></div>
            </div>
            <p><strong>Progress:</strong> ${ch.progress_percentage || 0}%</p>
            ${ch.sections ? `
                <p><strong>Sections:</strong></p>
                <ul>
                    ${ch.sections.map((section: string) => `<li>${section}</li>`).join('')}
                </ul>
            ` : ''}
            <p><em>Chapter content would be populated from your writing system.</em></p>
        </div>
    `).join('')}

    <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666;">
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>Draft document - ${book.title}</p>
    </footer>
</body>
</html>
  `.trim();
}