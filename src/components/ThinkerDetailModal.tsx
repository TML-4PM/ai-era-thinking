
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Brain, Lightbulb, Zap, Users } from "lucide-react";
import { Thinker } from "@/data/thinkers";
import { getExpandedThinker } from "@/data/expanded-thinkers";
import { ThinkerChat } from "./ThinkerChat";
import ThinkerTeamChat from "./ThinkerTeamChat";
import ThinkerTeamSection from "./ThinkerTeamSection";
import { supabase } from "@/integrations/supabase/client";

interface ThinkerDetailModalProps {
  thinker: Thinker | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ThinkerDetailModal: React.FC<ThinkerDetailModalProps> = ({
  thinker,
  isOpen,
  onClose
}) => {
  if (!thinker) return null;

  const expandedThinker = getExpandedThinker(thinker.name);
  const [activeTab, setActiveTab] = useState("overview");
  const [teamMembers, setTeamMembers] = useState([]);

  const eraMapping = {
    onPrem: "On-Premises Era",
    cloudNative: "Cloud-Native Era", 
    genAI: "Generative AI Era",
    agenticAI: "Agentic AI Era",
    bci: "Brain-Computer Interface Era"
  };

  const eraColors = {
    onPrem: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    cloudNative: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    genAI: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    agenticAI: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    bci: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
  };

  // Load team data when modal opens
  useEffect(() => {
    if (isOpen && thinker) {
      loadTeamData();
    }
  }, [isOpen, thinker?.name]);

  const loadTeamData = async () => {
    try {
      // First get the team
      const { data: teamData } = await supabase
        .from('thinker_alignment_teams')
        .select('id')
        .eq('thinker_name', thinker.name)
        .eq('domain', 'strategic-planning')
        .order('created_at', { ascending: false })
        .limit(1);

      if (teamData && teamData.length > 0) {
        const teamId = teamData[0].id;
        
        // Then get team members
        const { data: membersData } = await supabase
          .from('thinker_alignment_team_members')
          .select('member_code, role_on_team, rationale')
          .eq('team_id', teamId);

        if (membersData && membersData.length > 0) {
          // Finally get member details
          const memberCodes = membersData.map(m => m.member_code);
          const { data: memberDetails } = await supabase
            .from('neural_ennead_members')
            .select('member_code, display_name, description')
            .in('member_code', memberCodes);

          const enrichedMembers = membersData.map(member => {
            const details = memberDetails?.find(d => d.member_code === member.member_code);
            return {
              member_code: member.member_code,
              display_name: details?.display_name || member.member_code,
              description: details?.description || '',
              role_on_team: member.role_on_team,
              rationale: member.rationale
            };
          });
          setTeamMembers(enrichedMembers);
        }
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand" />
            {thinker.name}
          </DialogTitle>
          <DialogDescription>
            {thinker.area} • {thinker.lobe}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">Chat with author</span>
            </TabsTrigger>
            <TabsTrigger value="team-chat" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Chat with author and the team</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Author statements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Core Ideas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Core Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Original Insight</h4>
                  <p className="text-sm">{thinker.coreIdea}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">AI-Era Shift</h4>
                  <p className="text-sm">{thinker.aiShift}</p>
                </div>
              </CardContent>
            </Card>

            {/* Cross-Era Evolution */}
            {expandedThinker && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cross-Era Evolution</CardTitle>
                  <CardDescription>
                    How {thinker.name}'s framework transforms across technological eras through People, Policy, Process & Technology
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(expandedThinker.crossEraRelevance).map(([era, dimensions]) => (
                    <div key={era} className="space-y-3">
                      <Badge className={eraColors[era as keyof typeof eraColors]}>
                        {eraMapping[era as keyof typeof eraMapping]}
                      </Badge>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                        <div className="space-y-1">
                          <h5 className="text-xs font-medium text-primary">People</h5>
                          <p className="text-xs text-muted-foreground">{dimensions.people}</p>
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs font-medium text-primary">Policy</h5>
                          <p className="text-xs text-muted-foreground">{dimensions.policy}</p>
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs font-medium text-primary">Process</h5>
                          <p className="text-xs text-muted-foreground">{dimensions.process}</p>
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs font-medium text-primary">Technology</h5>
                          <p className="text-xs text-muted-foreground">{dimensions.technology}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {expandedThinker && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Implementation Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3">
                    <div>
                      <Badge variant="outline" className="mb-2">Immediate (0-6 months)</Badge>
                      <p className="text-sm">{expandedThinker.practicalApplications.immediate}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">Medium-term (6-18 months)</Badge>
                      <p className="text-sm">{expandedThinker.practicalApplications.mediumTerm}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">Long-term (18-36 months)</Badge>
                      <p className="text-sm">{expandedThinker.practicalApplications.longTerm}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {expandedThinker && expandedThinker.relatedThinkers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Thinkers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {expandedThinker.relatedThinkers.map(relatedName => (
                      <Badge key={relatedName} variant="secondary" className="text-xs">
                        {relatedName}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="team">
            <ThinkerTeamSection
              thinkerName={thinker.name}
              thinkerArea={thinker.area}
              coreIdea={thinker.coreIdea}
              aiShift={thinker.aiShift}
            />
          </TabsContent>

          <TabsContent value="chat">
            <ThinkerChat
              thinker={{
                name: thinker.name,
                area: thinker.area,
                coreIdea: thinker.coreIdea,
                aiShift: thinker.aiShift,
                ...expandedThinker
              }}
            />
          </TabsContent>

          <TabsContent value="team-chat">
            <ThinkerTeamChat
              thinkerName={thinker.name}
              thinkerArea={thinker.area}
              coreIdea={thinker.coreIdea}
              aiShift={thinker.aiShift}
              assignedTeam={teamMembers}
            />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {expandedThinker?.usagePrompts && (
              <div className="space-y-4">
                {expandedThinker.usagePrompts.map((prompt, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        {prompt.question}
                      </CardTitle>
                      <CardDescription>{prompt.context}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{prompt.application}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ThinkerDetailModal;
