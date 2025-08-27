import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileBuildRequest {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
  lobe: string;
  industries?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const {
      thinkerName,
      thinkerArea,
      coreIdea,
      aiShift,
      lobe,
      industries = []
    }: ProfileBuildRequest = await req.json();

    console.log(`Building deep profile for ${thinkerName} (${thinkerArea})`);

    // Map lobe to domains
    const getDomainsForLobe = (lobe: string): string[] => {
      switch (lobe) {
        case "Perception/Patterning": return ["Data & Analytics", "AI/ML Strategy"];
        case "Decision/Action": return ["Operations", "Process Optimization"];
        case "Innovation/Strategy": return ["Strategic Planning", "Innovation Management"];
        case "Ethics/Governance": return ["Governance", "Risk Management"];
        case "Culture/Behaviour": return ["Change Management", "Organizational Development"];
        default: return ["Strategic Planning"];
      }
    };

    const domains = getDomainsForLobe(lobe);
    const industryContext = industries.length > 0 ? `
Context Industries: ${industries.join(', ')}
Focus the profile on applications within these specific industries.` : '';

    const profilePrompt = `You are creating a comprehensive AI-era profile for ${thinkerName}, an influential thinker in ${thinkerArea}.

THINKER FOUNDATION:
- Core Idea: ${coreIdea}
- AI-Era Shift: ${aiShift}
- Primary Lobe: ${lobe}
- Relevant Domains: ${domains.join(', ')}
${industryContext}

TASK: Create a rich, detailed profile that captures how ${thinkerName}'s work translates into the AI era. This should be deep, nuanced, and practical.

Generate the following structured profile sections:

1. AI_RELEVANCE: How their core ideas transform in the age of AI agents and automation (3-4 detailed sentences)

2. USAGE_PROMPTS: 5 specific, actionable prompts that practitioners can use to apply ${thinkerName}'s thinking to modern AI/automation challenges

3. RELATED_THINKERS: 4-5 other influential thinkers whose work either complements or contrasts with ${thinkerName}'s approach (with brief rationale for each)

4. PRACTICAL_APPLICATIONS: 6-8 concrete, modern applications of their thinking in AI-era organizations

5. CROSS_ERA_RELEVANCE: How their ideas bridge different time periods and remain relevant (2-3 sentences)

6. IMPLEMENTATION_TIMELINE: A 3-phase timeline for implementing their thinking in modern organizations

Make this profile rich, insightful, and immediately useful for modern leaders and practitioners.

Respond ONLY in this JSON format:
{
  "ai_relevance": "detailed explanation...",
  "usage_prompts": ["prompt 1", "prompt 2", "prompt 3", "prompt 4", "prompt 5"],
  "related_thinkers": ["thinker 1: rationale", "thinker 2: rationale", "thinker 3: rationale", "thinker 4: rationale"],
  "practical_applications": ["application 1", "application 2", "application 3", "application 4", "application 5", "application 6"],
  "cross_era_relevance": "explanation of timeless relevance...",
  "implementation_timeline": {
    "phase_1": "30-60 days: foundational steps...",
    "phase_2": "60-120 days: development phase...",
    "phase_3": "120+ days: optimization and scaling..."
  }
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
            content: 'You are an expert in intellectual history, organizational psychology, and AI transformation. You excel at translating classical thinking into modern, actionable frameworks for the AI era.'
          },
          { role: 'user', content: profilePrompt }
        ],
        max_completion_tokens: 3000
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`);
    }

    const aiResult = await openAIResponse.json();
    const aiContent = aiResult.choices[0].message.content;
    
    console.log('AI Profile Response received');

    let profileData;
    try {
      // Clean the response to handle potential markdown formatting
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      profileData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error(`Invalid AI response format: ${parseError.message}`);
    }

    // Store the expanded profile
    const { data: existingProfile } = await supabase
      .from('expanded_thinker_profiles')
      .select('id')
      .eq('thinker_name', thinkerName)
      .single();

    const profileRecord = {
      thinker_name: thinkerName,
      thinker_area: thinkerArea,
      core_idea: coreIdea,
      ai_shift: aiShift,
      lobe: lobe,
      ai_relevance: profileData.ai_relevance,
      usage_prompts: profileData.usage_prompts,
      related_thinkers: profileData.related_thinkers,
      practical_applications: profileData.practical_applications,
      cross_era_relevance: profileData.cross_era_relevance,
      implementation_timeline: profileData.implementation_timeline,
      industries: industries,
      processing_metadata: {
        model_used: 'gpt-5-2025-08-07',
        processing_time_ms: Date.now() - startTime,
        domains_considered: domains
      }
    };

    if (existingProfile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('expanded_thinker_profiles')
        .update(profileRecord)
        .eq('id', existingProfile.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      console.log(`Updated profile for ${thinkerName}`);

      return new Response(JSON.stringify({
        success: true,
        profile: updatedProfile,
        message: `Successfully updated deep profile for ${thinkerName}`,
        processing_time: `${Date.now() - startTime}ms`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      const { data: newProfile, error: insertError } = await supabase
        .from('expanded_thinker_profiles')
        .insert(profileRecord)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create profile: ${insertError.message}`);
      }

      console.log(`Created new profile for ${thinkerName}`);

      return new Response(JSON.stringify({
        success: true,
        profile: newProfile,
        message: `Successfully created deep profile for ${thinkerName}`,
        processing_time: `${Date.now() - startTime}ms`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in build-thinker-profile function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      processing_time: `${Date.now() - startTime}ms`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});