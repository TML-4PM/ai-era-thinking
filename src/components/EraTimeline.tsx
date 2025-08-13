import React from "react";
import { cn } from "@/lib/utils";
import { ERAS } from "@/data/eras";
import { Link } from "react-router-dom";

interface EraTimelineProps {
  selectedEra?: string;
  onEraSelect?: (eraId: string) => void;
  className?: string;
}

export const EraTimeline: React.FC<EraTimelineProps> = ({ 
  selectedEra, 
  onEraSelect, 
  className 
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Technology Evolution</h3>
        <span className="text-sm text-muted-foreground">1990s → 2030+</span>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand via-brand-2 to-brand"></div>
        
        <div className="space-y-6">
          {ERAS.map((era, index) => {
            const isSelected = selectedEra === era.id;
            const isActive = !selectedEra || isSelected;
            
            return (
              <div key={era.id} className="relative">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-2 w-4 h-4 rounded-full border-2 transition-all",
                  isSelected 
                    ? "bg-brand border-brand scale-110 shadow-[0_0_20px_hsl(var(--brand)/0.5)]" 
                    : "bg-background border-border hover:border-brand"
                )}>
                  <div className={cn(
                    "absolute inset-1 rounded-full transition-all",
                    isSelected ? "bg-primary-foreground" : ""
                  )}></div>
                </div>
                
                {/* Era content */}
                <div className="ml-12">
                  <div 
                    className={cn(
                      "group cursor-pointer rounded-lg p-4 transition-all border",
                      isActive 
                        ? "bg-card border-border hover:border-brand/50" 
                        : "bg-muted/50 border-transparent opacity-60",
                      isSelected && "ring-1 ring-brand/50 bg-gradient-to-r from-brand/5 to-brand-2/5"
                    )}
                    onClick={() => onEraSelect?.(era.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={cn(
                        "font-semibold transition-colors",
                        isSelected ? "text-brand" : "text-foreground group-hover:text-brand"
                      )}>
                        {era.shortName}
                      </h4>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {era.timeframe}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {era.description}
                    </p>
                    
                    <p className="text-xs text-muted-foreground italic">
                      {era.culturalPosture}
                    </p>
                    
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <Link 
                          to={`/era/${era.id}`}
                          className="inline-flex items-center text-sm text-brand hover:text-brand-2 transition-colors"
                        >
                          Explore Deep Dive →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EraTimeline;