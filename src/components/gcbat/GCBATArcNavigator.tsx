import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GCBAT_ARCS } from "@/types/gcbat";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface GCBATArcNavigatorProps {
  bookSlug: string;
  chaptersProgress?: Record<number, number>;
}

export const GCBATArcNavigator = ({ bookSlug, chaptersProgress = {} }: GCBATArcNavigatorProps) => {
  const navigate = useNavigate();

  const calculateArcProgress = (arcNumber: number) => {
    const arc = GCBAT_ARCS.find(a => a.number === arcNumber);
    if (!arc) return 0;

    const [start, end] = arc.chapterRange;
    let totalProgress = 0;
    let chapterCount = 0;

    for (let i = start; i <= end; i++) {
      totalProgress += chaptersProgress[i] || 0;
      chapterCount++;
    }

    return chapterCount > 0 ? Math.round(totalProgress / chapterCount) : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5" />
        <h2 className="text-2xl font-bold">Story Arcs</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GCBAT_ARCS.map((arc) => {
          const progress = calculateArcProgress(arc.number);
          
          return (
            <Card
              key={arc.number}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/books/${bookSlug}/arc/${arc.number}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="outline">Arc {arc.number}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {arc.storyCount} stories
                  </span>
                </div>
                <CardTitle className="mt-2">{arc.name}</CardTitle>
                <CardDescription>{arc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
