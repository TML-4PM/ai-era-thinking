import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Brain, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Zap, 
  ChevronDown, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Plus,
  Loader2,
  Heart,
  HeartOff
} from "lucide-react";
import { Thinker } from "@/data/thinkers";
import { getExpandedThinker } from "@/data/expanded-thinkers";
import { ThinkerTeamSection } from "./ThinkerTeamSection";
import { ThinkerChat } from "./ThinkerChat";
import { ThinkerTeamChat } from "./ThinkerTeamChat";
import { thinkerService, type EnhancedThinker } from "@/services/ThinkerService";
import { userThinkerService } from "@/services/UserThinkerService";
import { useToast } from "@/hooks/use-toast";
import { UserThinker } from "@/types/UserThinker";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedThinkerModalProps {
  thinker: Thinker | (Thinker & { isUserCreated?: boolean; userThinkerData?: UserThinker }) | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedThinkerModal: React.FC<EnhancedThinkerModalProps> = ({ 
  thinker, 
  isOpen, 
  onClose 
}) => {
  // Early return if no thinker - this prevents the null reference error
  if (!thinker) {
    return null;
  }

  const [enhancedThinker, setEnhancedThinker] = useState<EnhancedThinker | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMoreFramework, setShowMoreFramework] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoadState, setTeamLoadState] = useState<'loading' | 'loaded' | 'fallback'>('loading');
  const { toast } = useToast();

  const expandedThinker = getExpandedThinker(thinker.name);
  const isUserCreated = 'isUserCreated' in thinker && thinker.isUserCreated;
  const userThinkerData = 'userThinkerData' in thinker ? thinker.userThinkerData : null;

  useEffect(() => {
    const loadEnhancedData = async () => {
      if (isOpen && thinker) {
        setIsLoading(true);
        try {
          if (isUserCreated && userThinkerData) {
            // Handle user-created thinker
            setEnhancedThinker({
              name: userThinkerData.name,
              area: userThinkerData.area,
              coreIdea: userThinkerData.core_idea,
              aiShift: userThinkerData.ai_shift,
              lobe: userThinkerData.lobe as any,
              hasDeepProfile: true,
              hasTeam: false,
              isUserCreated: true,
              userThinkerData
            });
          } else {
            // Handle built-in thinker
            const enhanced = await thinkerService.getEnhancedThinker(thinker.name);
            setEnhancedThinker(enhanced);
            
            // Load team data for built-in thinkers
            await loadTeamData();
          }
          
          // Check if favorited
          const favorited = await userThinkerService.isFavorited(
            isUserCreated ? undefined : thinker.name,
            isUserCreated ? userThinkerData?.id : undefined
          );
          setIsFavorited(favorited);
        } catch (error) {
          console.error('Error loading enhanced thinker data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadEnhancedData();
  }, [isOpen, thinker.name, isUserCreated, userThinkerData]);

  const loadTeamData = async () => {
    try {
      setTeamLoadState('loading');
      
      // First get the team from DB using the same logic as ThinkerDetailModal
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
          setTeamLoadState('loaded');
          return;
        }
      }

      // Fallback to localStorage
      const localTeam = localStorage.getItem(`team-${thinker.name}`);
      if (localTeam) {
        setTeamMembers(JSON.parse(localTeam));
        setTeamLoadState('fallback');
        return;
      }

      // Final fallback to hard-coded team
      const expandedThinker = getExpandedThinker(thinker.name);
      if (expandedThinker?.hardCodedTeam) {
        setTeamMembers(expandedThinker.hardCodedTeam);
        setTeamLoadState('fallback');
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      // On error, try localStorage fallback
      const localTeam = localStorage.getItem(`team-${thinker.name}`);
      if (localTeam) {
        setTeamMembers(JSON.parse(localTeam));
        setTeamLoadState('fallback');
      } else {
        const expandedThinker = getExpandedThinker(thinker.name);
        if (expandedThinker?.hardCodedTeam) {
          setTeamMembers(expandedThinker.hardCodedTeam);
          setTeamLoadState('fallback');
        }
      }
    }
  };

  const handleGenerateProfile = async () => {
    if (isUserCreated) return; // User thinkers don't need profile generation
    
    setIsGenerating(true);
    try {
      const result = await thinkerService.generateProfile(thinker.name);
      if (result.success) {
        toast({
          title: "Profile Generated",
          description: `Deep profile for ${thinker.name} has been generated successfully.`,
        });
        // Reload enhanced data
        const enhanced = await thinkerService.getEnhancedThinker(thinker.name);
        setEnhancedThinker(enhanced);
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
      setIsGenerating(false);
    }
  };

  const handleGenerateTeam = async () => {
    if (isUserCreated) return; // User thinkers don't support teams yet
    
    setIsGenerating(true);
    try {
      const result = await thinkerService.generateTeam(thinker.name);
      if (result.success) {
        toast({
          title: "Team Generated",
          description: `Dream team for ${thinker.name} has been assembled successfully.`,
        });
        // Reload enhanced data
        const enhanced = await thinkerService.getEnhancedThinker(thinker.name);
        setEnhancedThinker(enhanced);
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
      setIsGenerating(false);
    }
  };

  const handleToggleFavorite = async () => {
    setIsUpdatingFavorite(true);
    try {
      if (isFavorited) {
        // Remove from favorites - need to get the favorite ID first
        const { data: favorites } = await userThinkerService.getFavorites();
        const favorite = favorites?.find(f => 
          isUserCreated ? f.user_thinker_id === userThinkerData?.id : f.thinker_name === thinker.name
        );
        
        if (favorite) {
          const { error } = await userThinkerService.removeFromFavorites(favorite.id);
          if (error) throw error;
          setIsFavorited(false);
          toast({
            title: "Removed from favorites",
            description: `${thinker.name} has been removed from your favorites.`,
          });
        }
      } else {
        // Add to favorites
        const { error } = isUserCreated && userThinkerData 
          ? await userThinkerService.addUserThinkerToFavorites(userThinkerData.id)
          : await userThinkerService.addBuiltInToFavorites(thinker.name);
        
        if (error) throw error;
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: `${thinker.name} has been added to your favorites.`,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingFavorite(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {thinker.name}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {thinker.area}
                </Badge>
                <Badge 
                  className={`text-xs border ${getLobeColor(thinker.lobe)}`}
                  variant="outline"
                >
                  {thinker.lobe}
                </Badge>
                {isUserCreated && (
                  <Badge className="text-xs bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Custom Guru
                  </Badge>
                )}
                {enhancedThinker?.hasDeepProfile && !isUserCreated && (
                  <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Deep profile available
                  </Badge>
                )}
                {enhancedThinker?.hasTeam && (
                  <Badge className="text-xs bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
                    <Users className="w-3 h-3 mr-1" />
                    Dream team ready
                  </Badge>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              disabled={isUpdatingFavorite}
              className={`ml-4 ${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
            >
              {isUpdatingFavorite ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isFavorited ? (
                <Heart className="w-4 h-4 fill-current" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            {!isUserCreated && (
              <TabsTrigger value="team" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
                <Users className="w-3 h-3" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="chat" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            {!isUserCreated && (
              <TabsTrigger value="team-chat" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
                <Users className="w-3 h-3" />
                <span className="hidden sm:inline">Team Chat</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="applications" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Author statements</span>
            </TabsTrigger>
            <TabsTrigger value="bio" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <Brain className="w-3 h-3" />
              <span className="hidden sm:inline">Bio</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Core Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand" />
                  Core Framework
                  {!enhancedThinker?.hasDeepProfile && !isUserCreated && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleGenerateProfile}
                      disabled={isGenerating}
                      className="ml-auto"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Generate Deep Profile
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Render content based on thinker type */}
                {isUserCreated && userThinkerData ? (
                  /* User-created thinker rendering */
                  <div className="space-y-4">
                    {userThinkerData.deep_profile?.summary && (
                      <p className="text-sm leading-relaxed">{userThinkerData.deep_profile.summary}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Original Insight</h4>
                        <p className="text-sm">{userThinkerData.core_idea}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">AI-Era Shift</h4>
                        <p className="text-sm">{userThinkerData.ai_shift}</p>
                      </div>
                    </div>

                    {/* Render deep profile sections if available */}
                    {userThinkerData.deep_profile?.keyConcepts && userThinkerData.deep_profile.keyConcepts.length > 0 && (
                      <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-blue-600" />
                          Key Concepts
                        </h4>
                        <ul className="space-y-2">
                          {userThinkerData.deep_profile.keyConcepts.map((concept, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              {concept}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {userThinkerData.deep_profile?.whyItMatters && (
                      <div className="border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-green-600" />
                          Why It Matters
                        </h4>
                        <p className="text-sm leading-relaxed">{userThinkerData.deep_profile.whyItMatters}</p>
                      </div>
                    )}

                    {userThinkerData.cross_era_relevance?.ai_relevance && (
                      <div className="border rounded-lg p-4 bg-purple-50/50 dark:bg-purple-950/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                          <Brain className="w-4 h-4 text-purple-600" />
                          AI Relevance
                        </h4>
                        <p className="text-sm leading-relaxed">{userThinkerData.cross_era_relevance.ai_relevance}</p>
                      </div>
                    )}
                  </div>
                ) : enhancedThinker?.profileData ? (
                  /* DB-first rendering for built-in thinkers */
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">
                        {enhancedThinker.profileData.ai_shift || thinker.aiShift}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Original Insight</h4>
                          <p className="text-sm">{thinker.coreIdea}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">AI-Era Shift</h4>
                          <p className="text-sm">{thinker.aiShift}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Relevance from DB */}
                    {enhancedThinker.profileData.cross_era_relevance?.ai_relevance && (
                      <div className="border rounded-lg p-4 bg-purple-50/50 dark:bg-purple-950/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                          <Brain className="w-4 h-4 text-purple-600" />
                          AI Relevance
                        </h4>
                        <p className="text-sm leading-relaxed">
                          {enhancedThinker.profileData.cross_era_relevance.ai_relevance}
                        </p>
                      </div>
                    )}

                    {/* Cross-Era Evolution Summary from DB */}
                    {enhancedThinker.profileData.cross_era_relevance?.cross_era_relevance && (
                      <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          Cross-Era Evolution
                        </h4>
                        <p className="text-sm leading-relaxed">
                          {enhancedThinker.profileData.cross_era_relevance.cross_era_relevance}
                        </p>
                      </div>
                    )}

                    {/* Implementation Timeline from DB */}
                    {enhancedThinker.profileData.cross_era_relevance?.implementation_timeline && (
                      <div className="border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-green-600" />
                          Implementation Timeline
                        </h4>
                        <div className="space-y-3">
                          {enhancedThinker.profileData.cross_era_relevance.implementation_timeline.phase_1 && (
                            <div>
                              <h5 className="font-medium text-xs text-green-700 dark:text-green-300 mb-1">Phase 1 (0-6 months)</h5>
                              <p className="text-sm">{enhancedThinker.profileData.cross_era_relevance.implementation_timeline.phase_1}</p>
                            </div>
                          )}
                          {enhancedThinker.profileData.cross_era_relevance.implementation_timeline.phase_2 && (
                            <div>
                              <h5 className="font-medium text-xs text-green-700 dark:text-green-300 mb-1">Phase 2 (6-18 months)</h5>
                              <p className="text-sm">{enhancedThinker.profileData.cross_era_relevance.implementation_timeline.phase_2}</p>
                            </div>
                          )}
                          {enhancedThinker.profileData.cross_era_relevance.implementation_timeline.phase_3 && (
                            <div>
                              <h5 className="font-medium text-xs text-green-700 dark:text-green-300 mb-1">Phase 3 (18+ months)</h5>
                              <p className="text-sm">{enhancedThinker.profileData.cross_era_relevance.implementation_timeline.phase_3}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Related Thinkers from DB */}
                    {enhancedThinker.profileData.related_thinkers && enhancedThinker.profileData.related_thinkers.length > 0 && (
                      <div className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-amber-600" />
                          Related Thinkers
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {enhancedThinker.profileData.related_thinkers.map((relatedName: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {relatedName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : expandedThinker?.coreFramework ? (
                  <>
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">{expandedThinker.coreFramework.summary}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Original Insight</h4>
                          <p className="text-sm">{thinker.coreIdea}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">AI-Era Shift</h4>
                          <p className="text-sm">{thinker.aiShift}</p>
                        </div>
                      </div>
                    </div>

                    <Collapsible open={showMoreFramework} onOpenChange={setShowMoreFramework}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          Show deeper framework guidance
                          <ChevronDown className={`h-4 w-4 transition-transform ${showMoreFramework ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-4 mt-4">
                        {/* Key Concepts */}
                        <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
                          <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            Key Concepts
                          </h4>
                          <ul className="space-y-2">
                            {expandedThinker.coreFramework.keyConcepts.map((concept, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                {concept}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Why It Matters */}
                        <div className="border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
                          <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-green-600" />
                            Why It Matters
                          </h4>
                          <p className="text-sm leading-relaxed">{expandedThinker.coreFramework.whyItMatters}</p>
                        </div>

                        {/* AI Implications */}
                        <div className="border rounded-lg p-4 bg-purple-50/50 dark:bg-purple-950/20">
                          <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                            <Brain className="w-4 h-4 text-purple-600" />
                            AI Implications
                          </h4>
                          <p className="text-sm leading-relaxed">{expandedThinker.coreFramework.aiImplications}</p>
                        </div>

                        {/* Recommended Practices */}
                        <div className="border rounded-lg p-4 bg-emerald-50/50 dark:bg-emerald-950/20">
                          <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            Recommended Practices
                          </h4>
                          <ul className="space-y-2">
                            {expandedThinker.coreFramework.recommendedPractices.map((practice, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                                {practice}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Common Pitfalls */}
                        <div className="border rounded-lg p-4 bg-red-50/50 dark:bg-red-950/20">
                          <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            Common Pitfalls
                          </h4>
                          <ul className="space-y-2">
                            {expandedThinker.coreFramework.commonPitfalls.map((pitfall, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                                {pitfall}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Success Metrics */}
                        <div className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20">
                          <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-amber-600" />
                            Success Metrics
                          </h4>
                          <ul className="space-y-2">
                            {expandedThinker.coreFramework.successMetrics.map((metric, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                ) : (
                  // Fallback for thinkers without expanded framework
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Original Insight</h4>
                      <p className="text-sm">{thinker.coreIdea}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">AI-Era Shift</h4>
                      <p className="text-sm">{thinker.aiShift}</p>
                    </div>
                    {!isUserCreated && (
                      <div className="mt-4 p-4 border rounded-lg bg-blue-50/30 dark:bg-blue-950/20">
                        <p className="text-sm text-muted-foreground mb-3">
                          This thinker doesn't have a deep profile yet. Generate one to unlock:
                        </p>
                        <ul className="text-sm space-y-1 mb-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Cross-era evolution analysis
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Detailed implementation roadmap
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Usage prompts and applications
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cross-Era Evolution */}
            {expandedThinker && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cross-Era Evolution</CardTitle>
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
          </TabsContent>

          {!isUserCreated && (
            <TabsContent value="team">
              <div className="space-y-4">
                {!enhancedThinker?.hasTeam && (
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="font-medium">No Team Assembled Yet</h3>
                          <p className="text-sm text-muted-foreground">Generate a dream team for {thinker.name}</p>
                        </div>
                        <Button 
                          onClick={handleGenerateTeam}
                          disabled={isGenerating}
                          className="mt-4"
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2" />
                          )}
                          Assemble Dream Team
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <ThinkerTeamSection
                  thinkerName={thinker.name}
                  thinkerArea={thinker.area}
                  coreIdea={thinker.coreIdea}
                  aiShift={thinker.aiShift}
                />
              </div>
            </TabsContent>
          )}

          <TabsContent value="chat">
            {isUserCreated ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium">Chat Coming Soon</h3>
                      <p className="text-sm text-muted-foreground">Chat functionality for custom gurus is in development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : expandedThinker ? (
              <ThinkerChat thinker={expandedThinker} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium">Chat Unavailable</h3>
                      <p className="text-sm text-muted-foreground">Generate a deep profile first to enable chat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {!isUserCreated && (
            <TabsContent value="team-chat">
              {teamLoadState === 'fallback' && (
                <Card className="mb-4 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Fallback team shown</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                      Using saved or hard-coded team data. Build a new team for latest Neural Ennead members.
                    </p>
                  </CardContent>
                </Card>
              )}
              <ThinkerTeamChat 
                thinkerName={thinker.name}
                thinkerArea={thinker.area}
                coreIdea={thinker.coreIdea}
                aiShift={thinker.aiShift}
                assignedTeam={teamMembers}
              />
            </TabsContent>
          )}

          <TabsContent value="applications" className="space-y-4">
            {/* Render applications based on thinker type */}
            {isUserCreated && userThinkerData ? (
              /* User-created thinker applications */
              <div className="space-y-4">
                {userThinkerData.usage_prompts && userThinkerData.usage_prompts.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Usage Prompts</h3>
                    <div className="grid gap-4">
                      {userThinkerData.usage_prompts.map((prompt: string, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <p className="text-sm">{prompt}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}

                {userThinkerData.practical_applications && userThinkerData.practical_applications.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Practical Applications</h3>
                    <div className="grid gap-4">
                      {userThinkerData.practical_applications.map((app: string, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <p className="text-sm">{app}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}

                {(!userThinkerData.usage_prompts || userThinkerData.usage_prompts.length === 0) &&
                 (!userThinkerData.practical_applications || userThinkerData.practical_applications.length === 0) && (
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <Zap className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="font-medium">No Applications Added</h3>
                          <p className="text-sm text-muted-foreground">No usage prompts or applications were added for this guru</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              /* Built-in thinker applications - keep existing code the same */
              <>
                {/* DB-first rendering for applications */}
                {enhancedThinker?.profileData?.usage_prompts?.prompts ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Usage Prompts</h3>
                    <div className="grid gap-4">
                      {enhancedThinker.profileData.usage_prompts.prompts.map((prompt: string, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <p className="text-sm">{prompt}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}

                {enhancedThinker?.profileData?.practical_applications?.applications ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Practical Applications</h3>
                    <div className="grid gap-4">
                      {enhancedThinker.profileData.practical_applications.applications.map((app: string, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <p className="text-sm">{app}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Fallback to local expanded thinker data */}
                {!enhancedThinker?.profileData && expandedThinker?.usagePrompts ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Usage Examples</h3>
                    {expandedThinker.usagePrompts.map((prompt, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base">{prompt.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Context</h5>
                            <p className="text-sm">{prompt.context}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Application</h5>
                            <p className="text-sm">{prompt.application}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : null}

                {/* Final fallback when no applications available */}
                {!enhancedThinker?.profileData?.usage_prompts?.prompts && 
                 !enhancedThinker?.profileData?.practical_applications?.applications && 
                 !expandedThinker?.usagePrompts && (
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <Zap className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="font-medium">No Applications Available</h3>
                          <p className="text-sm text-muted-foreground">Generate a deep profile to see usage examples</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="bio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand" />
                  About {thinker.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {isUserCreated && userThinkerData?.bio 
                    ? userThinkerData.bio
                    : expandedThinker?.bio || `${thinker.name} is a leading thinker in ${thinker.area}, best known for ${thinker.coreIdea}. Their work has significant implications for how we approach AI development and deployment in the modern era.`}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
