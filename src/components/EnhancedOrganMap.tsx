import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Lobe } from "@/data/thinkers";
import { ERAS } from "@/data/eras";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EnhancedOrganMapProps {
  selected?: Lobe | "All";
  onSelect?: (lobe: Lobe | "All") => void;
  selectedEra?: string;
  onEraSelect?: (era: string) => void;
  className?: string;
  showEraOverlay?: boolean;
}

const LOBES: { 
  key: Lobe; 
  label: string; 
  x: number; 
  y: number; 
  w: number; 
  h: number;
  description: string;
}[] = [
  { 
    key: "Perception/Patterning", 
    label: "Perception\nPatterning", 
    x: 10, 
    y: 20, 
    w: 230, 
    h: 120,
    description: "How we see, sense, and recognize patterns in complex systems"
  },
  { 
    key: "Decision/Action", 
    label: "Decision\nAction", 
    x: 270, 
    y: 10, 
    w: 220, 
    h: 120,
    description: "Converting insights into action with speed and accuracy"
  },
  { 
    key: "Innovation/Strategy", 
    label: "Innovation\nStrategy", 
    x: 530, 
    y: 30, 
    w: 240, 
    h: 120,
    description: "Creating new value and competitive advantage"
  },
  { 
    key: "Ethics/Governance", 
    label: "Ethics\nGovernance", 
    x: 220, 
    y: 150, 
    w: 260, 
    h: 120,
    description: "Ensuring safe, fair, and accountable operations"
  },
  { 
    key: "Culture/Behaviour", 
    label: "Culture\nBehaviour", 
    x: 500, 
    y: 170, 
    w: 230, 
    h: 120,
    description: "How humans and AI work together and adapt"
  },
];

// Era transition flow paths
const ERA_FLOWS = [
  { from: "on-prem", to: "cloud-native", path: "M 400 50 Q 450 30, 500 50" },
  { from: "cloud-native", to: "gen-ai", path: "M 500 50 Q 550 40, 600 60" },
  { from: "gen-ai", to: "agentic-ai", path: "M 600 60 Q 650 80, 700 100" },
  { from: "agentic-ai", to: "bci", path: "M 700 100 Q 750 120, 800 140" }
];

export const EnhancedOrganMap: React.FC<EnhancedOrganMapProps> = ({ 
  selected = "All", 
  onSelect, 
  selectedEra = "all",
  onEraSelect,
  showEraOverlay = false,
  className 
}) => {
  const [hoveredLobe, setHoveredLobe] = useState<Lobe | null>(null);
  const [showFlows, setShowFlows] = useState(false);

  return (
    <Card className={cn("relative p-6", className)}>
      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            onClick={() => onSelect?.("All")} 
            variant={selected === "All" ? "default" : "outline"}
            size="sm"
          >
            All Lobes
          </Button>
          <Button
            onClick={() => setShowFlows(!showFlows)}
            variant={showFlows ? "default" : "outline"}
            size="sm"
          >
            Era Flows
          </Button>
        </div>
        
        {showEraOverlay && (
          <div className="flex gap-1">
            <Button
              onClick={() => onEraSelect?.("all")}
              variant={selectedEra === "all" ? "default" : "outline"}
              size="sm"
            >
              All Eras
            </Button>
            {ERAS.map((era) => (
              <Button
                key={era.id}
                onClick={() => onEraSelect?.(era.id)}
                variant={selectedEra === era.id ? "default" : "outline"}
                size="sm"
              >
                {era.shortName}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* SVG Map */}
      <div className="relative">
        <svg viewBox="0 0 800 320" className="w-full h-auto" aria-label="Enhanced Agentic AI organ map">
          <defs>
            <linearGradient id="lobeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--brand))" />
              <stop offset="100%" stopColor="hsl(var(--brand-2))" />
            </linearGradient>
            <linearGradient id="activeLobeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--brand)/0.9)" />
              <stop offset="100%" stopColor="hsl(var(--brand-2)/0.9)" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Era flow lines */}
          {showFlows && (
            <g className="era-flows">
              {ERA_FLOWS.map((flow, idx) => (
                <path 
                  key={`${flow.from}-${flow.to}`}
                  d={flow.path}
                  className="era-flow-line"
                  fill="none"
                />
              ))}
            </g>
          )}

          {/* Connective lines between lobes */}
          <g stroke="hsl(var(--brand-2)/0.3)" strokeWidth="2" fill="none">
            <path d="M 120 80 C 200 40, 320 40, 380 60" />
            <path d="M 380 60 C 460 80, 560 80, 650 90" />
            <path d="M 340 200 C 340 140, 380 120, 380 60" />
            <path d="M 600 210 C 600 150, 600 120, 650 90" />
          </g>

          {/* Lobe elements */}
          {LOBES.map((lobe) => {
            const isActive = selected === "All" || selected === lobe.key;
            const isHovered = hoveredLobe === lobe.key;
            
            return (
              <g 
                key={lobe.key} 
                className={cn(
                  "lobe-transition cursor-pointer",
                  isActive ? "lobe-active" : "opacity-60",
                  isHovered && "opacity-100"
                )}
                onClick={() => onSelect?.(lobe.key)}
                onMouseEnter={() => setHoveredLobe(lobe.key)}
                onMouseLeave={() => setHoveredLobe(null)}
              >
                <rect 
                  x={lobe.x} 
                  y={lobe.y} 
                  rx={28} 
                  ry={28} 
                  width={lobe.w} 
                  height={lobe.h}
                  fill={isActive ? "url(#activeLobeGradient)" : "url(#lobeGradient)"}
                  filter={isActive ? "url(#glowFilter)" : undefined}
                  className="[filter:drop-shadow(0_10px_30px_hsl(var(--brand)/0.25))]" 
                />
                <text 
                  x={lobe.x + lobe.w / 2} 
                  y={lobe.y + lobe.h / 2}
                  className="fill-[hsl(var(--primary-foreground))] text-center font-semibold select-none"
                  dominantBaseline="middle" 
                  textAnchor="middle"
                  fontSize="14"
                >
                  {lobe.label}
                </text>
                
                {/* Era indicators */}
                {showEraOverlay && selectedEra !== "all" && (
                  <circle
                    cx={lobe.x + lobe.w - 20}
                    cy={lobe.y + 20}
                    r={8}
                    fill="hsl(var(--brand-2))"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Lobe description overlay */}
        {hoveredLobe && (
          <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3">
            <h4 className="font-semibold text-sm">{hoveredLobe}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {LOBES.find(l => l.key === hoveredLobe)?.description}
            </p>
          </div>
        )}
      </div>

      {/* Era evolution indicator */}
      {showEraOverlay && (
        <div className="mt-4 text-center">
          <div className="text-sm font-medium mb-2">Era Evolution</div>
          <div className="flex justify-center items-center gap-2 text-xs">
            {ERAS.map((era, idx) => (
              <React.Fragment key={era.id}>
                <span 
                  className={cn(
                    "px-2 py-1 rounded transition-colors",
                    selectedEra === era.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  {era.shortName}
                </span>
                {idx < ERAS.length - 1 && <span className="text-muted-foreground">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedOrganMap;