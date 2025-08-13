import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Brain, Lightbulb, Quote, Users, ArrowRight, Download } from "lucide-react";
import { ExpandedThinker } from "@/data/expanded-thinkers";
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <div className="space-y-6">
          {/* Core Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Core Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-sm">Area:</span>
                    <p className="text-muted-foreground">{thinker.area}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Core Idea:</span>
                    <p className="text-muted-foreground">{thinker.coreIdea}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Transformation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{thinker.aiShift}</p>
              </CardContent>
            </Card>
          </div>

          {/* Cross-Era Relevance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cross-Era Relevance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(thinker.crossEraRelevance).map(([era, description]) => (
                  <div key={era} className="p-3 bg-gradient-subtle rounded-lg">
                    <h4 className="font-medium text-sm capitalize mb-1">
                      {era.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        {/* Usage Prompts */}
        {thinker.usagePrompts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Practical Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {thinker.usagePrompts.map((prompt, idx) => (
                  <div key={idx} className="p-3 bg-gradient-subtle rounded-lg border">
                    <h4 className="font-medium text-sm mb-2">{prompt.question}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      <span className="font-medium">Context:</span> {prompt.context}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Application:</span> {prompt.application}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Practical Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Implementation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <h4 className="font-medium text-sm text-green-700 dark:text-green-300">
                  Immediate (0-6 months)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {thinker.practicalApplications.immediate}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-300">
                  Medium Term (6-18 months)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {thinker.practicalApplications.mediumTerm}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300">
                  Long Term (18+ months)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {thinker.practicalApplications.longTerm}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Related Thinkers */}
          {Array.isArray(thinker.relatedThinkers) && thinker.relatedThinkers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Thinkers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {thinker.relatedThinkers.map((related) => (
                    <Badge key={related} variant="outline" className="text-sm">
                      {related}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Use this profile in workshops, strategy sessions, or AI transformation planning
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Profile
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThinkerDetailModal;