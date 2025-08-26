
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Neural Ennead family definitions based on the provided documents
    const neuralEnneadFamilies = [
      {
        family_code: 'ORACLE',
        family_name: 'Oracle (Strategic Visionary)',
        description: 'Strategic vision, foresight, and long-term planning. Guides organizational direction and identifies future opportunities.',
        exemplar_roles: ['Chief Strategy Officer', 'Business Analyst', 'Strategic Planner', 'Innovation Director'],
        canonical_keywords: ['strategy', 'vision', 'foresight', 'planning', 'innovation', 'futures', 'disruption', 'transformation']
      },
      {
        family_code: 'GUARDIAN',
        family_name: 'Guardian (Risk & Compliance Manager)',
        description: 'Risk management, compliance, governance, and organizational protection. Ensures safety and regulatory adherence.',
        exemplar_roles: ['Risk Manager', 'Compliance Officer', 'Security Analyst', 'Quality Assurance Manager'],
        canonical_keywords: ['risk', 'compliance', 'governance', 'security', 'audit', 'control', 'regulation', 'safety']
      },
      {
        family_code: 'ARCHITECT',
        family_name: 'Architect (Systems Designer)',
        description: 'Systems design, architecture, and technical infrastructure. Creates scalable and robust technological solutions.',
        exemplar_roles: ['Solution Architect', 'Enterprise Architect', 'Technical Lead', 'Systems Designer'],
        canonical_keywords: ['architecture', 'design', 'systems', 'infrastructure', 'scalability', 'integration', 'technical', 'platform']
      },
      {
        family_code: 'CATALYST',
        family_name: 'Catalyst (Change Agent)',
        description: 'Change management, transformation leadership, and organizational development. Drives adoption and cultural shifts.',
        exemplar_roles: ['Change Manager', 'Transformation Lead', 'Organizational Development Specialist', 'Culture Manager'],
        canonical_keywords: ['change', 'transformation', 'adoption', 'culture', 'leadership', 'development', 'engagement', 'coaching']
      },
      {
        family_code: 'NAVIGATOR',
        family_name: 'Navigator (Project Coordinator)',
        description: 'Project management, coordination, and delivery execution. Ensures projects are delivered on time and within scope.',
        exemplar_roles: ['Project Manager', 'Program Manager', 'Delivery Manager', 'Scrum Master'],
        canonical_keywords: ['project', 'delivery', 'coordination', 'execution', 'management', 'agile', 'milestone', 'stakeholder']
      },
      {
        family_code: 'SYNTHESIZER',
        family_name: 'Synthesizer (Data Analyst)',
        description: 'Data analysis, insights generation, and information synthesis. Transforms raw data into actionable intelligence.',
        exemplar_roles: ['Data Analyst', 'Business Intelligence Analyst', 'Research Analyst', 'Data Scientist'],
        canonical_keywords: ['data', 'analysis', 'insights', 'intelligence', 'research', 'metrics', 'reporting', 'analytics']
      },
      {
        family_code: 'CONNECTOR',
        family_name: 'Connector (Relationship Manager)',
        description: 'Stakeholder management, communication, and relationship building. Facilitates collaboration and alignment.',
        exemplar_roles: ['Stakeholder Manager', 'Communications Manager', 'Account Manager', 'Partnership Manager'],
        canonical_keywords: ['stakeholder', 'communication', 'relationship', 'collaboration', 'partnership', 'engagement', 'alignment', 'facilitation']
      },
      {
        family_code: 'OPTIMIZER',
        family_name: 'Optimizer (Process Improver)',
        description: 'Process optimization, efficiency improvement, and operational excellence. Streamlines workflows and reduces waste.',
        exemplar_roles: ['Process Analyst', 'Business Process Manager', 'Operations Manager', 'Continuous Improvement Specialist'],
        canonical_keywords: ['process', 'optimization', 'efficiency', 'improvement', 'operations', 'workflow', 'lean', 'automation']
      },
      {
        family_code: 'CREATOR',
        family_name: 'Creator (Content Developer)',
        description: 'Content creation, design, and creative development. Produces materials, documentation, and creative solutions.',
        exemplar_roles: ['Content Creator', 'Technical Writer', 'Designer', 'Developer'],
        canonical_keywords: ['content', 'creation', 'design', 'development', 'documentation', 'creative', 'production', 'materials']
      }
    ];

    // Insert families with upsert logic
    for (const family of neuralEnneadFamilies) {
      const { error } = await supabaseClient
        .from('neural_ennead_families')
        .upsert(family, { 
          onConflict: 'family_code',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`Error inserting family ${family.family_code}:`, error);
      } else {
        console.log(`Successfully seeded family: ${family.family_name}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Neural Ennead families seeded successfully',
        families_count: neuralEnneadFamilies.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in seed-neural-ennead function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
