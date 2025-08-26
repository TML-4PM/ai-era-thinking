
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

interface DuoChatRequest {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
  memberCode: string;
  memberDisplayName: string;
  memberDescription: string;
  topic: string;
  petTopic?: string;
  domain: string;
}

serve(async (req) => {
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
      memberCode,
      memberDisplayName,
      memberDescription,
      topic,
      petTopic,
      domain
    }: DuoChatRequest = await req.json();

    console.log(`Duo chat: ${thinkerName} × ${memberCode} about: ${topic}`);

    const systemPrompt = `You are facilitating a structured dialogue between ${thinkerName} (a renowned thought leader) and ${memberDisplayName} (a Neural Ennead work family member) about ${topic} in the context of ${domain}.

PARTICIPANTS:

**${thinkerName}** (Thought Leader)
- Area: ${thinkerArea}
- Core Framework: "${coreIdea}"
- AI-Era Insight: "${aiShift}"
${petTopic ? `- Pet Topic: ${petTopic}` : ''}

**${memberDisplayName}** (Work Family Member: ${memberCode})
- Profile: ${memberDescription}
- Represents: Combined capabilities of this Neural Ennead member archetype

DIALOGUE FORMAT:
Structure the conversation across three specific timeframes with alternating perspectives. Each participant should speak in their authentic voice and expertise area.

Return ONLY a JSON object with this exact structure:
{
  "topic": "${topic}",
  "participants": ["${thinkerName}", "${memberDisplayName}"],
  "timeframes": {
    "now_0_6": {
      "thinker": "What ${thinkerName} would say about immediate 0-6 month actions (2-3 sentences max)",
      "member": "How ${memberDisplayName} would respond about quick wins and pilot approaches (2-3 sentences max)"
    },
    "mid_6_18": {
      "thinker": "${thinkerName}'s perspective on 6-18 month integration and scaling (2-3 sentences max)",
      "member": "${memberDisplayName}'s view on operational implementation and capability building (2-3 sentences max)"
    },
    "long_18_36": {
      "thinker": "${thinkerName}'s vision for 18-36 month transformation and governance (2-3 sentences max)",
      "member": "${memberDisplayName}'s approach to long-term institutionalization and measurement (2-3 sentences max)"
    }
  },
  "synthesis": "A brief summary of their collaborative insights and key tensions/synergies (3-4 sentences max)"
}

Keep responses concise, authentic to each participant's expertise, and focused on practical implementation across the three timeframes.`;

    const userPrompt = `Topic: ${topic}

Generate a structured dialogue between ${thinkerName} and ${memberDisplayName} about this topic in the ${domain} domain. Focus on their different perspectives and how they would approach implementation across 0-6, 6-18, and 18-36 month timeframes.

Make sure ${thinkerName} speaks from their core theoretical framework while ${memberDisplayName} responds from their work family archetype capabilities.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1200,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const dialogueResult = JSON.parse(data.choices[0].message.content);

    console.log(`Generated duo chat for ${thinkerName} × ${memberCode}`);

    return new Response(JSON.stringify({
      success: true,
      dialogue: dialogueResult,
      metadata: {
        thinker: thinkerName,
        member: memberCode,
        topic: topic,
        domain: domain,
        generated_at: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in duo-chat function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate duo chat',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
