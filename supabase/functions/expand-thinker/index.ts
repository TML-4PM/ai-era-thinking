import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API Configuration
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const REQUEST_TIMEOUT = 45000; // 45 seconds for batched requests
const MAX_DOMAINS_PER_BATCH = 3;

// Model fallback sequence
const MODELS = [
  'gpt-5-2025-08-07',
  'gpt-5-mini-2025-08-07', 
  'gpt-4.1-2025-04-14'
];

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

// Sleep utility for retries
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Make OpenAI request with retry and fallback
async function makeOpenAIRequest(
  prompt: string, 
  userMessage: string, 
  modelIndex = 0, 
  retryCount = 0
): Promise<{ content: string; model: string; attempts: number }> {
  const model = MODELS[modelIndex];
  const maxRetries = 2;
  
  console.log(`🤖 Attempting OpenAI request with ${model} (attempt ${retryCount + 1})`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('Request timed out');
    }, REQUEST_TIMEOUT);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ],
        max_completion_tokens: model.includes('gpt-4.1') ? 2000 : 2000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ ${model} failed with status ${response.status}:`, errorData);
      
      // Handle specific errors
      if (response.status === 429) {
        // Rate limit - wait and retry with same model
        if (retryCount < maxRetries) {
          const waitTime = 1000 * (retryCount + 1); // 1s, 2s, 3s
          console.log(`⏱️ Rate limited, waiting ${waitTime}ms before retry`);
          await sleep(waitTime);
          return makeOpenAIRequest(prompt, userMessage, modelIndex, retryCount + 1);
        }
        // If max retries reached, try next model
        if (modelIndex < MODELS.length - 1) {
          console.log(`🔄 Max retries reached, trying next model`);
          return makeOpenAIRequest(prompt, userMessage, modelIndex + 1, 0);
        }
        throw new Error(`RATE_LIMIT:${errorData}`);
      }
      
      if (response.status === 401) {
        throw new Error(`INVALID_API_KEY:${errorData}`);
      }
      
      if (response.status >= 500) {
        // Server error - try next model if available
        if (modelIndex < MODELS.length - 1) {
          console.log(`🔄 Server error, trying next model`);
          return makeOpenAIRequest(prompt, userMessage, modelIndex + 1, 0);
        }
        throw new Error(`OPENAI_SERVER_ERROR:${errorData}`);
      }
      
      throw new Error(`OPENAI_API_ERROR:${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('EMPTY_API_RESPONSE:No content in OpenAI response');
    }

    console.log(`✅ ${model} succeeded`);
    return { 
      content: data.choices[0].message.content, 
      model,
      attempts: retryCount + 1
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`⏱️ ${model} request timed out`);
      if (modelIndex < MODELS.length - 1) {
        return makeOpenAIRequest(prompt, userMessage, modelIndex + 1, 0);
      }
      throw new Error('TIMEOUT:Request timed out after trying all models');
    }
    
    // If it's one of our custom errors, re-throw
    if (error.message.includes(':')) {
      throw error;
    }
    
    // Network or other error - try next model if available
    if (modelIndex < MODELS.length - 1) {
      console.log(`🔄 Network error, trying next model: ${error.message}`);
      return makeOpenAIRequest(prompt, userMessage, modelIndex + 1, 0);
    }
    
    throw new Error(`NETWORK_ERROR:${error.message}`);
  }
}

// Parse JSON with multiple fallback strategies
function parseFrameworkJSON(content: string, attempt = 1): any {
  console.log(`🔍 JSON parsing attempt ${attempt}`);
  
  try {
    // Strategy 1: Direct parse
    if (attempt === 1) {
      return JSON.parse(content.trim());
    }
    
    // Strategy 2: Remove markdown blocks
    if (attempt === 2) {
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    }
    
    // Strategy 3: Extract JSON array
    if (attempt === 3) {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    }
    
    // Strategy 4: More aggressive cleaning
    if (attempt === 4) {
      const lines = content.split('\n');
      const startIdx = lines.findIndex(line => line.trim().startsWith('['));
      const endIdx = lines.findLastIndex(line => line.trim().includes(']'));
      
      if (startIdx !== -1 && endIdx !== -1) {
        const jsonLines = lines.slice(startIdx, endIdx + 1);
        return JSON.parse(jsonLines.join('\n'));
      }
    }
    
    throw new Error('No valid JSON found');
    
  } catch (parseError) {
    console.error(`❌ JSON parsing attempt ${attempt} failed:`, parseError.message);
    
    if (attempt < 4) {
      return parseFrameworkJSON(content, attempt + 1);
    }
    
    throw new Error(`JSON_PARSE_ERROR:Failed to parse after ${attempt} attempts - ${parseError.message}`);
  }
}

