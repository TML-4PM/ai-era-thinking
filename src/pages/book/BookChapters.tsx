import { useParams } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, CheckCircle } from "lucide-react";

const BookChapters = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  const book = books?.find(book => book.slug === slug);

  if (!book) return null;

  const sortedChapters = book.chapters?.sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0)) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Chapters</h1>
        <p className="text-lg text-muted-foreground">
          Explore all chapters in {book.title}. Track your progress and dive deep into each section.
        </p>
      </div>

      {sortedChapters.length > 0 ? (
        <div className="space-y-6">
          {sortedChapters.map((chapter, index) => (
            <Card key={chapter.id || index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {chapter.chapter_order || index + 1}
                        </div>
                        {chapter.title}
                      </div>
                    </CardTitle>
                    
                    {Array.isArray(chapter.sections) && chapter.sections.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {chapter.sections.map((section: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 ml-6">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={chapter.progress} className="w-20 h-2" />
                        <span className="text-sm font-medium min-w-[3rem]">
                          {chapter.progress}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chapter.progress === 100 ? 'Completed' : chapter.progress > 0 ? 'In Progress' : 'Not Started'}
                      </div>
                    </div>
                    
                    {chapter.progress === 100 ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Play className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {Array.isArray(chapter.sections) ? chapter.sections.length : 0} sections
                    </span>
                    <span>•</span>
                    <span>
                      Est. {Math.max(5, (Array.isArray(chapter.sections) ? chapter.sections.length : 1) * 3)} min read
                    </span>
                  </div>
                  
                  <Button 
                    variant={chapter.progress > 0 ? "default" : "outline"}
                    size="sm"
                  >
                    {chapter.progress === 100 ? 'Review' : chapter.progress > 0 ? 'Continue' : 'Start Reading'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary Stats */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sortedChapters.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Chapters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sortedChapters.filter(ch => ch.progress === 100).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sortedChapters.filter(ch => ch.progress > 0 && ch.progress < 100).length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(sortedChapters.reduce((acc, ch) => acc + (ch.progress || 0), 0) / sortedChapters.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center text-muted-foreground">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Chapters Yet</h3>
            <p>This book is still being developed. Check back soon for new content!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookChapters;