import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Clock, Users, Loader2, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThinkerTeamChatProps {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
  assignedTeam: {
    member_code: string;
    display_name: string;
    description: string;
    role_on_team: string;
    rationale: string;
  }[];
}

interface TeamDialogue {
  topic: string;
  participants: string[];
  timeframes: {
    [key: string]: {
      [participant: string]: string;
    };
  };
  synthesis: string;
}

export const ThinkerTeamChat: React.FC<ThinkerTeamChatProps> = ({
  thinkerName,
  thinkerArea,
  coreIdea,
  aiShift,
  assignedTeam
}) => {
  const [customTopic, setCustomTopic] = useState('');
  const [domain, setDomain] = useState('strategic-planning');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<TeamDialogue | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const industries = [
    { id: 'government', name: 'Government & Public Sector' },
    { id: 'healthcare', name: 'Healthcare & Life Sciences' },
    { id: 'finance', name: 'Finance & Banking' },
    { id: 'technology', name: 'Technology & Software' },
    { id: 'education', name: 'Education & Research' },
    { id: 'manufacturing', name: 'Manufacturing & Industrial' },
    { id: 'retail', name: 'Retail & Consumer' },
    { id: 'energy', name: 'Energy & Utilities' },
  ];

  const generateTeamChat = async () => {
    const topic = customTopic.trim() || coreIdea;
    if (!topic) {
      toast({
        title: "No Topic",
        description: "Please provide a topic for the team conversation",
        variant: "destructive"
      });
      return;
    }

    if (!assignedTeam || assignedTeam.length === 0) {
      toast({
        title: "No Team",
        description: "No team members assigned. Please build a team first.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('team-chat', {
        body: {
          thinkerName,
          thinkerArea,
          coreIdea,
          aiShift,
          topic,
          domain,
          industries: selectedIndustries,
          teamMembers: assignedTeam
        }
      });

      if (error) throw error;

      setDialogue(data.dialogue);
      
      toast({
        title: "Team Chat Generated",
        description: `Generated conversation between ${thinkerName} and ${assignedTeam.length} team members`,
      });
      
    } catch (error) {
      console.error('Error generating team chat:', error);
      toast({
        title: "Chat Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat with {thinkerName} and the Team
          </CardTitle>
          <CardDescription>
            Generate structured team conversations across implementation timeframes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Team Display */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Assigned Team ({assignedTeam.length} members)</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {assignedTeam.map(member => (
                <div key={member.member_code} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                  <Brain className="w-4 h-4 text-brand" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{member.display_name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {member.role_on_team}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Selection */}
          <div className="space-y-3">
            <Label>Industry Context (optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {industries.map((industry) => (
                <div key={industry.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={industry.id}
                    checked={selectedIndustries.includes(industry.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIndustries([...selectedIndustries, industry.id]);
                      } else {
                        setSelectedIndustries(selectedIndustries.filter(id => id !== industry.id));
                      }
                    }}
                  />
                  <Label htmlFor={industry.id} className="text-xs">
                    {industry.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedIndustries.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedIndustries.map(industryId => {
                  const industry = industries.find(i => i.id === industryId);
                  return (
                    <Badge key={industryId} variant="outline" className="text-xs">
                      {industry?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Topic Configuration */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="custom-topic">Topic (default: core idea)</Label>
              <Input
                id="custom-topic"
                placeholder={`Enter topic or use: ${coreIdea.slice(0, 50)}...`}
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain-select">Application Domain</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger id="domain-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strategic-planning">Strategic Planning</SelectItem>
                  <SelectItem value="digital-transformation">Digital Transformation</SelectItem>
                  <SelectItem value="change-management">Change Management</SelectItem>
                  <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                  <SelectItem value="organizational-culture">Organizational Culture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateTeamChat} 
            disabled={loading || assignedTeam.length === 0}
            className="w-full flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            Generate Team Chat
          </Button>
        </CardContent>
      </Card>

      {/* Dialogue Display */}
      {dialogue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Conversation: {dialogue.topic}
            </CardTitle>
            <CardDescription>
              Participants: {dialogue.participants.join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(dialogue.timeframes).map(([timeframe, content]) => {
              const timeframeName = 
                timeframe === 'now_0_6' ? '0-6 months' :
                timeframe === 'mid_6_18' ? '6-18 months' :
                '18-36 months';
              
              const colorClasses = 
                timeframe === 'now_0_6' ? 'border-green-200 bg-green-50 dark:bg-green-950/20' :
                timeframe === 'mid_6_18' ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20' :
                'border-purple-200 bg-purple-50 dark:bg-purple-950/20';

              return (
                <div key={timeframe} className={`p-4 rounded-lg border-2 ${colorClasses}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    <h3 className="font-semibold">{timeframeName}</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(content).map(([participant, contribution]) => (
                      <div key={participant} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {participant === thinkerName ? '🧠' : '👥'} {participant}
                          </Badge>
                        </div>
                        <p className="text-sm pl-4 border-l-2 border-muted">{contribution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Synthesis */}
            <Card className="border-2 border-brand/20 bg-brand/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Team Synthesis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{dialogue.synthesis}</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThinkerTeamChat;