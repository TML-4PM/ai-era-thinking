import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, CheckCircle, FileText, Lightbulb, Home, ArrowRight } from "lucide-react";
import { ContentLoader } from "@/components/content/ContentLoader";
import { ContentModel, Volume } from "@/types/content";
import { isPlaceholderParam } from "@/lib/route-guards";

const BookChapters = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: books } = useBooks();
  
  // Guard against placeholder params
  if (!slug || isPlaceholderParam(slug)) {
    return <Navigate to="/books" replace />;
  }
  
  const book = books?.find(book => book.slug === slug);

  if (!book) return null;

  // The Thinking Engine is NOT a Suite Hub book - it has chapters from master_4500
  const isSuiteHub = book.collection === "Suite Hub" && slug !== 'thinking-engine';
  const sortedChapters = book.chapters?.sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0)) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'seeded':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'scaffold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'seeded':
        return <FileText className="w-3 h-3" />;
      case 'scaffold':
        return <Lightbulb className="w-3 h-3" />;
      default:
        return <BookOpen className="w-3 h-3" />;
    }
  };

  const handleVolumeClick = (volume: Volume) => {
    if (volume.status === 'seeded' && volume.slug && slug) {
      navigate(`/books/${slug}/sections/${volume.slug}`);
    }
  };

  const handleChapterClick = (chapterIndex: number) => {
    // Navigate to static chapter page
    navigate(`/books/${slug}/chapter/${chapterIndex + 1}`);
  };

  // For Suite Hub books, redirect to Overview tab where volumes are shown
  if (isSuiteHub) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-card rounded-lg border p-8 text-center space-y-4">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Volumes are in the Overview Tab</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            For Suite Hub books like <strong>{book.title}</strong>, all volumes and content frameworks 
            are displayed in the Overview tab for a complete structural view.
          </p>
          <Button onClick={() => navigate(`/books/${slug}`)} size="lg">
            <Home className="w-4 h-4 mr-2" />
            Go to Overview
          </Button>
        </div>
      </div>
    );
  }

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
            <Card 
              key={chapter.id || index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleChapterClick(index)}
            >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChapterClick(index);
                    }}
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