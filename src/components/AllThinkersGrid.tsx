import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Users, Search, Sparkles, Plus, Loader2 } from "lucide-react";
import { thinkerService, type EnhancedThinker } from "@/services/ThinkerService";
import { EnhancedThinkerModal } from "./EnhancedThinkerModal";
import { useToast } from "@/hooks/use-toast";

export const AllThinkersGrid: React.FC = () => {
  const [enhancedThinkers, setEnhancedThinkers] = useState<EnhancedThinker[]>([]);
  const [filteredThinkers, setFilteredThinkers] = useState<EnhancedThinker[]>([]);
  const [selectedThinker, setSelectedThinker] = useState<EnhancedThinker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lobeFilter, setLobeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [coverageStats, setCoverageStats] = useState({
    total: 0,
    withProfiles: 0,
    withTeams: 0,
    withBoth: 0,
    coverage: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [enhancedThinkers, searchQuery, lobeFilter, statusFilter]);

  const loadData = async () => {
    try {
      const [thinkers, stats] = await Promise.all([
        thinkerService.getAllEnhancedThinkers(),
        thinkerService.getCoverageStats()
      ]);
      setEnhancedThinkers(thinkers);
      setCoverageStats(stats);
    } catch (error) {
      console.error('Error loading enhanced thinkers:', error);
    }
  };

  const applyFilters = () => {
    let filtered = enhancedThinkers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(thinker => 
        thinker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thinker.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thinker.coreIdea.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lobe filter
    if (lobeFilter !== 'all') {
      filtered = filtered.filter(thinker => thinker.lobe === lobeFilter);
    }

    // Status filter
    if (statusFilter === 'enhanced') {
      filtered = filtered.filter(thinker => thinker.hasDeepProfile && thinker.hasTeam);
    } else if (statusFilter === 'partial') {
      filtered = filtered.filter(thinker => thinker.hasDeepProfile || thinker.hasTeam);
    } else if (statusFilter === 'basic') {
      filtered = filtered.filter(thinker => !thinker.hasDeepProfile && !thinker.hasTeam);
    }

    setFilteredThinkers(filtered);
  };

  const handleGenerateProfile = async (thinkerName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsGenerating(thinkerName);
    
    try {
      const result = await thinkerService.generateProfile(thinkerName);
      if (result.success) {
        toast({
          title: "Profile Generated",
          description: `Deep profile for ${thinkerName} has been generated successfully.`,
        });
        loadData(); // Reload data
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateTeam = async (thinkerName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsGenerating(thinkerName);
    
    try {
      const result = await thinkerService.generateTeam(thinkerName);
      if (result.success) {
        toast({
          title: "Team Generated",
          description: `Dream team for ${thinkerName} has been assembled successfully.`,
        });
        loadData(); // Reload data
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Failed to generate team",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const getLobeColor = (lobe: string) => {
    const colors = {
      "Decision/Action": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      "Innovation/Strategy": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      "Ethics/Governance": "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      "Culture/Behaviour": "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      "Perception/Patterning": "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    };
    return colors[lobe as keyof typeof colors] || "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  };

  const lobes = Array.from(new Set(enhancedThinkers.map(t => t.lobe)));

  return (
    <div className="space-y-6">
      {/* Simple Search */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search thinkers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Thinkers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThinkers.map((thinker) => (
          <Card 
            key={thinker.name} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setSelectedThinker(thinker)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{thinker.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {thinker.area}
                    </Badge>
                    <Badge 
                      className={`text-xs border ${getLobeColor(thinker.lobe)}`}
                      variant="outline"
                    >
                      {thinker.lobe}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {thinker.coreIdea}
              </p>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {thinker.hasDeepProfile && (
                  <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Deep Profile
                  </Badge>
                )}
                {thinker.hasTeam && (
                  <Badge className="text-xs bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
                    <Users className="w-3 h-3 mr-1" />
                    Dream Team
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                {!thinker.hasDeepProfile && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => handleGenerateProfile(thinker.name, e)}
                    disabled={isGenerating === thinker.name}
                    className="flex-1"
                  >
                    {isGenerating === thinker.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-1" />
                    )}
                    Profile
                  </Button>
                )}
                {!thinker.hasTeam && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => handleGenerateTeam(thinker.name, e)}
                    disabled={isGenerating === thinker.name}
                    className="flex-1"
                  >
                    {isGenerating === thinker.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-1" />
                    )}
                    Team
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredThinkers.length} of {enhancedThinkers.length} thinkers
      </div>

      {/* Enhanced Thinker Modal */}
      {selectedThinker && (
        <EnhancedThinkerModal
          thinker={selectedThinker}
          isOpen={!!selectedThinker}
          onClose={() => setSelectedThinker(null)}
        />
      )}
    </div>
  );
};