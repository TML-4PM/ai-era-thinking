
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TeamBuildRequest {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
  domain: string;
  industries?: string[];
  teamSize?: number;
  excludeMemberCodes?: string[];
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

    const {
      thinkerName,
      thinkerArea,
      coreIdea,
      aiShift,
      domain,
      industries = [],
      teamSize = 9,
      excludeMemberCodes = []
    }: TeamBuildRequest = await req.json();

    console.log(`Building team for ${thinkerName} in ${domain} domain`);

    // 1. Get all available Neural Ennead members with their details
    const { data: allMembers, error: membersError } = await supabase
      .from('neural_ennead_members')
      .select(`
        member_code,
        display_name,
        description,
        exemplar_roles,
        primary_family_code,
        secondary_family_code,
        tertiary_family_code,
        canonical_keywords
      `);

    if (membersError || !allMembers) {
      throw new Error(`Failed to fetch members: ${membersError?.message}`);
    }

    // 2. Check existing team usage to enforce 25% overlap cap
    const { data: existingUsage } = await supabase
      .from('thinker_alignment_team_members')
      .select('member_code')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    const usageCounts = existingUsage?.reduce((acc, { member_code }) => {
      acc[member_code] = (acc[member_code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Count total teams built in last 30 days, not max usage per member
    const totalTeamsBuilt = new Set(existingUsage?.map(usage => usage.team_id) || []).size;
    const maxUsagePerMember = Math.max(1, Math.ceil(totalTeamsBuilt * 0.25)); // Never allow 0

    // 3. Filter available members (those under usage cap and not in exclude list)
    const availableMembers = allMembers.filter(member => {
      // Check if member is in exclude list (batch-aware cap)
      if (excludeMemberCodes.includes(member.member_code)) {
        return false;
      }
      // Check traditional usage cap
      return (usageCounts[member.member_code] || 0) < maxUsagePerMember;
    });

    console.log(`Available members after usage filter: ${availableMembers.length}/${allMembers.length}`);

    // 4. Use AI to select and create narratives for team members
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const industryContext = industries.length > 0 ? `
Context Industries: ${industries.join(', ')}
Focus the team selection and narratives on how these members would help ${thinkerName} address challenges and opportunities in these specific industries.` : '';

    const teamSelectionPrompt = `You are assembling a dream team of 9 Neural Ennead WorkFamily members to help ${thinkerName} (${thinkerArea}) explore and apply their framework in the ${domain} domain.

THINKER CONTEXT:
- Core Idea: ${coreIdea}
- AI-Era Shift: ${aiShift}
${industryContext}

AVAILABLE TEAM MEMBERS:
${availableMembers.map(member => 
    `${member.member_code}: ${member.display_name}
   Description: ${member.description}
   Primary Family: ${member.primary_family_code} | Secondary: ${member.secondary_family_code || 'N/A'}
   Keywords: ${member.canonical_keywords?.join(', ') || 'N/A'}
   Exemplar Roles: ${member.exemplar_roles?.join(', ') || 'N/A'}`
).join('\n\n')}

TASK: Select exactly ${teamSize} members who would form the most effective team to help ${thinkerName} explore, debate, and apply their ideas in ${domain}. 

For each selected member, provide:
1. Their MEMBER_CODE
2. A compelling ROLE_ON_TEAM (e.g., "Strategic Systems Analyst", "Implementation Catalyst", "Ethical Oversight Lead")
3. A rich RATIONALE explaining why this specific member is essential for ${thinkerName}'s work, drawing on their Neural Ennead profile and how they complement the thinker's approach
4. A CONTRIBUTION_FOCUS describing their specific contribution timeframe or area

Think like you're assembling a real consulting team - consider diverse perspectives, complementary skills, and how they'd work together to maximize ${thinkerName}'s impact.

Respond ONLY in this JSON format:
{
  "selected_team": [
    {
      "member_code": "MEMBER_CODE",
      "role_on_team": "Role Title",
      "rationale": "Detailed explanation of why this member is perfect for ${thinkerName}'s work...",
      "contribution_focus": "Specific area or timeframe of contribution"
    }
  ]
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
            content: 'You are an expert in organizational psychology and team dynamics, specializing in assembling high-performing interdisciplinary teams. You understand Neural Ennead frameworks and how different cognitive profiles complement each other.'
          },
          { role: 'user', content: teamSelectionPrompt }
        ],
        max_completion_tokens: 4000
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const aiResult = await openAIResponse.json();
    const aiContent = aiResult.choices[0].message.content;
    
    console.log('AI Response:', aiContent);

    let teamData;
    try {
      // Clean the response to handle potential markdown formatting
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      teamData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error(`Invalid AI response format: ${parseError.message}`);
    }

    // 5. Validate selected members exist and create team record
    const selectedMemberCodes = teamData.selected_team.map(member => member.member_code);
    const validMembers = allMembers.filter(member => 
      selectedMemberCodes.includes(member.member_code)
    );

    if (validMembers.length < teamSize) {
      console.warn(`Only ${validMembers.length} of ${teamSize} selected members are valid`);
    }

    // 6. Insert team record
    const { data: teamRecord, error: teamError } = await supabase
      .from('thinker_alignment_teams')
      .insert({
        thinker_name: thinkerName,
        domain: domain,
        team_size: validMembers.length,
        industries: industries,
        overlap_cap: 0.25,
        selection_strategy: 'AI-powered team assembly based on Neural Ennead cognitive profiles and domain expertise',
        model_used: 'gpt-5-2025-08-07',
        constraints: {
          requested_size: teamSize,
          available_pool: availableMembers.length,
          usage_filtered: allMembers.length - availableMembers.length
        }
      })
      .select()
      .single();

    if (teamError || !teamRecord) {
      throw new Error(`Failed to create team record: ${teamError?.message}`);
    }

    console.log(`Created team record: ${teamRecord.id}`);

    // 7. Insert team members with AI-generated narratives
    const teamMembersData = teamData.selected_team
      .filter(aiMember => validMembers.find(vm => vm.member_code === aiMember.member_code))
      .map((aiMember, index) => ({
        team_id: teamRecord.id,
        member_code: aiMember.member_code,
        order_index: index + 1,
        role_on_team: aiMember.role_on_team,
        rationale: aiMember.rationale,
        contribution_focus: aiMember.contribution_focus,
        metadata: {
          ai_generated: true,
          selection_confidence: 'high'
        }
      }));

    const { error: membersInsertError } = await supabase
      .from('thinker_alignment_team_members')
      .insert(teamMembersData);

    if (membersInsertError) {
      throw new Error(`Failed to insert team members: ${membersInsertError.message}`);
    }

    console.log(`Inserted ${teamMembersData.length} team members`);

    // 8. Return complete team data
    const { data: completeTeam } = await supabase
      .from('thinker_alignment_teams')
      .select(`
        *,
        thinker_alignment_team_members (
          member_code,
          order_index,
          role_on_team,
          rationale,
          contribution_focus,
          neural_ennead_members (
            display_name,
            description,
            exemplar_roles,
            primary_family_code,
            secondary_family_code,
            tertiary_family_code,
            canonical_keywords
          )
        )
      `)
      .eq('id', teamRecord.id)
      .single();

    return new Response(JSON.stringify({
      success: true,
      team: completeTeam,
      message: `Successfully assembled ${validMembers.length}-member team for ${thinkerName} in ${domain}`,
      processing_time: `${Date.now() - startTime}ms`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in build-thinker-team function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
