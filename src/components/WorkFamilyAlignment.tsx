import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { THINKERS } from "@/data/thinkers";
import { Brain, Users, Zap, Target, ArrowRight, RefreshCw, MessageSquare, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FamilyAlignment {
  family_code: string;
  family_name: string;
  confidence: number;
  rationale: string;
  description?: string;
  exemplar_roles?: string[];
}

interface MemberAlignment {
  member_code: string;
  display_name: string;
  confidence: number;
  rationale: string;
  transitions?: {
    now_0_6?: string;
    mid_6_18?: string;
    long_18_36?: string;
  };
  description?: string;
  exemplar_roles?: string[];
}

// Helper function to safely coerce Supabase Json to transitions type
const asTransitions = (value: any): MemberAlignment['transitions'] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as MemberAlignment['transitions'];
};

interface ThinkerAlignment {
  thinker_name: string;
  domain: string;
  alignments: FamilyAlignment[];
  processing_time?: string;
}

interface ThinkerMemberAlignment {
  thinker_name: string;
  domain: string;
  alignments: MemberAlignment[];
  processing_time?: string;
}

export const WorkFamilyAlignment: React.FC = () => {
  const [alignments, setAlignments] = useState<ThinkerAlignment[]>([]);
  const [memberAlignments, setMemberAlignments] = useState<ThinkerMemberAlignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [families, setFamilies] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [petTopics, setPetTopics] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadFamilies();
    loadMembers();
    loadExistingAlignments();
    loadMemberAlignments();
    loadPetTopics();
  }, []);

  const loadFamilies = async () => {
    try {
      const { data, error } = await supabase
        .from('neural_ennead_families')
        .select('*')
        .order('family_name');
      
      if (error) throw error;
      setFamilies(data || []);
    } catch (error) {
      console.error('Error loading families:', error);
    }
  };

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('neural_ennead_members')
        .select('*')
        .order('member_code');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadPetTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('thinker_pet_topics')
        .select('*');
      
      if (error) throw error;
      const topicsMap = (data || []).reduce((acc, item) => {
        acc[item.thinker_name] = item.pet_topic;
        return acc;
      }, {} as Record<string, string>);
      setPetTopics(topicsMap);
    } catch (error) {
      console.error('Error loading pet topics:', error);
    }
  };

  const loadExistingAlignments = async () => {
    try {
      const { data, error } = await supabase
        .from('thinker_family_alignment')
        .select(`
          thinker_name,
          domain,
          family_code,
          rank,
          confidence,
          rationale,
          neural_ennead_families(family_name, description, exemplar_roles)
        `)
        .order('thinker_name, domain, rank');
      
      if (error) throw error;
      
      // Group by thinker and domain
      const grouped = (data || []).reduce((acc, item) => {
        const key = `${item.thinker_name}|${item.domain}`;
        if (!acc[key]) {
          acc[key] = {
            thinker_name: item.thinker_name,
            domain: item.domain,
            alignments: []
          };
        }
        
        acc[key].alignments.push({
          family_code: item.family_code,
          family_name: item.neural_ennead_families?.family_name || 'Unknown',
          confidence: item.confidence,
          rationale: item.rationale || '',
          description: item.neural_ennead_families?.description || '',
          exemplar_roles: item.neural_ennead_families?.exemplar_roles || []
        });
        
        return acc;
      }, {} as Record<string, ThinkerAlignment>);
      
      setAlignments(Object.values(grouped));
    } catch (error) {
      console.error('Error loading alignments:', error);
    }
  };

  const loadMemberAlignments = async () => {
    try {
      const { data, error } = await supabase
        .from('thinker_member_alignment')
        .select(`
          thinker_name,
          domain,
          member_code,
          rank,
          confidence,
          rationale,
          transitions,
          neural_ennead_members(display_name, description, exemplar_roles)
        `)
        .order('thinker_name, domain, rank');
      
      if (error) throw error;
      
      // Group by thinker and domain
      const grouped = (data || []).reduce((acc, item) => {
        const key = `${item.thinker_name}|${item.domain}`;
        if (!acc[key]) {
          acc[key] = {
            thinker_name: item.thinker_name,
            domain: item.domain,
            alignments: []
          };
        }
        
        acc[key].alignments.push({
          member_code: item.member_code,
          display_name: item.neural_ennead_members?.display_name || 'Unknown',
          confidence: item.confidence,
          rationale: item.rationale || '',
          transitions: asTransitions(item.transitions),
          description: item.neural_ennead_members?.description || '',
          exemplar_roles: item.neural_ennead_members?.exemplar_roles || []
        });
        
        return acc;
      }, {} as Record<string, ThinkerMemberAlignment>);
      
      setMemberAlignments(Object.values(grouped));
    } catch (error) {
      console.error('Error loading member alignments:', error);
    }
  };

  const seedFamilies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('seed-neural-ennead');
      
      if (error) throw error;
      
      toast({
        title: "Families Seeded",
        description: "Neural Ennead families have been loaded successfully",
      });
      
      await loadFamilies();
    } catch (error) {
      console.error('Error seeding families:', error);
      toast({
        title: "Seeding Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const seedMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('seed-neural-ennead-members');
      
      if (error) throw error;
      
      toast({
        title: "Members Seeded",
        description: `Successfully seeded ${data.total_members} Neural Ennead members (729 combinations)`,
      });
      
      await loadMembers();
    } catch (error) {
      console.error('Error seeding members:', error);
      toast({
        title: "Member Seeding Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runBulkMemberAlignment = async () => {
    try {
      setLoading(true);
      setProgress(0);
      
      const total = THINKERS.length * 2;
      let completed = 0;

      for (const thinker of THINKERS) {
        const domains = getDomainsForLobe(thinker.lobe);
        
        for (const domain of domains.slice(0, 2)) {
          try {
            const { data, error } = await supabase.functions.invoke('align-workfamily-members', {
              body: {
                thinkerName: thinker.name,
                thinkerArea: thinker.area,
                coreIdea: thinker.coreIdea,
                aiShift: thinker.aiShift,
                domain: domain,
                petTopic: petTopics[thinker.name]
              }
            });

            if (error) {
              console.error(`Member alignment error for ${thinker.name} (${domain}):`, error);
            }
            
            completed++;
            setProgress((completed / total) * 100);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`Error aligning ${thinker.name} to members in ${domain}:`, error);
          }
        }
      }

      toast({
        title: "Bulk Member Alignment Complete",
        description: `Processed ${THINKERS.length} thinkers across 729-member lattice`,
      });
      
      await loadMemberAlignments();
      
    } catch (error) {
      console.error('Error in bulk member alignment:', error);
      toast({
        title: "Bulk Member Alignment Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const runBulkAlignment = async () => {
    try {
      setLoading(true);
      setProgress(0);
      
      const total = THINKERS.length * 2;
      let completed = 0;

      for (const thinker of THINKERS) {
        const domains = getDomainsForLobe(thinker.lobe);
        
        for (const domain of domains.slice(0, 2)) {
          try {
            const { data, error } = await supabase.functions.invoke('align-workfamily', {
              body: {
                thinkerName: thinker.name,
                thinkerArea: thinker.area,
                coreIdea: thinker.coreIdea,
                aiShift: thinker.aiShift,
                domain: domain
              }
            });

            if (error) {
              console.error(`Alignment error for ${thinker.name} (${domain}):`, error);
            }
            
            completed++;
            setProgress((completed / total) * 100);
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
          } catch (error) {
            console.error(`Error aligning ${thinker.name} to ${domain}:`, error);
          }
        }
      }

      toast({
        title: "Bulk Alignment Complete",
        description: `Processed ${THINKERS.length} thinkers across multiple domains`,
      });
      
      await loadExistingAlignments();
      
    } catch (error) {
      console.error('Error in bulk alignment:', error);
      toast({
        title: "Bulk Alignment Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const getDomainsForLobe = (lobe: string): string[] => {
    switch (lobe) {
      case 'Decision/Action':
        return ['risk-assessment', 'strategic-planning'];
      case 'Innovation/Strategy':
        return ['digital-transformation', 'competitive-analysis'];
      case 'Ethics/Governance':
        return ['regulatory-compliance', 'ethical-ai'];
      case 'Perception/Patterning':
        return ['digital-transformation', 'market-strategy'];
      case 'Culture/Behaviour':
        return ['change-management', 'organizational-culture'];
      default:
        return ['strategic-planning', 'change-management'];
    }
  };

  const getFamilyIcon = (familyCode: string) => {
    switch (familyCode) {
      case 'ORACLE': return <Target className="w-4 h-4" />;
      case 'GUARDIAN': return <Users className="w-4 h-4" />;
      case 'ARCHITECT': return <Zap className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-brand" />
          WorkFamilyAI Neural Ennead Alignment
        </h3>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Map thinkers to Neural Ennead work family archetypes with timeframe-specific transitions
        </p>
      </div>

      <Tabs defaultValue="families" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="families">Families (9)</TabsTrigger>
          <TabsTrigger value="members">Members (729)</TabsTrigger>
        </TabsList>

        <TabsContent value="families" className="space-y-6">
          {/* Family Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Family Alignment Controls</CardTitle>
              <CardDescription>
                Manage Neural Ennead families and run family-level alignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={seedFamilies}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Seed Families ({families.length} loaded)
                </Button>
                
                <Button
                  onClick={runBulkAlignment}
                  disabled={loading || families.length === 0}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Run Family Alignment
                </Button>
              </div>
              
              {loading && progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Family Alignment Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Family Results */}
          {alignments.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Family Alignment Results ({alignments.length} thinker-domain pairs)</h4>
              <div className="grid gap-4">
                {alignments.slice(0, 10).map((alignment, index) => (
                  <Card key={`${alignment.thinker_name}-${alignment.domain}`} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium">{alignment.thinker_name}</h5>
                        <p className="text-sm text-muted-foreground">{alignment.domain}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {alignment.alignments.map((family, fIndex) => (
                        <div key={`${family.family_code}-${fIndex}`} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                          <div className="p-2 rounded-full bg-brand/10">
                            {getFamilyIcon(family.family_code)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{family.family_name}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(family.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{family.rationale}</p>
                            {family.exemplar_roles && family.exemplar_roles.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {family.exemplar_roles.slice(0, 3).map(role => (
                                  <Badge key={role} variant="secondary" className="text-xs">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
                
                {alignments.length > 10 && (
                  <p className="text-center text-sm text-muted-foreground">
                    ... and {alignments.length - 10} more family alignments
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          {/* Member Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Member Alignment Controls</CardTitle>
              <CardDescription>
                Manage 729 Neural Ennead members and run granular alignment with timeframes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={seedMembers}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Seed Members ({members.length} loaded)
                </Button>
                
                <Button
                  onClick={runBulkMemberAlignment}
                  disabled={loading || members.length === 0}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Run Member Alignment (729)
                </Button>
              </div>
              
              {loading && progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Member Alignment Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Member Results */}
          {memberAlignments.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Member Alignment Results ({memberAlignments.length} thinker-domain pairs)</h4>
              <div className="grid gap-4">
                {memberAlignments.slice(0, 8).map((alignment, index) => (
                  <Card key={`${alignment.thinker_name}-${alignment.domain}`} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium">{alignment.thinker_name}</h5>
                        <p className="text-sm text-muted-foreground">{alignment.domain}</p>
                        {petTopics[alignment.thinker_name] && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Pet Topic: {petTopics[alignment.thinker_name]}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {alignment.alignments.map((member, mIndex) => (
                        <div key={`${member.member_code}-${mIndex}`} className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-brand" />
                            <span className="font-medium text-sm">{member.display_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(member.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{member.rationale}</p>
                          
                          {member.transitions && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs font-medium">Implementation Timeframes</span>
                              </div>
                              <div className="grid gap-2 text-xs">
                                {member.transitions.now_0_6 && (
                                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                                    <div className="font-medium text-green-800 dark:text-green-400">0-6 months</div>
                                    <div className="text-green-700 dark:text-green-300">{member.transitions.now_0_6}</div>
                                  </div>
                                )}
                                {member.transitions.mid_6_18 && (
                                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                                    <div className="font-medium text-blue-800 dark:text-blue-400">6-18 months</div>
                                    <div className="text-blue-700 dark:text-blue-300">{member.transitions.mid_6_18}</div>
                                  </div>
                                )}
                                {member.transitions.long_18_36 && (
                                  <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
                                    <div className="font-medium text-purple-800 dark:text-purple-400">18-36 months</div>
                                    <div className="text-purple-700 dark:text-purple-300">{member.transitions.long_18_36}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
                
                {memberAlignments.length > 8 && (
                  <p className="text-center text-sm text-muted-foreground">
                    ... and {memberAlignments.length - 8} more member alignments
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Family Overview */}
      {families.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Neural Ennead Overview</CardTitle>
            <CardDescription>
              The 9 work family archetypes ({families.length} families, {members.length} member combinations)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {families.map(family => (
                <div key={family.family_code} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getFamilyIcon(family.family_code)}
                    <h6 className="font-medium text-sm">{family.family_name}</h6>
                  </div>
                  <p className="text-xs text-muted-foreground">{family.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkFamilyAlignment;
