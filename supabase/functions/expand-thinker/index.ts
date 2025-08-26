import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { 
      thinkerName, 
      thinkerArea, 
      coreIdea, 
      aiShift, 
      selectedDomains 
    } = await req.json();

    console.log(`Framework expansion request for ${thinkerName} across ${selectedDomains.length} domains`);

    const systemPrompt = `You are an expert consultant who specializes in applying intellectual frameworks across different business domains. You're expanding ${thinkerName}'s framework from ${thinkerArea} into new business contexts.

THINKER FRAMEWORK:
- Name: ${thinkerName}
- Original Area: ${thinkerArea}
- Core Idea: "${coreIdea}"
- AI Transformation: "${aiShift}"

TASK: For each specified business domain, provide a structured analysis of how this thinker's framework applies.

OUTPUT FORMAT: Return a JSON array with this exact structure:
[
  {
    "domain": "Domain Name",
    "relevance": "2-sentence explanation of why this framework is relevant to this domain",
    "keyInsights": ["insight 1", "insight 2", "insight 3"],
    "practicalApplications": ["application 1", "application 2", "application 3"],
    "implementationSteps": ["step 1", "step 2", "step 3", "step 4"],
    "challenges": ["challenge 1", "challenge 2", "challenge 3"],
    "metrics": ["metric 1", "metric 2", "metric 3", "metric 4"]
  }
]

REQUIREMENTS:
- Be specific and actionable, not generic
- Focus on how the core framework translates practically
- Keep insights sharp and implementation-focused
- Each array should have 3-4 items maximum
- Use business language appropriate to each domain
- Ensure JSON is valid and properly formatted

Domains to analyze: ${selectedDomains.join(', ')}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate framework expansion analysis for these business domains: ${selectedDomains.join(', ')}` }
        ],
        max_completion_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const expansionContent = data.choices[0].message.content;

    console.log(`Generated expansion content: ${expansionContent.substring(0, 200)}...`);

    // Parse the JSON response
    let expansions;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = expansionContent.replace(/```json\n?|\n?```/g, '').trim();
      expansions = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse expansion JSON:', parseError);
      console.error('Raw content:', expansionContent);
      throw new Error('Failed to parse framework expansion data');
    }

    if (!Array.isArray(expansions)) {
      throw new Error('Invalid expansion format - expected array');
    }

    console.log(`Successfully generated ${expansions.length} domain expansions for ${thinkerName}`);

    return new Response(JSON.stringify({ expansions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in expand-thinker function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to expand framework',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});