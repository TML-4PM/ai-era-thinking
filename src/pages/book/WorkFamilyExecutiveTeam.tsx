import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Home, Heart, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkFamilyAgent {
  member_code: string;
  display_name: string;
  short_label: string;
  primary_family_code: string;
  secondary_family_code: string | null;
  tertiary_family_code: string | null;
  description: string;
  canonical_keywords: string[];
  exemplar_roles: string[];
  created_at: string;
  updated_at: string;
}

const WorkFamilyExecutiveTeam = () => {
  const { slug } = useParams();

  const { data: agents, isLoading } = useQuery({
    queryKey: ['workfamily-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neural_ennead_members')
        .select('*')
        .order('primary_family_code', { ascending: true })
        .order('display_name', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const getDomainIcon = (familyCode: string) => {
    switch (familyCode?.toLowerCase()) {
      case 'hh': return Home;
      case 'org': return Building2;
      case 'community': return Heart;
      default: return Briefcase;
    }
  };

  const getDomainName = (familyCode: string) => {
    switch (familyCode?.toLowerCase()) {
      case 'hh': return 'Household';
      case 'org': return 'Organizational';
      case 'community': return 'Community';
      default: return familyCode;
    }
  };

  const groupedAgents = agents?.reduce((acc, agent) => {
    const domain = agent.primary_family_code || 'other';
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(agent);
    return acc;
  }, {} as Record<string, WorkFamilyAgent[]>);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">WorkFamilyAI Executive Team</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Meet your AI-powered executive team organized by work-family domains. Each agent specializes 
          in specific capabilities across household, organizational, and community contexts.
        </p>
      </div>

      {groupedAgents && Object.entries(groupedAgents).map(([domain, domainAgents]) => {
        const Icon = getDomainIcon(domain);
        const domainName = getDomainName(domain);

        return (
          <div key={domain} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Icon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{domainName} Domain</h2>
              <Badge variant="secondary">{domainAgents.length} Agents</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {domainAgents.map(agent => (
                <Card key={agent.member_code} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">{agent.display_name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {agent.member_code}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="mt-3">
                      {agent.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {agent.canonical_keywords && agent.canonical_keywords.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Key Capabilities:</h4>
                          <div className="flex flex-wrap gap-2">
                            {agent.canonical_keywords.map((capability, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {agent.exemplar_roles && agent.exemplar_roles.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Exemplar Roles:</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {agent.exemplar_roles.map((role, idx) => (
                              <p key={idx}>• {role}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {(!agents || agents.length === 0) && (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No WorkFamilyAI agents found. Check database configuration.</p>
        </Card>
      )}
    </div>
  );
};

export default WorkFamilyExecutiveTeam;
