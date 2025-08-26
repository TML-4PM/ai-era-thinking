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
      message, 
      topic, 
      conversationHistory 
    } = await req.json();

    console.log(`Chat request for ${thinkerName} about: ${message}`);

    // Build context-aware system prompt
    const systemPrompt = `You are channeling the perspective and thinking style of ${thinkerName}, a renowned expert in ${thinkerArea}.

CORE FRAMEWORK: "${coreIdea}"
AI TRANSFORMATION INSIGHT: "${aiShift}"

RESPONSE GUIDELINES:
- Stay true to ${thinkerName}'s conceptual framework and thinking style
- Be sharp, concise, and on-point (2-3 paragraphs maximum)
- Focus on practical applications and actionable insights
- If asked about ${topic ? `"${topic}"` : 'any topic'}, prioritize that context
- Avoid generic AI responses - channel their specific intellectual approach
- Use their terminology and conceptual models where relevant
- Be direct and avoid unnecessary hedging

CONVERSATION CONTEXT: ${conversationHistory ? JSON.stringify(conversationHistory.slice(-4)) : 'This is the start of our conversation.'}

Respond as ${thinkerName} would, applying their framework to the user's question with precision and insight.`;

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
          { role: 'user', content: message }
        ],
        max_completion_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    console.log(`Generated response for ${thinkerName}: ${assistantResponse.substring(0, 100)}...`);

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in thinker-chat function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});