// Process domains in batches
async function processDomainBatch(
  domains: string[], 
  thinkerName: string, 
  thinkerArea: string, 
  coreIdea: string, 
  aiShift: string
): Promise<{ expansions: any[]; model: string; batchSize: number; processingTime: number }> {
  const startTime = Date.now();
  
  console.log(`📦 Processing batch of ${domains.length} domains: ${domains.join(', ')}`);
  
  const systemPrompt = `You are an expert consultant specializing in applying intellectual frameworks across business domains. You're expanding ${thinkerName}'s framework from ${thinkerArea} into new contexts.

THINKER FRAMEWORK:
- Name: ${thinkerName}
- Original Area: ${thinkerArea}
- Core Idea: "${coreIdea}"
- AI Transformation: "${aiShift}"

CRITICAL: Return ONLY a valid JSON array. No explanatory text, no markdown blocks, just the JSON.

OUTPUT FORMAT:
[
  {
    "domain": "Domain Name",
    "relevance": "2-sentence explanation of relevance",
    "keyInsights": ["insight 1", "insight 2", "insight 3"],
    "practicalApplications": ["application 1", "application 2", "application 3"],
    "implementationSteps": ["step 1", "step 2", "step 3"],
    "challenges": ["challenge 1", "challenge 2", "challenge 3"],
    "metrics": ["metric 1", "metric 2", "metric 3"]
  }
]

REQUIREMENTS:
- Exactly 3 items per array (keyInsights, practicalApplications, implementationSteps, challenges, metrics)
- Business-focused language
- Actionable insights
- Valid JSON only

Domains: ${domains.join(', ')}`;

  const userMessage = `Generate framework expansion analysis for: ${domains.join(', ')}`;
  
  const { content, model, attempts } = await makeOpenAIRequest(systemPrompt, userMessage);
  const expansions = parseFrameworkJSON(content);
  
  // Validate structure
  if (!Array.isArray(expansions)) {
    throw new Error('INVALID_DATA_FORMAT:Expected JSON array');
  }
  
  const processingTime = Date.now() - startTime;
  console.log(`✅ Batch processed successfully in ${processingTime}ms with ${model}`);
  
  return { expansions, model, batchSize: domains.length, processingTime };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  console.log('=== Framework Expansion Request Started ===');
  console.log('Request method:', req.method);
  console.log('Environment check - OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
  console.log('Environment check - OPENAI_API_KEY length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);

  try {
    // Validate API key first
    if (!OPENAI_API_KEY) {
      console.error('CRITICAL: OPENAI_API_KEY environment variable is not configured');
      return new Response(JSON.stringify({ 
        error: 'Configuration Error',
        details: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your Supabase secrets.',
        errorCode: 'MISSING_API_KEY',
        suggestedAction: 'Configure API key in Supabase Functions settings'
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

    console.log(`✓ Processing ${selectedDomains.length} domains for ${thinkerName}`);

    // Split domains into batches if needed
    const batches = [];
    for (let i = 0; i < selectedDomains.length; i += MAX_DOMAINS_PER_BATCH) {
      batches.push(selectedDomains.slice(i, i + MAX_DOMAINS_PER_BATCH));
    }

    console.log(`📦 Processing ${batches.length} batch(es)`);

    // Process all batches
    const allExpansions = [];
    const batchResults = [];
    
    for (let i = 0; i < batches.length; i++) {
      try {
        console.log(`🚀 Processing batch ${i + 1}/${batches.length}`);
        const result = await processDomainBatch(
          batches[i], 
          thinkerName, 
          thinkerArea, 
          coreIdea, 
          aiShift
        );
        
        allExpansions.push(...result.expansions);
        batchResults.push({
          batchNumber: i + 1,
          domains: batches[i],
          success: true,
          model: result.model,
          processingTime: result.processingTime,
          expansionCount: result.expansions.length
        });
        
      } catch (batchError) {
        console.error(`❌ Batch ${i + 1} failed:`, batchError.message);
        batchResults.push({
          batchNumber: i + 1,
          domains: batches[i],
          success: false,
          error: batchError.message
        });
        
        // Continue processing other batches even if one fails
      }
    }

    const totalProcessingTime = Date.now() - startTime;
    
    // Check if we got any successful results
    if (allExpansions.length === 0) {
      const errorCode = batchResults[0]?.error?.split(':')[0] || 'PROCESSING_FAILED';
      const errorDetails = batchResults[0]?.error?.split(':')[1] || 'All batches failed to process';
      
      return new Response(JSON.stringify({ 
        error: 'Processing Failed',
        details: errorDetails,
        errorCode,
        batchResults,
        suggestedAction: errorCode === 'RATE_LIMIT' ? 'Wait a moment and try with fewer domains' :
                        errorCode === 'INVALID_API_KEY' ? 'Check your OpenAI API key configuration' :
                        errorCode === 'JSON_PARSE_ERROR' ? 'This is a temporary issue, please retry' :
                        'Please try again or contact support'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Successfully generated ${allExpansions.length} expansions in ${totalProcessingTime}ms`);

    return new Response(JSON.stringify({ 
      expansions: allExpansions,
      metadata: {
        processingTimeMs: totalProcessingTime,
        domainsRequested: selectedDomains.length,
        domainsProcessed: allExpansions.length,
        batchCount: batches.length,
        batchResults,
        timestamp: new Date().toISOString(),
        successRate: (batchResults.filter(b => b.success).length / batchResults.length * 100).toFixed(1) + '%'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('✗ Unexpected error in expand-thinker function:', error);
    console.error('✗ Error stack:', error.stack);
    
    // Extract error code if it's one of our custom errors
    const errorCode = error.message.includes(':') ? error.message.split(':')[0] : 'INTERNAL_ERROR';
    const errorDetails = error.message.includes(':') ? error.message.split(':')[1] : error.message;
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      details: errorDetails,
      errorCode,
      processingTimeMs: processingTime,
      suggestedAction: errorCode === 'RATE_LIMIT' ? 'Wait a moment and retry' :
                      errorCode === 'INVALID_API_KEY' ? 'Check OpenAI API key configuration' :
                      errorCode === 'NETWORK_ERROR' ? 'Check internet connection and retry' :
                      'Please try again or contact support'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});