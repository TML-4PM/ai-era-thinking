import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Brain, Lightbulb, Zap, Users } from "lucide-react";
import { Thinker } from "@/data/thinkers";
import { getExpandedThinker } from "@/data/expanded-thinkers";
import { ThinkerChat } from "./ThinkerChat";
import ThinkerWorkfamilyChat from "./ThinkerWorkfamilyChat";

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
  const [activeTab, setActiveTab] = useState("duo-chat");

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="duo-chat" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Duo Chat
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Applications
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

            {/* Cross-Era Relevance */}
            {expandedThinker && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cross-Era Evolution</CardTitle>
                  <CardDescription>
                    How {thinker.name}'s framework applies across technological eras
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(expandedThinker.crossEraRelevance).map(([era, description]) => (
                    <div key={era} className="space-y-2">
                      <Badge className={eraColors[era as keyof typeof eraColors]}>
                        {eraMapping[era as keyof typeof eraMapping]}
                      </Badge>
                      <p className="text-sm text-muted-foreground pl-2">{description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Practical Applications */}
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

            {/* Related Thinkers */}
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

          <TabsContent value="duo-chat">
            <ThinkerWorkfamilyChat
              thinkerName={thinker.name}
              thinkerArea={thinker.area}
              coreIdea={thinker.coreIdea}
              aiShift={thinker.aiShift}
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
