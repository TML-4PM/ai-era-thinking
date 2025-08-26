
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface AlignmentRequest {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
  domain: string;
  existingInsights?: any;
}

interface FamilyAlignment {
  family_code: string;
  family_name: string;
  confidence: number;
  rationale: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thinkerName, thinkerArea, coreIdea, aiShift, domain, existingInsights }: AlignmentRequest = await req.json();

    if (!thinkerName || !domain) {
      throw new Error('thinkerName and domain are required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch Neural Ennead families
    const { data: families, error: familiesError } = await supabaseClient
      .from('neural_ennead_families')
      .select('family_code, family_name, description, exemplar_roles, canonical_keywords');

    if (familiesError) {
      throw new Error(`Failed to fetch families: ${familiesError.message}`);
    }

    // Stage 1: Deterministic pre-scoring based on keyword overlap
    const familyScores = families.map(family => {
      const thinkerText = `${thinkerName} ${thinkerArea} ${coreIdea} ${aiShift} ${domain}`.toLowerCase();
      const keywords = family.canonical_keywords || [];
      
      let score = 0;
      keywords.forEach(keyword => {
        if (thinkerText.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      return {
        ...family,
        pre_score: score / Math.max(keywords.length, 1) // Normalized score
      };
    }).sort((a, b) => b.pre_score - a.pre_score);

    // Stage 2: GPT-4.1 refinement for top candidates
    const topCandidates = familyScores.slice(0, 5); // Top 5 candidates
    
    const alignmentPrompt = `You are an expert at mapping business thinkers to Neural Ennead work family archetypes.

THINKER PROFILE:
- Name: ${thinkerName}
- Area: ${thinkerArea}
- Core Idea: ${coreIdea}
- AI Shift: ${aiShift}
- Application Domain: ${domain}

NEURAL ENNEAD FAMILIES (Top candidates based on keyword analysis):
${topCandidates.map(f => `
${f.family_code}: ${f.family_name}
Description: ${f.description}
Exemplar Roles: ${f.exemplar_roles?.join(', ')}
Pre-score: ${f.pre_score.toFixed(2)}
`).join('\n')}

TASK: 
Analyze this thinker's work and determine their TOP 2 Neural Ennead family alignments for the specified domain.

Consider:
1. The thinker's core intellectual contribution
2. How their ideas apply to the specific domain
3. What work family archetype would most benefit from their insights
4. The practical role types that would implement their frameworks

Return ONLY a JSON object with this exact structure:
{
  "alignments": [
    {
      "family_code": "CODE",
      "confidence": 0.95,
      "rationale": "Detailed explanation of why this thinker aligns with this family"
    },
    {
      "family_code": "CODE2", 
      "confidence": 0.75,
      "rationale": "Explanation for second alignment"
    }
  ]
}

Confidence should be 0.0-1.0. Focus on practical application over theoretical similarity.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert business analyst who maps intellectual frameworks to practical work roles. Return only valid JSON.' },
          { role: 'user', content: alignmentPrompt }
        ],
        max_completion_tokens: 800,
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

    // Store alignments in database
    const alignmentsToStore = alignmentResult.alignments.slice(0, 2).map((alignment: any, index: number) => ({
      thinker_name: thinkerName,
      domain: domain,
      family_code: alignment.family_code,
      rank: index + 1,
      confidence: Math.min(Math.max(alignment.confidence || 0, 0), 1),
      rationale: alignment.rationale || '',
      model_used: 'gpt-4.1-2025-04-14',
      metadata: {
        thinker_area: thinkerArea,
        core_idea: coreIdea,
        ai_shift: aiShift,
        pre_scores: familyScores.reduce((acc, f) => ({ ...acc, [f.family_code]: f.pre_score }), {}),
        processing_timestamp: new Date().toISOString()
      }
    }));

    // Upsert alignments
    for (const alignment of alignmentsToStore) {
      const { error: upsertError } = await supabaseClient
        .from('thinker_family_alignment')
        .upsert(alignment, {
          onConflict: 'thinker_name,domain,rank',
          ignoreDuplicates: false
        });
      
      if (upsertError) {
        console.error('Error storing alignment:', upsertError);
      }
    }

    // Enrich response with family details
    const enrichedAlignments = alignmentResult.alignments.map((alignment: any) => {
      const family = families.find(f => f.family_code === alignment.family_code);
      return {
        ...alignment,
        family_name: family?.family_name || 'Unknown Family',
        description: family?.description || '',
        exemplar_roles: family?.exemplar_roles || []
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        thinker_name: thinkerName,
        domain: domain,
        alignments: enrichedAlignments,
        metadata: {
          model_used: 'gpt-4.1-2025-04-14',
          processing_time: new Date().toISOString(),
          pre_screening_candidates: topCandidates.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in align-workfamily function:', error);
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
