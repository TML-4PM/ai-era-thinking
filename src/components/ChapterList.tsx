import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Chapter {
  id?: string | number;
  title: string;
  sections?: string[];
  progress: number;
  chapter_order?: number;
}

interface ChapterListProps {
  chapters: Chapter[];
  bookSlug: string;
}

export const ChapterList = ({ chapters, bookSlug }: ChapterListProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const sortedChapters = [...chapters].sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0));
  const visibleChapters = showAll ? sortedChapters : sortedChapters.slice(0, 5);
  const hasMore = chapters.length > 5;

  return (
    <div className="space-y-3">
      {visibleChapters.map((chapter, index) => (
        <Card key={chapter.id || index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {chapter.chapter_order || index + 1}. {chapter.title}
                </h3>
                {Array.isArray(chapter.sections) && chapter.sections.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {chapter.sections.slice(0, 3).map((section: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                    {chapter.sections.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{chapter.sections.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Progress value={chapter.progress} className="w-16 h-2" />
                <span className="text-xs text-muted-foreground min-w-[3rem]">
                  {chapter.progress}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {hasMore && (
        <Button
          variant="outline"
          onClick={() => setShowAll(!showAll)}
          className="w-full"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show {chapters.length - 5} More Chapters
            </>
          )}
        </Button>
      )}
    </div>
  );
};
