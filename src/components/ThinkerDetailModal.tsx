import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Brain, Lightbulb, Quote, Users, Download, MessageCircle, BarChart3, Sparkles } from "lucide-react";
import { ExpandedThinker } from "@/data/expanded-thinkers";
import { ThinkerChat } from "./ThinkerChat";
import { FrameworkExpansion } from "./FrameworkExpansion";
import { computeTopicScores, computeEraScores } from "@/lib/scoring";
import { ERAS } from "@/data/eras";
import { cn } from "@/lib/utils";

interface ThinkerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  thinker: ExpandedThinker | null;
}

export const ThinkerDetailModal: React.FC<ThinkerDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  thinker 
}) => {
  if (!thinker) return null;

  const topicScores = computeTopicScores({ 
    name: thinker.name,
    area: thinker.area,
    coreIdea: thinker.coreIdea,
    aiShift: thinker.aiShift,
    lobe: thinker.lobe
  }, thinker);

  const eraScores = computeEraScores({ 
    name: thinker.name,
    area: thinker.area,
    coreIdea: thinker.coreIdea,
    aiShift: thinker.aiShift,
    lobe: thinker.lobe
  }, thinker);

  // Prepare chart data
  const topicChartData = Object.entries(topicScores).map(([topic, score]) => ({
    topic: topic.replace(/\//g, '/\n'),
    score: score
  }));

  const eraChartData = ERAS.map(era => ({
    era: era.shortName,
    score: eraScores[era.name] || 0
  }));

  const getLobeIcon = (lobe: string) => {
    switch (lobe.split("/")[0]) {
      case "Perception": return <Brain className="h-5 w-5" />;
      case "Decision": return <Lightbulb className="h-5 w-5" />;
      case "Innovation": return <BookOpen className="h-5 w-5" />;
      case "Ethics": return <Quote className="h-5 w-5" />;
      case "Culture": return <Users className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLobeColor = (lobe: string) => {
    switch (lobe.split("/")[0]) {
      case "Perception": return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "Decision": return "bg-green-500/10 text-green-700 dark:text-green-300";
      case "Innovation": return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
      case "Ethics": return "bg-red-500/10 text-red-700 dark:text-red-300";
      case "Culture": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";
      default: return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className={cn("p-2 rounded-lg", getLobeColor(thinker.lobe))}>
              {getLobeIcon(thinker.lobe)}
            </div>
            {thinker.name}
            <Badge variant="secondary" className="ml-auto">
              {thinker.lobe}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="h-[600px] flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="expand" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Expand
            </TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="overview" className="h-full">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Core Idea</h3>
                    <p className="text-sm">{thinker.coreIdea}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">AI Transformation</h3>
                    <p className="text-sm">{thinker.aiShift}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Implementation Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800">Immediate</Badge>
                        <p className="text-sm">{thinker.practicalApplications.immediate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium-term</Badge>
                        <p className="text-sm">{thinker.practicalApplications.mediumTerm}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Long-term</Badge>
                        <p className="text-sm">{thinker.practicalApplications.longTerm}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="chat" className="h-full">
              <ThinkerChat thinker={thinker} />
            </TabsContent>

            <TabsContent value="expand" className="h-full">
              <FrameworkExpansion thinker={thinker} />
            </TabsContent>

            <TabsContent value="related" className="h-full">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 pr-4">
                  <h3 className="font-semibold">Related Thinkers</h3>
                  {thinker.relatedThinkers.map((name, i) => (
                    <div key={i} className="p-2 border rounded">{name}</div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ThinkerDetailModal;