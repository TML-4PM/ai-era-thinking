import { useParams, useNavigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, CheckCircle, FileText, Lightbulb } from "lucide-react";
import { ContentLoader } from "@/components/content/ContentLoader";
import { ContentModel, Volume } from "@/types/content";

const BookChapters = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: books } = useBooks();
  const book = books?.find(book => book.slug === slug);

  if (!book) return null;

  const isSuiteHub = book.collection === "Suite Hub";
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
    if (volume.status === 'seeded' && volume.slug) {
      navigate(`/section-content/${volume.slug}`);
    }
  };

  if (isSuiteHub) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Volumes</h1>
          <p className="text-lg text-muted-foreground">
            Explore all volumes in {book.title}. Each volume focuses on a specific aspect of technology for humanity.
          </p>
        </div>

        <ContentLoader bookSlug={slug!}>
          {({ content, loading, error }) => {
            if (loading) {
              return (
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            }

            if (error || !content) {
              return (
                <Card className="border-dashed border-destructive/50">
                  <CardContent className="p-12 text-center text-destructive">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Content Not Available</h3>
                    <p>Unable to load volume content. Please try again later.</p>
                  </CardContent>
                </Card>
              );
            }

            const volumes = content.volumes || [];
            const seededVolumes = volumes.filter(v => v.status === 'seeded');
            const scaffoldVolumes = volumes.filter(v => v.status === 'scaffold');

            return (
              <div className="space-y-6">
                {volumes.map((volume, index) => (
                  <Card key={volume.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                {volume.id}
                              </div>
                              {volume.title}
                            </div>
                          </CardTitle>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {volume.lead}
                          </p>

                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(volume.status)}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(volume.status)}
                                {volume.status === 'seeded' ? 'Content Available' : 'In Development'}
                              </div>
                            </Badge>
                            {volume.exemplarCount && (
                              <Badge variant="secondary">
                                {volume.exemplarCount} exemplars
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-6">
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <Progress value={volume.status === 'seeded' ? 100 : 25} className="w-20 h-2" />
                              <span className="text-sm font-medium min-w-[3rem]">
                                {volume.status === 'seeded' ? '100%' : '25%'}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {volume.status === 'seeded' ? 'Content Ready' : 'Framework Set'}
                            </div>
                          </div>
                          
                          {volume.status === 'seeded' ? (
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
                            {volume.exemplarCount || 0} exemplars
                          </span>
                          <span>•</span>
                          <span>
                            Est. {Math.max(10, (volume.exemplarCount || 1) * 2)} min read
                          </span>
                        </div>
                        
                        <Button 
                          variant={volume.status === 'seeded' ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVolumeClick(volume)}
                          disabled={volume.status === 'scaffold'}
                        >
                          {volume.status === 'seeded' ? 'Explore Content' : 'Coming Soon'}
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
                          {volumes.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Volumes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {seededVolumes.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Content Ready</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {scaffoldVolumes.length}
                        </div>
                        <div className="text-sm text-muted-foreground">In Development</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {Math.round((seededVolumes.length / volumes.length) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Overall Progress</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          }}
        </ContentLoader>
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