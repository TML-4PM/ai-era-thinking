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
    family_code: string;
    brain_system: string;
    thinking_style: string;
    decision_style: string;
    neural_ennead_families?: {
      family_name: string;
    };
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

  const loadExistingTeam = async () => {
    try {
      setLoadingExisting(true);
      const { data, error } = await supabase
        .from('thinker_alignment_teams')
        .select(`
          *,
          thinker_alignment_team_members (
            member_code,
            order_index,
            role_on_team,
            rationale,
            contribution_focus,
            neural_ennead_members!thinker_alignment_team_members_member_code_fkey (
              display_name,
              description,
              exemplar_roles,
              family_code,
              brain_system,
              thinking_style,
              decision_style,
              neural_ennead_families(family_name)
            )
          )
        `)
        .eq('thinker_name', thinkerName)
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading existing team:', error);
        return;
      }

      if (data && data.length > 0) {
        setExistingTeam(data[0]);
        setSelectedIndustries(data[0].industries || []);
      }
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoadingExisting(false);
    }
  };

  const buildNewTeam = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('build-thinker-team', {
        body: {
          thinkerName,
          thinkerArea,
          coreIdea,
          aiShift,
          domain,
          industries: selectedIndustries,
          teamSize: 9
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
      
    } catch (error) {
      console.error('Error building team:', error);
      toast({
        title: "Team Building Failed",
        description: error.message,
        variant: "destructive"
      });
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

  const getFamilyIcon = (familyCode: string) => {
    switch (familyCode) {
      case 'ORACLE': return <Target className="w-4 h-4" />;
      case 'GUARDIAN': return <Users className="w-4 h-4" />;
      case 'ARCHITECT': return <Lightbulb className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
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
          <Button
            onClick={buildNewTeam}
            disabled={loading}
            className="flex items-center gap-2 w-full"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {existingTeam ? 'Rebuild Team' : 'Assemble Dream Team'}
          </Button>
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
                          {getFamilyIcon(member.neural_ennead_members?.family_code || '')}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {member.neural_ennead_members?.display_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {member.neural_ennead_members?.neural_ennead_families?.family_name}
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

                    <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2 pt-2 border-t">
                      <div>
                        <strong>Brain:</strong> {member.neural_ennead_members?.brain_system}
                      </div>
                      <div>
                        <strong>Thinking:</strong> {member.neural_ennead_members?.thinking_style}
                      </div>
                      <div>
                        <strong>Decision:</strong> {member.neural_ennead_members?.decision_style}
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
