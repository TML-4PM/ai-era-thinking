import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API Configuration
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Validation function
function validateRequest(body: any): string[] {
  const errors: string[] = [];
  
  if (!body.thinkerName || typeof body.thinkerName !== 'string') {
    errors.push('thinkerName is required and must be a string');
  }
  if (!body.thinkerArea || typeof body.thinkerArea !== 'string') {
    errors.push('thinkerArea is required and must be a string');
  }
  if (!body.coreIdea || typeof body.coreIdea !== 'string') {
    errors.push('coreIdea is required and must be a string');
  }
  if (!body.aiShift || typeof body.aiShift !== 'string') {
    errors.push('aiShift is required and must be a string');
  }
  if (!Array.isArray(body.selectedDomains) || body.selectedDomains.length === 0) {
    errors.push('selectedDomains must be a non-empty array');
  }
  
  return errors;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  console.log('=== Framework Expansion Request Started ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Environment check - OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
  console.log('Environment check - OPENAI_API_KEY length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);

  try {
    // Validate API key first
    if (!OPENAI_API_KEY) {
      console.error('CRITICAL: OPENAI_API_KEY environment variable is not configured');
      return new Response(JSON.stringify({ 
        error: 'Configuration Error',
        details: 'OpenAI API key is not configured. Please check your secrets configuration.',
        errorCode: 'MISSING_API_KEY'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✓ API key configured');

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('✓ Request body parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid Request',
        details: 'Request body is not valid JSON',
        errorCode: 'INVALID_JSON'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    const validationErrors = validateRequest(requestBody);
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return new Response(JSON.stringify({ 
        error: 'Validation Failed',
        details: 'Required fields are missing or invalid',
        validationErrors,
        errorCode: 'VALIDATION_ERROR'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { thinkerName, thinkerArea, coreIdea, aiShift, selectedDomains } = requestBody;

    console.log(`✓ Validation passed - Processing request for ${thinkerName} across ${selectedDomains.length} domains: ${selectedDomains.join(', ')}`);

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

    console.log('✓ System prompt prepared, making OpenAI API call...');

    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('Request timed out after 30 seconds');
    }, REQUEST_TIMEOUT);

    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({ 
          error: 'Request Timeout',
          details: 'The request to OpenAI timed out after 30 seconds. Please try again.',
          errorCode: 'TIMEOUT'
        }), {
          status: 408,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: 'Network Error',
        details: `Failed to connect to OpenAI API: ${fetchError.message}`,
        errorCode: 'NETWORK_ERROR'
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✓ OpenAI API responded with status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`✗ OpenAI API error (${response.status}):`, errorData);
      
      let errorMessage = `OpenAI API returned status ${response.status}`;
      let errorCode = 'OPENAI_API_ERROR';
      
      if (response.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
        errorCode = 'INVALID_API_KEY';
      } else if (response.status === 429) {
        errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
        errorCode = 'RATE_LIMIT';
      } else if (response.status >= 500) {
        errorMessage = 'OpenAI API is experiencing issues. Please try again later.';
        errorCode = 'OPENAI_SERVER_ERROR';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: errorData,
        errorCode: errorCode
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse OpenAI response
    let data;
    try {
      data = await response.json();
      console.log('✓ OpenAI response parsed successfully');
    } catch (jsonError) {
      console.error('✗ Failed to parse OpenAI response as JSON:', jsonError);
      return new Response(JSON.stringify({ 
        error: 'Invalid API Response',
        details: 'OpenAI API returned invalid JSON',
        errorCode: 'INVALID_API_RESPONSE'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate OpenAI response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('✗ Invalid OpenAI response structure:', data);
      return new Response(JSON.stringify({ 
        error: 'Invalid API Response',
        details: 'OpenAI API response is missing expected data structure',
        errorCode: 'MALFORMED_API_RESPONSE'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const expansionContent = data.choices[0].message?.content;
    if (!expansionContent) {
      console.error('✗ No content in OpenAI response');
      return new Response(JSON.stringify({ 
        error: 'Empty Response',
        details: 'OpenAI API returned empty content',
        errorCode: 'EMPTY_API_RESPONSE'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✓ Generated expansion content (${expansionContent.length} characters): ${expansionContent.substring(0, 200)}...`);

    // Parse the framework expansion JSON
    let expansions;
    try {
      // Clean the content by removing markdown code blocks and extra whitespace
      let cleanContent = expansionContent.replace(/```json\n?|\n?```/g, '').trim();
      
      // Also try to extract JSON if it's embedded in other text
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }
      
      console.log(`✓ Attempting to parse cleaned JSON content: ${cleanContent.substring(0, 100)}...`);
      expansions = JSON.parse(cleanContent);
      console.log('✓ JSON parsing successful');
      
    } catch (parseError) {
      console.error('✗ Failed to parse expansion JSON:', parseError);
      console.error('✗ Raw content for debugging:', expansionContent);
      
      return new Response(JSON.stringify({ 
        error: 'JSON Parse Error',
        details: `Failed to parse framework expansion data: ${parseError.message}`,
        rawContent: expansionContent.substring(0, 500) + '...',
        errorCode: 'JSON_PARSE_ERROR'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate expansion format
    if (!Array.isArray(expansions)) {
      console.error('✗ Invalid expansion format - not an array:', typeof expansions);
      return new Response(JSON.stringify({ 
        error: 'Invalid Data Format',
        details: 'Framework expansion data is not in the expected array format',
        actualType: typeof expansions,
        errorCode: 'INVALID_DATA_FORMAT'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate each expansion object
    const validationIssues = [];
    expansions.forEach((expansion, index) => {
      const requiredFields = ['domain', 'relevance', 'keyInsights', 'practicalApplications', 'implementationSteps', 'challenges', 'metrics'];
      requiredFields.forEach(field => {
        if (!expansion.hasOwnProperty(field)) {
          validationIssues.push(`Expansion ${index + 1}: missing field '${field}'`);
        }
      });
    });

    if (validationIssues.length > 0) {
      console.error('✗ Expansion validation issues:', validationIssues);
      return new Response(JSON.stringify({ 
        error: 'Data Validation Error',
        details: 'Generated expansions are missing required fields',
        validationIssues,
        errorCode: 'EXPANSION_VALIDATION_ERROR'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const processingTime = Date.now() - startTime;
    console.log(`✓ Successfully generated ${expansions.length} domain expansions for ${thinkerName} in ${processingTime}ms`);

    return new Response(JSON.stringify({ 
      expansions,
      metadata: {
        processingTimeMs: processingTime,
        domainsProcessed: selectedDomains.length,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('✗ Unexpected error in expand-thinker function:', error);
    console.error('✗ Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error.message,
      errorCode: 'INTERNAL_ERROR',
      processingTimeMs: processingTime
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});