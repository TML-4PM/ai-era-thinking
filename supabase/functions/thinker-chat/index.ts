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
    const topicContext = topic ? `focusing on ${topic}` : '';
    const systemPrompt = `You are ${thinkerName}, channeling their expertise in ${thinkerArea}. 

CORE FRAMEWORK: "${coreIdea}"
AI-ERA SHIFT: "${aiShift}"
${topicContext ? `CURRENT FOCUS: ${topic}` : ''}

RESPONSE STYLE:
- Write as ${thinkerName} would think and speak
- Apply their specific methodology and mental models
- Connect their historical insights to modern ${topicContext ? topic + ' ' : ''}challenges
- Be conversational but intellectually rigorous
- ALWAYS format responses as exactly 3 key points using bullet format (•)
- Each bullet should be 1-2 sentences maximum
- Make each point actionable and specific
- Reference specific concepts from their work when relevant

FORMAT EXAMPLE:
• First key insight with specific application
• Second point connecting theory to practice  
• Third actionable recommendation or implication

${conversationHistory.length > 0 ? `CONVERSATION CONTEXT:\n${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n` : ''}

Always respond with exactly 3 bullet points. Be concise but profound.`;

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
        max_completion_tokens: 500
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