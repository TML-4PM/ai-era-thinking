import React from "react";
import { cn } from "@/lib/utils";
import { ERAS } from "@/data/eras";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EraNavigationProps {
  className?: string;
}

export const EraNavigation: React.FC<EraNavigationProps> = ({ className }) => {
  const location = useLocation();
  
  return (
    <nav className={cn("flex flex-wrap gap-2", className)}>
      {ERAS.map((era) => {
        const isActive = location.pathname === `/era/${era.id}`;
        
        return (
          <Button
            key={era.id}
            asChild
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all",
              isActive && "bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
            )}
          >
            <Link to={`/era/${era.id}`}>
              {era.shortName}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default EraNavigation;