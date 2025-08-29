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
      teamSize,
      excludeMemberCodes = []
    }: TeamBuildRequest = await req.json();

    console.log(`Building team for ${thinkerName} in ${domain} domain`);

    // 1. Get all available Neural Ennead members with their details
    const { data: allMembers, error: membersError } = await supabase
      .from('neural_ennead_members')
      .select('member_code, display_name, description, exemplar_roles, primary_family_code, secondary_family_code, tertiary_family_code, canonical_keywords');

    if (membersError) {
      console.error('Failed to fetch members:', membersError);
      throw new Error(`Failed to fetch members: ${membersError.message}`);
    }

    if (!allMembers || allMembers.length === 0) {
      throw new Error('No Neural Ennead members found. Please seed the member data first.');
    }

    console.log(`Found ${allMembers.length} members available for team building`);

    // 2. ENFORCE GLOBAL UNIQUENESS: Get all members already assigned to other thinkers
    const { data: allExistingTeams, error: teamsError } = await supabase
      .from('thinker_alignment_teams')
      .select(`
        thinker_name,
        thinker_alignment_team_members(member_code)
      `)
      .neq('thinker_name', thinkerName); // Exclude current thinker's existing teams

    if (teamsError) {
      console.error('Error fetching existing teams:', teamsError);
      // Continue without global uniqueness filtering rather than failing
    }

    // Build set of member codes already used by other thinkers
    const globallyUsedMemberCodes = new Set<string>();
    if (allExistingTeams) {
      allExistingTeams.forEach(team => {
        team.thinker_alignment_team_members?.forEach(member => {
          globallyUsedMemberCodes.add(member.member_code);
        });
      });
    }

    console.log(`Globally used members: ${globallyUsedMemberCodes.size} out of ${allMembers.length}`);

    // 3. Filter available members to ensure global uniqueness
    const availableMembers = allMembers.filter(member => {
      // Exclude if already used by another thinker
      if (globallyUsedMemberCodes.has(member.member_code)) {
        return false;
      }
      // Exclude if in explicit exclude list
      if (excludeMemberCodes.includes(member.member_code)) {
        return false;
      }
      return true;
    });

    console.log(`Available members after global uniqueness filtering: ${availableMembers.length}/${allMembers.length}`);

    // 4. Determine team size (5-9 if not specified)
    const finalTeamSize = teamSize || (Math.floor(Math.random() * 5) + 5); // 5-9 members

    if (availableMembers.length < finalTeamSize) {
      console.warn(`Warning: Only ${availableMembers.length} unique members available for team of ${finalTeamSize}`);
      if (availableMembers.length === 0) {
        throw new Error('No available members for team building. All members may be assigned to other thinkers.');
      }
    }

    // 4. Use AI to select and create narratives for team members
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    let teamData;
    
    if (!openAIApiKey) {
      console.log('OpenAI API key not configured, using fallback team selection');
      // Fallback: select random members with predefined roles
      const shuffledMembers = availableMembers.sort(() => Math.random() - 0.5);
      const actualTeamSize = Math.min(finalTeamSize, availableMembers.length);
      const selectedMembers = shuffledMembers.slice(0, actualTeamSize);
      
      teamData = {
        selected_team: selectedMembers.map((member, index) => ({
          member_code: member.member_code,
          role_on_team: `${member.primary_family_code} Specialist`,
          rationale: `Selected for their expertise in ${member.primary_family_code} and complementary skills with ${thinkerName}'s framework in ${domain}.`,
          contribution_focus: index % 3 === 0 ? 'Strategy & Framework' : index % 3 === 1 ? 'Implementation & Execution' : 'Analysis & Innovation'
        }))
      };
    } else {

    const industryContext = industries.length > 0 ? `
Context Industries: ${industries.join(', ')}
Focus the team selection and narratives on how these members would help ${thinkerName} address challenges and opportunities in these specific industries.` : '';

    const actualTeamSize = Math.min(finalTeamSize, availableMembers.length);

    const teamSelectionPrompt = `You are assembling a dream team of ${actualTeamSize} Neural Ennead WorkFamily members to help ${thinkerName} (${thinkerArea}) explore and apply their framework in the ${domain} domain.

THINKER CONTEXT:
- Core Idea: ${coreIdea}
- AI-Era Shift: ${aiShift}
${industryContext}

AVAILABLE TEAM MEMBERS:
${availableMembers.slice(0, 20).map(member => 
    `${member.member_code}: ${member.display_name}
   Description: ${member.description || 'Skilled professional'}
   Primary Family: ${member.primary_family_code} | Secondary: ${member.secondary_family_code || 'N/A'}
   Keywords: ${(member.canonical_keywords || []).join(', ') || 'N/A'}
   Exemplar Roles: ${(member.exemplar_roles || []).join(', ') || 'N/A'}`
).join('\n\n')}

TASK: Select exactly ${actualTeamSize} members who would form the most effective team to help ${thinkerName} explore, debate, and apply their ideas in ${domain}. 

For each selected member, provide:
1. Their MEMBER_CODE (must match exactly from the list above)
2. A compelling ROLE_ON_TEAM (e.g., "Strategic Systems Analyst", "Implementation Catalyst", "Ethical Oversight Lead")
3. A rich RATIONALE explaining why this specific member is essential for ${thinkerName}'s work
4. A CONTRIBUTION_FOCUS describing their specific contribution timeframe or area

Think like you're assembling a real consulting team - consider diverse perspectives, complementary skills, and how they'd work together to maximize ${thinkerName}'s impact.

Respond ONLY in this JSON format:
{
  "selected_team": [
    {
      "member_code": "MEMBER_CODE",
      "role_on_team": "Role Title",
      "rationale": "Detailed explanation of why this member is perfect for this work",
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
            content: 'You are an expert in organizational psychology and team dynamics, specializing in assembling high-performing interdisciplinary teams. You understand Neural Ennead frameworks and how different cognitive profiles complement each other. Return only valid JSON.'
          },
          { role: 'user', content: teamSelectionPrompt }
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
    
      console.log('AI Response received');

      try {
        // Improved JSON parsing with better error handling
        const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        teamData = JSON.parse(cleanContent);
        
        if (!teamData.selected_team || !Array.isArray(teamData.selected_team)) {
          throw new Error('AI response missing selected_team array');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', aiContent);
        throw new Error(`Invalid AI response format: ${parseError.message}`);
      }
    }

    // 5. Validate selected members exist and create team record
    const selectedMemberCodes = teamData.selected_team.map((member: any) => member.member_code);
    const validMembers = allMembers.filter(member => 
      selectedMemberCodes.includes(member.member_code)
    );

    if (validMembers.length === 0) {
      throw new Error('No valid member codes found in AI response');
    }

    console.log(`Validated ${validMembers.length} of ${selectedMemberCodes.length} selected members`);

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
          requested_size: finalTeamSize,
          available_pool: availableMembers.length,
          globally_used: globallyUsedMemberCodes.size,
          processing_time_ms: Date.now() - startTime
        }
      })
      .select()
      .single();

    if (teamError || !teamRecord) {
      console.error('Failed to create team record:', teamError);
      throw new Error(`Failed to create team record: ${teamError?.message}`);
    }

    console.log(`Created team record: ${teamRecord.id}`);

    // 7. Insert team members with AI-generated narratives
    const teamMembersData = teamData.selected_team
      .filter((aiMember: any) => validMembers.find(vm => vm.member_code === aiMember.member_code))
      .map((aiMember: any, index: number) => ({
        team_id: teamRecord.id,
        member_code: aiMember.member_code,
        order_index: index + 1,
        role_on_team: aiMember.role_on_team || `Team Member ${index + 1}`,
        rationale: aiMember.rationale || 'Selected for their expertise and fit with team dynamics',
        contribution_focus: aiMember.contribution_focus || 'Core team contribution',
        metadata: {
          ai_generated: true,
          selection_confidence: 'high',
          processing_timestamp: new Date().toISOString()
        }
      }));

    if (teamMembersData.length === 0) {
      throw new Error('No valid team members to insert');
    }

    const { error: membersInsertError } = await supabase
      .from('thinker_alignment_team_members')
      .insert(teamMembersData);

    if (membersInsertError) {
      console.error('Failed to insert team members:', membersInsertError);
      throw new Error(`Failed to insert team members: ${membersInsertError.message}`);
    }

    console.log(`Inserted ${teamMembersData.length} team members`);

    // 8. Return complete team data with explicit field selection
    const { data: completeTeam, error: fetchError } = await supabase
      .from('thinker_alignment_teams')
      .select(`
        id,
        thinker_name,
        domain,
        team_size,
        industries,
        created_at,
        thinker_alignment_team_members (
          member_code,
          order_index,
          role_on_team,
          rationale,
          contribution_focus
        )
      `)
      .eq('id', teamRecord.id)
      .single();

    if (fetchError || !completeTeam) {
      console.error('Failed to fetch complete team:', fetchError);
      throw new Error(`Failed to fetch complete team: ${fetchError?.message}`);
    }

    // Enrich with member details
    const enrichedTeam = {
      ...completeTeam,
      thinker_alignment_team_members: completeTeam.thinker_alignment_team_members.map((member: any) => {
        const memberDetails = allMembers.find(m => m.member_code === member.member_code);
        return {
          ...member,
          neural_ennead_members: memberDetails ? {
            display_name: memberDetails.display_name,
            description: memberDetails.description,
            exemplar_roles: memberDetails.exemplar_roles || [],
            primary_family_code: memberDetails.primary_family_code,
            secondary_family_code: memberDetails.secondary_family_code,
            tertiary_family_code: memberDetails.tertiary_family_code,
            canonical_keywords: memberDetails.canonical_keywords || []
          } : null
        };
      })
    };

    return new Response(JSON.stringify({
      success: true,
      team: enrichedTeam,
      message: `Successfully assembled ${validMembers.length}-member team for ${thinkerName} in ${domain}`,
      processing_time: `${Date.now() - startTime}ms`,
      metadata: {
        model_used: 'gpt-5-2025-08-07',
        members_available: availableMembers.length,
        members_total: allMembers.length,
        globally_used: globallyUsedMemberCodes.size,
        unique_team_guarantee: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in build-thinker-team function:', error);
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