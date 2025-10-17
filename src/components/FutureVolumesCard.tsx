import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UPCOMING_BOOKS } from "@/data/upcoming-books";

interface FutureVolumesCardProps {
  className?: string;
}

export const FutureVolumesCard: React.FC<FutureVolumesCardProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // Get 3 random upcoming books for preview
  const previewBooks = UPCOMING_BOOKS.slice(0, 3);
  const totalUpcoming = 12; // Total planned volumes

  return (
    <Card className={`group relative overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 ${className}`}>
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 opacity-50" />
      
      <CardHeader className="relative text-center pt-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <Badge className="mx-auto mb-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          {totalUpcoming}+ Volumes in Planning
        </Badge>
        <h3 className="text-2xl font-bold">Future Volumes</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Expanding the collection with additional volumes across multiple domains
        </p>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Preview titles include:</p>
          <ul className="space-y-1 text-sm">
            {previewBooks.map((book, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{book.title}</span>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span className="text-muted-foreground italic">...and {totalUpcoming - 3} more</span>
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full group/btn"
            variant="outline"
            onClick={() => {
              // For now, scroll to top or navigate to books home
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span>Explore Future Volumes</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          New volumes are being planned and will be announced throughout 2025-2026
        </p>
      </CardContent>
    </Card>
  );
};
