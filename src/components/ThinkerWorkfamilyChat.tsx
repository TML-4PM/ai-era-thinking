
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Clock, Users, Brain, Loader2, Check, ChevronsUpDown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThinkerWorkfamilyChatProps {
  thinkerName: string;
  thinkerArea: string;
  coreIdea: string;
  aiShift: string;
}

interface Member {
  member_code: string;
  display_name: string;
  description: string;
  exemplar_roles: string[];
  confidence?: number;
}

interface Industry {
  id: string;
  name: string;
}

interface DuoDialogue {
  topic: string;
  participants: string[];
  timeframes: {
    now_0_6: {
      thinker: string;
      member: string;
    };
    mid_6_18: {
      thinker: string;
      member: string;
    };
    long_18_36: {
      thinker: string;
      member: string;
    };
  };
  synthesis: string;
}

export const ThinkerWorkfamilyChat: React.FC<ThinkerWorkfamilyChatProps> = ({
  thinkerName,
  thinkerArea,
  coreIdea,
  aiShift
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [topAlignments, setTopAlignments] = useState<Member[]>([]);
  const [petTopic, setPetTopic] = useState<string>('');
  const [usePetTopic, setUsePetTopic] = useState(true);
  const [customTopic, setCustomTopic] = useState('');
  const [domain, setDomain] = useState('strategic-planning');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [alignmentLoading, setAlignmentLoading] = useState(false);
  const [dialogue, setDialogue] = useState<DuoDialogue | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const industries: Industry[] = [
    { id: 'government', name: 'Government & Public Sector' },
    { id: 'healthcare', name: 'Healthcare & Life Sciences' },
    { id: 'finance', name: 'Finance & Banking' },
    { id: 'technology', name: 'Technology & Software' },
    { id: 'education', name: 'Education & Research' },
    { id: 'manufacturing', name: 'Manufacturing & Industrial' },
    { id: 'retail', name: 'Retail & Consumer' },
    { id: 'energy', name: 'Energy & Utilities' },
  ];

  useEffect(() => {
    loadMembers();
    loadTopAlignments();
    loadPetTopic();
  }, [thinkerName]);

  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('neural_ennead_members')
        .select('member_code, display_name, description, exemplar_roles')
        .order('display_name');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadTopAlignments = async () => {
    try {
      setAlignmentLoading(true);
      const { data, error } = await supabase
        .from('thinker_member_alignment')
        .select(`
          member_code,
          confidence,
          neural_ennead_members(
            member_code,
            display_name,
            description,
            exemplar_roles
          )
        `)
        .eq('thinker_name', thinkerName)
        .order('confidence', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      const alignedMembers = (data || [])
        .filter(item => item.neural_ennead_members)
        .map(item => ({
          member_code: item.neural_ennead_members.member_code,
          display_name: item.neural_ennead_members.display_name,
          description: item.neural_ennead_members.description,
          exemplar_roles: item.neural_ennead_members.exemplar_roles || [],
          confidence: item.confidence
        }));
      
      setTopAlignments(alignedMembers);
      
      // Auto-select the top alignment if available
      if (alignedMembers.length > 0 && !selectedMember) {
        setSelectedMember(alignedMembers[0]);
      }
    } catch (error) {
      console.error('Error loading top alignments:', error);
    } finally {
      setAlignmentLoading(false);
    }
  };

  const loadPetTopic = async () => {
    try {
      const { data, error } = await supabase
        .from('thinker_pet_topics')
        .select('pet_topic')
        .eq('thinker_name', thinkerName)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setPetTopic(data?.pet_topic || '');
    } catch (error) {
      console.error('Error loading pet topic:', error);
    }
  };

  const generateDuoChat = async () => {
    if (!selectedMember) {
      toast({
        title: "No Member Selected",
        description: "Please select a WorkFamily member to chat with",
        variant: "destructive"
      });
      return;
    }

    const topic = customTopic.trim() || (usePetTopic && petTopic) || coreIdea;
    if (!topic) {
      toast({
        title: "No Topic",
        description: "Please provide a topic for the conversation",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('duo-chat', {
        body: {
          thinkerName,
          thinkerArea,
          coreIdea,
          aiShift,
          memberCode: selectedMember.member_code,
          memberDisplayName: selectedMember.display_name,
          memberDescription: selectedMember.description,
          topic,
          petTopic: usePetTopic ? petTopic : undefined,
          domain,
          industries: selectedIndustries
        }
      });

      if (error) throw error;

      setDialogue(data.dialogue);
      
      toast({
        title: "Duo Chat Generated",
        description: `Generated conversation between ${thinkerName} and ${selectedMember.display_name}`,
      });
      
    } catch (error) {
      console.error('Error generating duo chat:', error);
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
            Duo Chat: {thinkerName} × WorkFamily Member
          </CardTitle>
          <CardDescription>
            Generate structured conversations across implementation timeframes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Member Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>WorkFamily Member ({members.length} available)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadTopAlignments}
                disabled={alignmentLoading}
                className="h-7 px-2"
              >
                {alignmentLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Refresh alignments
              </Button>
            </div>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedMember ? selectedMember.display_name : "Search 729 agents..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search agents..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No agents found.</CommandEmpty>
                    
                    {topAlignments.length > 0 && (
                      <CommandGroup heading="Top Alignments">
                        {topAlignments.map((member) => (
                          <CommandItem
                            key={`top-${member.member_code}`}
                            value={member.display_name}
                            onSelect={() => {
                              setSelectedMember(member);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedMember?.member_code === member.member_code ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <Badge variant="secondary" className="text-xs">
                                {Math.round((member.confidence || 0) * 100)}%
                              </Badge>
                              <span>{member.display_name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    <CommandGroup heading="All Members">
                      {filteredMembers.slice(0, 50).map((member) => (
                        <CommandItem
                          key={member.member_code}
                          value={member.display_name}
                          onSelect={() => {
                            setSelectedMember(member);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedMember?.member_code === member.member_code ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {member.display_name}
                        </CommandItem>
                      ))}
                      {filteredMembers.length > 50 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                          ... and {filteredMembers.length - 50} more. Keep typing to refine search.
                        </div>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {selectedMember && (
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground flex-1">{selectedMember.description}</p>
                  {selectedMember.confidence && (
                    <Badge variant="secondary" className="ml-2">
                      {Math.round(selectedMember.confidence * 100)}% match
                    </Badge>
                  )}
                </div>
                {selectedMember.exemplar_roles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedMember.exemplar_roles.slice(0, 4).map(role => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
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
            <div className="flex items-center space-x-2">
              <Switch
                id="use-pet-topic"
                checked={usePetTopic}
                onCheckedChange={setUsePetTopic}
              />
              <Label htmlFor="use-pet-topic">
                Use pet topic {petTopic && `(${petTopic})`}
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-topic">Custom Topic (optional)</Label>
              <Input
                id="custom-topic"
                placeholder="Enter a specific topic for discussion..."
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
            onClick={generateDuoChat} 
            disabled={loading || !selectedMember}
            className="w-full flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            Generate Duo Chat
          </Button>
        </CardContent>
      </Card>

      {/* Dialogue Display */}
      {dialogue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Conversation: {dialogue.participants.join(' × ')}
            </CardTitle>
            <CardDescription>
              Topic: {dialogue.topic}
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
                <div key={timeframe} className={`p-4 rounded-lg border ${colorClasses}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    <h4 className="font-semibold">{timeframeName}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Brain className="w-4 h-4 text-brand mt-1" />
                      <div>
                        <div className="font-medium text-sm">{dialogue.participants[0]}</div>
                        <p className="text-sm text-muted-foreground">{content.thinker}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-sm">{dialogue.participants[1]}</div>
                        <p className="text-sm text-muted-foreground">{content.member}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {dialogue.synthesis && (
              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-base">Collaborative Synthesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{dialogue.synthesis}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThinkerWorkfamilyChat;
