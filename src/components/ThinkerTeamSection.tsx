import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Brain, RefreshCw, Clock, Target, Lightbulb, Factory } from "lucide-react";

interface TeamMember {
  member_code: string;
  order_index: number;
  role_on_team: string;
  rationale: string;
  contribution_focus?: string;
  neural_ennead_members?: {
    display_name: string;
    description: string;
    exemplar_roles: string[];
    primary_family_code: string;
    secondary_family_code?: string;
    tertiary_family_code?: string;
  };
}

interface ThinkerTeam {
  id: string;
  thinker_name: string;
  domain: string;
  team_size: number;
  industries: string[];
  created_at: string;
  thinker_alignment_team_members: TeamMember[];
}

interface ThinkerTeamSectionProps {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
}

const INDUSTRY_OPTIONS = [
  'Government & Public Sector',
  'Financial Services',
  'Healthcare',
  'Technology',
  'Manufacturing',
  'Education',
  'Retail',
  'Energy & Utilities',
  'Transportation',
  'Media & Entertainment'
];

export const ThinkerTeamSection: React.FC<ThinkerTeamSectionProps> = ({
  thinkerName,
  thinkerArea,
  coreIdea,
  aiShift
}) => {
  const [existingTeam, setExistingTeam] = useState<ThinkerTeam | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const { toast } = useToast();

  const domain = 'strategic-planning'; // Default domain for teams

  useEffect(() => {
    loadExistingTeam();
  }, [thinkerName]);

  // Create fallback team when API fails
  const createFallbackTeam = async () => {
    try {
      // Insert basic team record
      const { data: teamRecord, error: teamError } = await supabase
        .from('thinker_alignment_teams')
        .insert({
          thinker_name: thinkerName,
          domain: 'strategic-planning',
          team_size: 5,
          industries: selectedIndustries,
          selection_strategy: 'Fallback team - OpenAI unavailable'
        })
        .select()
        .single();

      if (teamError || !teamRecord) {
        console.error('Failed to create fallback team:', teamError);
        return null;
      }

      // Create basic fallback team structure
      return {
        id: teamRecord.id,
        thinker_name: thinkerName,
        domain: 'strategic-planning',
        team_size: 5,
        industries: selectedIndustries,
        created_at: teamRecord.created_at,
        thinker_alignment_team_members: [
          {
            member_code: 'FALLBACK_01',
            order_index: 1,
            role_on_team: 'Strategic Analyst',
            rationale: 'Fallback team member - full functionality requires OpenAI setup',
            contribution_focus: 'Strategic planning and analysis',
            neural_ennead_members: {
              display_name: 'Strategic Analyst',
              description: 'Fallback team member for strategic analysis',
              exemplar_roles: ['Strategic Planning', 'Analysis'],
              primary_family_code: 'FALLBACK'
            }
          },
          {
            member_code: 'FALLBACK_02',
            order_index: 2,
            role_on_team: 'Implementation Specialist',
            rationale: 'Fallback team member - full functionality requires OpenAI setup',
            contribution_focus: 'Implementation and execution',
            neural_ennead_members: {
              display_name: 'Implementation Specialist',
              description: 'Fallback team member for implementation',
              exemplar_roles: ['Implementation', 'Project Management'],
              primary_family_code: 'FALLBACK'
            }
          }
        ]
      };
    } catch (error) {
      console.error('Error creating fallback team:', error);
      return null;
    }
  };

  // Auto-build team if none exists
  useEffect(() => {
    if (!loadingExisting && !existingTeam && !loading) {
      const timer = setTimeout(() => {
        buildNewTeam();
      }, 1000); // Small delay to prevent immediate build on load
      return () => clearTimeout(timer);
    }
  }, [loadingExisting, existingTeam, loading]);

  const loadExistingTeam = async () => {
    try {
      setLoadingExisting(true);
      
      // First, get the team record
      const { data: teamData, error: teamError } = await supabase
        .from('thinker_alignment_teams')
        .select('*')
        .eq('thinker_name', thinkerName)
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1);

      if (teamError) {
        console.error('Error loading team:', teamError);
        return;
      }

      if (!teamData || teamData.length === 0) {
        return;
      }

      const team = teamData[0];

      // Then, get the team members separately to avoid circular JOIN
      const { data: membersData, error: membersError } = await supabase
        .from('thinker_alignment_team_members')
        .select('member_code, order_index, role_on_team, rationale, contribution_focus')
        .eq('team_id', team.id)
        .order('order_index');

      if (membersError) {
        console.error('Error loading team members:', membersError);
        return;
      }

      // Finally, get member details separately
      if (membersData && membersData.length > 0) {
        const memberCodes = membersData.map(m => m.member_code);
        const { data: memberDetails, error: detailsError } = await supabase
          .from('neural_ennead_members')
          .select('member_code, display_name, description, exemplar_roles, primary_family_code, secondary_family_code, tertiary_family_code')
          .in('member_code', memberCodes);

        if (detailsError) {
          console.error('Error loading member details:', detailsError);
        }

        // Merge the data
        const enrichedMembers = membersData.map(member => ({
          ...member,
          neural_ennead_members: memberDetails?.find(detail => detail.member_code === member.member_code) || null
        }));

        setExistingTeam({
          ...team,
          thinker_alignment_team_members: enrichedMembers
        });
        setSelectedIndustries(team.industries || []);
      } else {
        setExistingTeam({
          ...team,
          thinker_alignment_team_members: []
        });
        setSelectedIndustries(team.industries || []);
      }
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoadingExisting(false);
    }
  };

  const seedNeuralEnneadData = async () => {
    try {
      setLoading(true);
      toast({
        title: "Seeding Data",
        description: "Initializing Neural Ennead members (this may take a moment)...",
      });

      const { data, error } = await supabase.functions.invoke('seed-neural-ennead-members');
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        toast({
          title: "Data Seeded Successfully",
          description: `Initialized ${data.total_members} Neural Ennead members`,
        });
      } else {
        throw new Error(data.error || 'Failed to seed data');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        title: "Seeding Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const buildNewTeam = async () => {
    try {
      setLoading(true);
      
      // Get list of already assigned members to ensure uniqueness
      const { data: existingTeams } = await supabase
        .from('thinker_alignment_teams')
        .select(`
          thinker_name,
          thinker_alignment_team_members(member_code)
        `)
        .neq('thinker_name', thinkerName);

      const usedMemberCodes = existingTeams?.flatMap(team => 
        team.thinker_alignment_team_members?.map(member => member.member_code) || []
      ) || [];

      // Determine team size (5-9 members)
      const teamSize = Math.floor(Math.random() * 5) + 5; // Random between 5-9

      const { data, error } = await supabase.functions.invoke('build-thinker-team', {
        body: {
          thinkerName,
          thinkerArea,
          coreIdea,
          aiShift,
          domain,
          industries: selectedIndustries,
          teamSize,
          excludeMemberCodes: usedMemberCodes
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to build team');
      }

      toast({
        title: "Team Assembled",
        description: `Successfully built a ${data.team.team_size}-member WorkFamily team for ${thinkerName}`,
      });

      setExistingTeam(data.team);
      await loadExistingTeam(); // Reload to get fresh data
      
    } catch (error) {
      console.error('Error building team:', error);
      
      // Check if error indicates missing data - auto-seed if needed
      if (error.message.includes('Neural Ennead members found') || error.message.includes('No available members')) {
        toast({
          title: "Auto-seeding Data",
          description: "Initializing Neural Ennead members, then rebuilding team...",
        });
        
        // Auto-seed and retry
        try {
          await supabase.functions.invoke('seed-neural-ennead-members');
          // Small delay then retry
          setTimeout(() => buildNewTeam(), 2000);
          return;
        } catch (seedError) {
          toast({
            title: "Seeding Failed",
            description: "Could not initialize member data automatically.",
            variant: "destructive"
          });
        }
      } else {
        // If API call fails completely, create a fallback team
        const fallbackTeam = await createFallbackTeam();
        if (fallbackTeam) {
          setExistingTeam(fallbackTeam);
          toast({
            title: "Team Created",
            description: "Created a fallback team. Some functionality may be limited.",
          });
          return;
        }
        
        toast({
          title: "Team Building Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries(prev => [...prev, industry]);
    } else {
      setSelectedIndustries(prev => prev.filter(i => i !== industry));
    }
  };

  const getFamilyIcon = () => {
    return <Brain className="w-4 h-4" />;
  };

  if (loadingExisting) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand" />
            WorkFamily Dream Team
          </CardTitle>
          <CardDescription>Loading existing team...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand" />
            WorkFamily Dream Team
          </CardTitle>
          <CardDescription>
            AI-assembled team of Neural Ennead members to help {thinkerName} explore and apply their framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Industry Context Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              <span className="text-sm font-medium">Industry Context (Optional)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRY_OPTIONS.map(industry => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={industry}
                    checked={selectedIndustries.includes(industry)}
                    onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                  />
                  <label
                    htmlFor={industry}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {industry}
                  </label>
                </div>
              ))}
            </div>
            {selectedIndustries.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedIndustries.map(industry => (
                  <Badge key={industry} variant="secondary" className="text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Build Team Button */}
          <div className="space-y-2">
            <Button
              onClick={buildNewTeam}
              disabled={loading}
              className="flex items-center gap-2 w-full"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {existingTeam ? 'Rebuild Team' : 'Auto-Assign Team'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Existing Team */}
      {existingTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand" />
                {existingTeam.thinker_name}'s Team
              </span>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(existingTeam.created_at).toLocaleDateString()}
              </Badge>
            </CardTitle>
            <CardDescription>
              {existingTeam.team_size} carefully selected Neural Ennead members
              {existingTeam.industries.length > 0 && (
                <span> • Focus: {existingTeam.industries.join(', ')}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {existingTeam.thinker_alignment_team_members
                ?.sort((a, b) => a.order_index - b.order_index)
                ?.map((member) => (
                  <div key={member.member_code} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-brand/10">
                          {getFamilyIcon()}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {member.neural_ennead_members?.display_name || member.member_code}
                          </h4>
                           <p className="text-sm text-muted-foreground">
                             Neural Ennead Member
                           </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{member.order_index}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Badge className="text-xs mb-2">
                          {member.role_on_team}
                        </Badge>
                        <p className="text-sm">{member.rationale}</p>
                      </div>

                      {member.contribution_focus && (
                        <div className="p-2 bg-muted/30 rounded text-xs">
                          <strong>Focus Area:</strong> {member.contribution_focus}
                        </div>
                      )}

                      {member.neural_ennead_members?.exemplar_roles && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.neural_ennead_members.exemplar_roles.slice(0, 3).map(role => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2 pt-2 border-t">
                      <div>
                        <strong>Primary:</strong> {member.neural_ennead_members?.primary_family_code || 'N/A'}
                      </div>
                      <div>
                        <strong>Secondary:</strong> {member.neural_ennead_members?.secondary_family_code || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThinkerTeamSection;
