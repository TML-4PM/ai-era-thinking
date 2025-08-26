
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface MemberAlignmentRequest {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
  domain: string;
  petTopic?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thinkerName, thinkerArea, coreIdea, aiShift, domain, petTopic }: MemberAlignmentRequest = await req.json();

    if (!thinkerName || !domain) {
      throw new Error('thinkerName and domain are required');
    }

    console.log(`Aligning ${thinkerName} to Neural Ennead members for domain: ${domain}`);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all 729 Neural Ennead members
    const { data: members, error: membersError } = await supabaseClient
      .from('neural_ennead_members')
      .select(`
        member_code, 
        display_name, 
        description, 
        canonical_keywords, 
        exemplar_roles,
        primary_family_code,
        secondary_family_code,
        tertiary_family_code
      `);

    if (membersError) {
      throw new Error(`Failed to fetch members: ${membersError.message}`);
    }

    console.log(`Found ${members?.length || 0} members for alignment`);

    // Stage 1: Deterministic pre-scoring based on weighted keyword overlap
    const thinkerText = `${thinkerName} ${thinkerArea} ${coreIdea} ${aiShift} ${domain} ${petTopic || ''}`.toLowerCase();
    
    const memberScores = members.map(member => {
      const keywords = member.canonical_keywords || [];
      let totalScore = 0;
      let totalWeight = 0;

      // Weight keywords by family position: primary (0.6), secondary (0.3), tertiary (0.1)
      keywords.forEach(keyword => {
        if (thinkerText.includes(keyword.toLowerCase())) {
          // Simple heuristic: assume first third are from primary, second third from secondary, etc.
          const keywordIndex = keywords.indexOf(keyword);
          const keywordWeight = keywordIndex < keywords.length / 3 ? 0.6 : 
                               keywordIndex < (keywords.length * 2) / 3 ? 0.3 : 0.1;
          totalScore += keywordWeight;
        }
        totalWeight += 0.1; // Base weight for having the keyword
      });
      
      return {
        ...member,
        pre_score: totalWeight > 0 ? totalScore / totalWeight : 0
      };
    }).sort((a, b) => b.pre_score - a.pre_score);

    // Stage 2: GPT-4.1 refinement for top candidates (limit to top 30 to manage tokens)
    const topCandidates = memberScores.slice(0, 30).filter(m => m.pre_score > 0);
    
    if (topCandidates.length === 0) {
      // Fallback: take top 10 even with zero pre-score
      topCandidates.push(...memberScores.slice(0, 10));
    }

    console.log(`Pre-scoring complete. Top candidate: ${topCandidates[0]?.member_code} (score: ${topCandidates[0]?.pre_score})`);

    const alignmentPrompt = `You are an expert at mapping business thinkers to Neural Ennead work family member archetypes with timeframe-specific implementation guidance.

THINKER PROFILE:
- Name: ${thinkerName}
- Area: ${thinkerArea}
- Core Idea: ${coreIdea}
- AI Shift: ${aiShift}
- Application Domain: ${domain}
${petTopic ? `- Pet Topic: ${petTopic}` : ''}

NEURAL ENNEAD MEMBERS (Top candidates based on keyword analysis):
${topCandidates.slice(0, 15).map(m => `
${m.member_code}: ${m.display_name}
Description: ${m.description}
Exemplar Roles: ${m.exemplar_roles?.slice(0, 3).join(', ')}
Pre-score: ${m.pre_score.toFixed(3)}
`).join('\n')}

TASK: 
Analyze this thinker's work and determine their TOP 2 Neural Ennead member alignments for the specified domain, with specific timeframe transitions.

Consider:
1. The thinker's core intellectual contribution and how it maps to the member's triple archetype
2. The practical implementation path in the specified domain
3. Specific transitions across timeframes: 0-6 months (pilots/quick wins), 6-18 months (scale/integration), 18-36 months (transformation/governance)

Return ONLY a JSON object with this exact structure:
{
  "alignments": [
    {
      "member_code": "CODE",
      "confidence": 0.95,
      "rationale": "Detailed explanation of why this thinker aligns with this member combination",
      "transitions": {
        "now_0_6": "Specific actions and deliverables for 0-6 month timeframe",
        "mid_6_18": "Integration and scaling activities for 6-18 month timeframe", 
        "long_18_36": "Transformation and governance focus for 18-36 month timeframe"
      }
    },
    {
      "member_code": "CODE2",
      "confidence": 0.75,
      "rationale": "Explanation for second alignment",
      "transitions": {
        "now_0_6": "Alternative 0-6 month approach",
        "mid_6_18": "Alternative 6-18 month path",
        "long_18_36": "Alternative long-term vision"
      }
    }
  ]
}

Focus on practical implementation and specific deliverables for each timeframe. Confidence should be 0.0-1.0.`;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are an expert organizational analyst who maps intellectual frameworks to work family archetypes with timeframe-specific guidance. Return only valid JSON.' },
          { role: 'user', content: alignmentPrompt }
        ],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIResult = await openAIResponse.json();
    const alignmentResult = JSON.parse(openAIResult.choices[0].message.content);
    
    if (!alignmentResult.alignments || !Array.isArray(alignmentResult.alignments)) {
      throw new Error('Invalid alignment result structure');
    }

    console.log(`GPT-4 returned ${alignmentResult.alignments.length} alignments`);

    // Store alignments in database
    const alignmentsToStore = alignmentResult.alignments.slice(0, 2).map((alignment: any, index: number) => ({
      thinker_name: thinkerName,
      domain: domain,
      member_code: alignment.member_code,
      rank: index + 1,
      confidence: Math.min(Math.max(alignment.confidence || 0, 0), 1),
      rationale: alignment.rationale || '',
      transitions: alignment.transitions || {},
      model_used: 'gpt-4-turbo-preview',
      metadata: {
        thinker_area: thinkerArea,
        core_idea: coreIdea,
        ai_shift: aiShift,
        pet_topic: petTopic,
        pre_scores: topCandidates.slice(0, 10).reduce((acc, m) => ({ ...acc, [m.member_code]: m.pre_score }), {}),
        processing_timestamp: new Date().toISOString()
      }
    }));

    // Upsert alignments
    for (const alignment of alignmentsToStore) {
      const { error: upsertError } = await supabaseClient
        .from('thinker_member_alignment')
        .upsert(alignment, {
          onConflict: 'thinker_name,domain,rank',
          ignoreDuplicates: false
        });
      
      if (upsertError) {
        console.error('Error storing alignment:', upsertError);
      }
    }

    // Enrich response with member details
    const enrichedAlignments = alignmentResult.alignments.map((alignment: any) => {
      const member = members.find(m => m.member_code === alignment.member_code);
      return {
        ...alignment,
        display_name: member?.display_name || 'Unknown Member',
        description: member?.description || '',
        exemplar_roles: member?.exemplar_roles || []
      };
    });

    console.log(`Successfully aligned ${thinkerName} to ${enrichedAlignments.length} members`);

    return new Response(
      JSON.stringify({
        success: true,
        thinker_name: thinkerName,
        domain: domain,
        alignments: enrichedAlignments,
        metadata: {
          model_used: 'gpt-4-turbo-preview',
          processing_time: new Date().toISOString(),
          pre_screening_candidates: topCandidates.length,
          total_members_evaluated: members.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in align-workfamily-members function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
