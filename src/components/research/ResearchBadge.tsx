import React from "react";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchBadgeProps {
  count: number;
  className?: string;
}

export const ResearchBadge: React.FC<ResearchBadgeProps> = ({ 
  count, 
  className 
}) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "flex items-center gap-1.5 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
        className
      )}
    >
      <FlaskConical className="w-3 h-3" />
      <span className="text-xs font-medium">
        {count} {count === 1 ? 'paper' : 'papers'}
      </span>
    </Badge>
  );
};
