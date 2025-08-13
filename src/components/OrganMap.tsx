import React from "react";
import { cn } from "@/lib/utils";
import { Lobe } from "@/data/thinkers";

interface OrganMapProps {
  selected?: Lobe | "All";
  onSelect?: (lobe: Lobe | "All") => void;
  className?: string;
}

const LOBES: { key: Lobe; label: string; x: number; y: number; w: number; h: number }[] = [
  { key: "Perception/Patterning", label: "Perception\nPatterning", x: 10, y: 20, w: 230, h: 120 },
  { key: "Decision/Action", label: "Decision\nAction", x: 270, y: 10, w: 220, h: 120 },
  { key: "Innovation/Strategy", label: "Innovation\nStrategy", x: 530, y: 30, w: 240, h: 120 },
  { key: "Ethics/Governance", label: "Ethics\nGovernance", x: 220, y: 150, w: 260, h: 120 },
  { key: "Culture/Behaviour", label: "Culture\nBehaviour", x: 500, y: 170, w: 230, h: 120 },
];

export const OrganMap: React.FC<OrganMapProps> = ({ selected = "All", onSelect, className }) => {
  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 800 320" className="w-full h-auto" aria-label="Agentic AI organ map">
        <defs>
          <linearGradient id="lobeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand))" />
            <stop offset="100%" stopColor="hsl(var(--brand-2))" />
          </linearGradient>
        </defs>

        {LOBES.map((lobe, idx) => {
          const isActive = selected === "All" || selected === lobe.key;
          return (
            <g key={lobe.key} className={cn("transition-all", isActive ? "opacity-100" : "opacity-40")}
               onClick={() => onSelect?.(lobe.key)} cursor="pointer" >
              <rect x={lobe.x} y={lobe.y} rx={28} ry={28} width={lobe.w} height={lobe.h}
                    fill="url(#lobeGradient)" className="[filter:drop-shadow(0_10px_30px_hsl(var(--brand)/0.25))]" />
              <text x={lobe.x + lobe.w / 2} y={lobe.y + lobe.h / 2}
                    className="fill-[hsl(var(--primary-foreground))] text-center font-semibold select-none"
                    dominantBaseline="middle" textAnchor="middle">
                {lobe.label}
              </text>
            </g>
          );
        })}

        {/* connective lines */}
        <g stroke="hsl(var(--brand-2))" strokeOpacity="0.5" strokeWidth="2">
          <path d="M 120 80 C 200 40, 320 40, 380 60" fill="none" />
          <path d="M 380 60 C 460 80, 560 80, 650 90" fill="none" />
          <path d="M 340 200 C 340 140, 380 120, 380 60" fill="none" />
          <path d="M 600 210 C 600 150, 600 120, 650 90" fill="none" />
        </g>
      </svg>
      <div className="flex justify-center gap-2 mt-2">
        <button onClick={() => onSelect?.("All")} className={cn("text-sm px-3 py-1 rounded-md border", selected === "All" ? "bg-accent text-accent-foreground" : "bg-background hover:bg-accent/50")}>All</button>
      </div>
    </div>
  );
};

export default OrganMap;
