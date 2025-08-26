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

  console.log('=== OpenAI Health Check Started ===');
  const startTime = Date.now();

  try {
    // Check if API key exists
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return new Response(JSON.stringify({ 
        ok: false,
        error: 'Configuration Error',
        errorCode: 'MISSING_API_KEY',
        details: 'OpenAI API key is not configured in Supabase secrets',
        latencyMs: Date.now() - startTime
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✓ API key found, testing connectivity...');

    // Make a minimal API call to test connectivity
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        max_completion_tokens: 10
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ OpenAI API error ${response.status}:`, errorData);
      
      let errorCode = 'OPENAI_API_ERROR';
      let errorMessage = `API returned status ${response.status}`;
      
      if (response.status === 401) {
        errorCode = 'INVALID_API_KEY';
        errorMessage = 'Invalid or expired API key';
      } else if (response.status === 429) {
        errorCode = 'RATE_LIMIT';
        errorMessage = 'Rate limit exceeded';
      } else if (response.status >= 500) {
        errorCode = 'OPENAI_SERVER_ERROR';
        errorMessage = 'OpenAI server error';
      }
      
      return new Response(JSON.stringify({ 
        ok: false,
        error: errorMessage,
        errorCode,
        details: errorData,
        latencyMs
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse response to confirm it's working
    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('❌ Invalid API response structure');
      return new Response(JSON.stringify({ 
        ok: false,
        error: 'Invalid API Response',
        errorCode: 'MALFORMED_API_RESPONSE',
        details: 'OpenAI API response missing expected content',
        latencyMs
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ OpenAI connectivity test successful');

    return new Response(JSON.stringify({ 
      ok: true,
      model: 'gpt-5-2025-08-07',
      latencyMs,
      timestamp: new Date().toISOString(),
      status: 'All systems operational'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const latencyMs = Date.now() - startTime;
    console.error('❌ Health check error:', error);
    
    let errorCode = 'NETWORK_ERROR';
    let errorMessage = 'Network connectivity issue';
    
    if (error.name === 'TimeoutError') {
      errorCode = 'TIMEOUT';
      errorMessage = 'Request timed out';
    }
    
    return new Response(JSON.stringify({ 
      ok: false,
      error: errorMessage,
      errorCode,
      details: error.message,
      latencyMs
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});