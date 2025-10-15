import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Lightbulb, Quote, Sparkles, ExternalLink } from "lucide-react";
import { ExpandedThinker, getExpandedThinker } from "@/data/expanded-thinkers";
import { Thinker } from "@/data/thinkers";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
  const [hasDeepProfile, setHasDeepProfile] = useState<boolean | null>(null);

  // Check for DB profile existence with session cache
  useEffect(() => {
    const checkProfileExists = async () => {
      const cacheKey = `profile-exists-${thinker.name}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached !== null) {
        setHasDeepProfile(cached === 'true');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('thinker_profiles')
          .select('id')
          .eq('thinker_name', thinker.name)
          .maybeSingle();

        const exists = !error && !!data;
        setHasDeepProfile(exists);
        sessionStorage.setItem(cacheKey, exists.toString());
      } catch (error) {
        console.error('Error checking profile existence:', error);
        setHasDeepProfile(false);
      }
    };

    checkProfileExists();
  }, [thinker.name]);

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
          <div className="flex items-center gap-2">
            {hasDeepProfile && (
              <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Deep profile
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1">
              {thinker.lobe.split("/")[0]}
            </Badge>
          </div>
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
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 btn-enhanced"
                onClick={() => onExplore?.(thinker.name)}
              >
                Explore Deep Profile
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-1"
                onClick={() => window.open(`https://the-neural-research-hub.lovable.app/thinkers?search=${encodeURIComponent(thinker.name)}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
                Research
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThinkerCard;