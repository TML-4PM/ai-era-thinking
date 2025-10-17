import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { frameworkId } = await req.json();
    
    if (!frameworkId) {
      throw new Error('Framework ID is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch framework from database
    const { data: framework, error: fetchError } = await supabase
      .from('master_4500')
      .select('*')
      .eq('id', frameworkId)
      .single();

    if (fetchError || !framework) {
      throw new Error('Framework not found');
    }

    console.log(`Expanding framework: ${framework.title}`);

    const systemPrompt = `You are an expert at analyzing strategic frameworks across technological eras, specifically for brain-computer interface (BCI) and AI contexts.

Your task is to deeply expand a framework, tracing its evolution from on-premise computing through cloud-native, generative AI, agentic AI, and finally BCI era.

For each framework, provide:
1. Core Framework: Deep explanation of what it is and why it matters
2. AI Relevance: Why this framework is crucial for AI/BCI deployment
3. Cross-Era Evolution: Narrative of how the framework transforms across 5 technology eras
4. Era Mapping: Detailed 2-3 paragraph scenarios for each of 5 eras (on-premise, cloud-native, gen-ai, agentic-ai, bci)
5. Implementation Timeline: 3-phase practical implementation roadmap
6. Relations: Suggest related thinkers, other frameworks, and case studies

Be concrete, practical, and grounded in real-world applications. Each era scenario should paint a vivid picture of how the framework operates in that technological context.`;

    const userPrompt = `Expand the following framework:

Title: ${framework.title}
Sticker (core concept): ${framework.description}
Domain Slot: ${framework.core_framework}
Best Use: ${framework.notes}

Provide a comprehensive expansion following the structure:
1. Core Framework (2-3 paragraphs explaining what it is)
2. AI Relevance (2 paragraphs on why it matters for AI/BCI)
3. Cross-Era Evolution (3 paragraphs on transformation across eras)
4. Era Mapping (5 detailed scenarios, 2-3 paragraphs each):
   - On-Premise Era: Traditional computing context
   - Cloud-Native Era: Distributed, connected systems
   - Generative AI Era: LLM and content generation integration
   - Agentic AI Era: Autonomous agent systems
   - BCI Era: Brain-computer interface context
5. Implementation (3 phases):
   - Phase 1: Foundation (initial steps)
   - Phase 2: Integration (scaling up)
   - Phase 3: Transformation (full adoption)
6. Relations:
   - Related Thinkers: List 3-5 key thought leaders
   - Related Frameworks: List 3-5 complementary frameworks
   - Case Studies: List 3-5 real-world applications

Return ONLY valid JSON in this exact structure:
{
  "coreFramework": "string",
  "aiRelevance": "string",
  "crossEraEvolution": "string",
  "eraMapping": {
    "onPrem": "string",
    "cloudNative": "string",
    "genAI": "string",
    "agenticAI": "string",
    "bci": "string"
  },
  "implementation": {
    "phase1": "string",
    "phase2": "string",
    "phase3": "string"
  },
  "relatedThinkers": ["string"],
  "relatedFrameworks": ["string"],
  "caseStudies": ["string"]
}`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    let expansion;
    try {
      expansion = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Update framework in database
    const { error: updateError } = await supabase
      .from('master_4500')
      .update({
        core_framework: expansion.coreFramework,
        ai_relevance: expansion.aiRelevance,
        cross_era_evolution: expansion.crossEraEvolution,
        era_on_prem: expansion.eraMapping.onPrem,
        era_cloud_native: expansion.eraMapping.cloudNative,
        era_gen_ai: expansion.eraMapping.genAI,
        era_agentic_ai: expansion.eraMapping.agenticAI,
        era_bci: expansion.eraMapping.bci,
        implementation_phase1: expansion.implementation.phase1,
        implementation_phase2: expansion.implementation.phase2,
        implementation_phase3: expansion.implementation.phase3,
        related_thinkers: expansion.relatedThinkers,
        related_frameworks: expansion.relatedFrameworks,
        case_studies: expansion.caseStudies,
        status: 'seeded',
        progress: 100,
        updated_at: new Date().toISOString(),
      })
      .eq('id', frameworkId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    console.log(`Successfully expanded framework: ${framework.title}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        framework: framework.title,
        expansion 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in expand-framework:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});