
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { THINKERS } from "@/data/thinkers";
import { Brain, Users, Zap, Target, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FamilyAlignment {
  family_code: string;
  family_name: string;
  confidence: number;
  rationale: string;
  description?: string;
  exemplar_roles?: string[];
}

interface ThinkerAlignment {
  thinker_name: string;
  domain: string;
  alignments: FamilyAlignment[];
  processing_time?: string;
}

const DOMAIN_PRESETS = {
  'Decision Making': ['risk-assessment', 'strategic-planning', 'governance'],
  'Innovation & Strategy': ['digital-transformation', 'competitive-analysis', 'market-strategy'],
  'Ethics & Governance': ['regulatory-compliance', 'ethical-ai', 'organizational-governance'],
  'Human Systems': ['change-management', 'organizational-culture', 'stakeholder-engagement']
};

export const WorkFamilyAlignment: React.FC = () => {
  const [alignments, setAlignments] = useState<ThinkerAlignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [families, setFamilies] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFamilies();
    loadExistingAlignments();
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

  const runBulkAlignment = async () => {
    try {
      setLoading(true);
      setProgress(0);
      
      const total = THINKERS.length * 2; // Each thinker gets 2 domains
      let completed = 0;

      for (const thinker of THINKERS) {
        // Select domains based on lobe
        const domains = getDomainsForLobe(thinker.lobe);
        
        for (const domain of domains.slice(0, 2)) { // Limit to 2 domains per thinker
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
            
            // Small delay to prevent rate limiting
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
          Automatically map all 50+ thinkers to Neural Ennead work family archetypes using GPT-4.1 analysis
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Alignment Controls</CardTitle>
          <CardDescription>
            Manage Neural Ennead families and run bulk thinker alignment
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
              Run Bulk Alignment
            </Button>
          </div>
          
          {loading && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Alignment Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {alignments.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Alignment Results ({alignments.length} thinker-domain pairs)</h4>
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
                ... and {alignments.length - 10} more alignments
              </p>
            )}
          </div>
        </div>
      )}

      {/* Family Overview */}
      {families.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Neural Ennead Families Overview</CardTitle>
            <CardDescription>
              The 9 work family archetypes for organizational analysis
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
