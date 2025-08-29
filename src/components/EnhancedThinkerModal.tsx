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
  Loader2
} from "lucide-react";
import { Thinker } from "@/data/thinkers";
import { getExpandedThinker } from "@/data/expanded-thinkers";
import { ThinkerTeamSection } from "./ThinkerTeamSection";
import { ThinkerChat } from "./ThinkerChat";
import { ThinkerTeamChat } from "./ThinkerTeamChat";
import { thinkerService, type EnhancedThinker } from "@/services/ThinkerService";
import { useToast } from "@/hooks/use-toast";

interface EnhancedThinkerModalProps {
  thinker: Thinker;
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedThinkerModal: React.FC<EnhancedThinkerModalProps> = ({ 
  thinker, 
  isOpen, 
  onClose 
}) => {
  const [enhancedThinker, setEnhancedThinker] = useState<EnhancedThinker | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMoreFramework, setShowMoreFramework] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const expandedThinker = getExpandedThinker(thinker.name);

  useEffect(() => {
    const loadEnhancedData = async () => {
      if (isOpen) {
        try {
          const enhanced = await thinkerService.getEnhancedThinker(thinker.name);
          setEnhancedThinker(enhanced);
        } catch (error) {
          console.error('Error loading enhanced thinker data:', error);
        }
      }
    };

    loadEnhancedData();
  }, [isOpen, thinker.name]);

  const handleGenerateProfile = async () => {
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
            {enhancedThinker?.hasDeepProfile && (
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
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-6 h-auto">
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
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="team-chat" className="flex items-center gap-1 px-2 py-2 text-xs whitespace-nowrap">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Team Chat</span>
            </TabsTrigger>
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
                  {!enhancedThinker?.hasDeepProfile && (
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
                {expandedThinker?.coreFramework ? (
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

          <TabsContent value="chat">
            {expandedThinker ? (
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

          <TabsContent value="team-chat">
            <ThinkerTeamChat 
              thinkerName={thinker.name}
              thinkerArea={thinker.area}
              coreIdea={thinker.coreIdea}
              aiShift={thinker.aiShift}
              assignedTeam={[]}
            />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {expandedThinker?.usagePrompts ? (
              <div className="space-y-4">
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
            ) : (
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
                  {expandedThinker?.bio || `${thinker.name} is a leading thinker in ${thinker.area}, best known for ${thinker.coreIdea}. Their work has significant implications for how we approach AI development and deployment in the modern era.`}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};