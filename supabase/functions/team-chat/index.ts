import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TeamChatRequest {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
  topic?: string;
  domain: string;
  industries?: string[];
  assignedTeam: {
    member_code: string;
    display_name: string;
    description: string;
    role_on_team: string;
    rationale: string;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      thinkerName,
      thinkerArea,
      coreIdea,
      aiShift,
      topic,
      domain,
      industries = [],
      assignedTeam
    }: TeamChatRequest = await req.json();

    console.log(`Generating team chat for ${thinkerName} with ${assignedTeam.length} team members`);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const industryContext = industries.length > 0 ? 
      `Focus the conversation on challenges and opportunities in: ${industries.join(', ')}` : '';

    const teamMembersList = assignedTeam.map(member => 
      `${member.display_name} (${member.role_on_team}): ${member.description}`
    ).join('\n');

    const systemPrompt = `You are facilitating a structured team conversation between ${thinkerName} and their assembled WorkFamily team. 

THINKER PROFILE:
- Name: ${thinkerName}
- Area: ${thinkerArea}
- Core Idea: ${coreIdea}
- AI-Era Shift: ${aiShift}

TEAM MEMBERS:
${teamMembersList}

CONVERSATION TOPIC: ${topic || coreIdea}
DOMAIN: ${domain}
${industryContext}

Generate a structured multi-participant conversation across three timeframes where each participant contributes meaningfully. Each participant should speak from their expertise and role perspective.

The conversation should feel natural but purposeful, with each team member bringing their unique perspective to help ${thinkerName} explore and apply their framework.

Respond in this exact JSON format:
{
  "topic": "${topic || coreIdea}",
  "participants": ["${thinkerName}", ${assignedTeam.map(m => `"${m.display_name}"`).join(', ')}],
  "timeframes": {
    "now_0_6": {
      "${thinkerName}": "Thinker's immediate perspective on the topic",
      ${assignedTeam.map(m => `"${m.display_name}": "Member's immediate contribution based on their role: ${m.role_on_team}"`).join(',\n      ')}
    },
    "mid_6_18": {
      "${thinkerName}": "Thinker's medium-term perspective",
      ${assignedTeam.map(m => `"${m.display_name}": "Member's medium-term strategic input"`).join(',\n      ')}
    },
    "long_18_36": {
      "${thinkerName}": "Thinker's long-term vision",
      ${assignedTeam.map(m => `"${m.display_name}": "Member's long-term strategic contribution"`).join(',\n      ')}
    }
  },
  "synthesis": "Summary of key tensions, synergies, and next steps from the team conversation"
}`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert facilitator who creates engaging multi-participant conversations that explore complex ideas across timeframes. Return only valid JSON.'
          },
          { role: 'user', content: systemPrompt }
        ],
        max_completion_tokens: 4000
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`);
    }

    const aiResult = await openAIResponse.json();
    const aiContent = aiResult.choices[0].message.content;

    let teamDialogue;
    try {
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      teamDialogue = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error(`Invalid AI response format: ${parseError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      dialogue: teamDialogue
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in team-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});