import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Lightbulb, Quote } from "lucide-react";
import { ExpandedThinker, getExpandedThinker } from "@/data/expanded-thinkers";
import { Thinker } from "@/data/thinkers";
import { cn } from "@/lib/utils";

interface ThinkerCardProps {
  thinker: Thinker;
  className?: string;
  onExplore?: (name: string) => void;
}

export const ThinkerCard: React.FC<ThinkerCardProps> = ({ 
  thinker, 
  className,
  onExplore 
}) => {
  const expanded = getExpandedThinker(thinker.name);
  const hasExpanded = !!expanded;

  const getLobeIcon = (lobe: string) => {
    switch (lobe.split("/")[0]) {
      case "Perception": return <Brain className="h-4 w-4" />;
      case "Decision": return <Lightbulb className="h-4 w-4" />;
      case "Innovation": return <BookOpen className="h-4 w-4" />;
      case "Ethics": return <Quote className="h-4 w-4" />;
      case "Culture": return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn(
      "thinker-card group relative overflow-hidden",
      hasExpanded && "cursor-pointer",
      className
    )}>
      {/* Enhanced visual effects */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getLobeIcon(thinker.lobe)}
            {thinker.name}
          </span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {thinker.lobe.split("/")[0]}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 relative z-10">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{thinker.area}</span> — {thinker.coreIdea}
        </div>
        
        <div>
          <span className="text-sm font-medium text-accent-foreground">AI Shift:</span>
          <p className="text-sm text-muted-foreground mt-1">{thinker.aiShift}</p>
        </div>

        {/* Enhanced features for expanded thinkers */}
        {expanded && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Enhanced insights:</span> Advanced cross-era analysis and practical applications available
            </div>
            
            {Array.isArray(expanded.relatedThinkers) && expanded.relatedThinkers.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {expanded.relatedThinkers.slice(0, 2).map((related) => (
                  <Badge key={related} variant="outline" className="text-xs">
                    {related}
                  </Badge>
                ))}
                {expanded.relatedThinkers.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{expanded.relatedThinkers.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full btn-enhanced"
              onClick={() => onExplore?.(thinker.name)}
            >
              Explore Deep Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThinkerCard;