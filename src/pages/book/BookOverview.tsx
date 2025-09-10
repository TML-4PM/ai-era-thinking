import { useParams } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Target, CheckCircle, User, Calendar } from "lucide-react";

const BookOverview = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  const book = books?.find(book => book.slug === slug);

  if (!book) return null;

  const calculateAverageProgress = (chapters: any[]) => {
    if (!chapters || chapters.length === 0) return 0;
    const sum = chapters.reduce((acc, chapter) => acc + (chapter.progress || 0), 0);
    return Math.round(sum / chapters.length);
  };

  const averageProgress = calculateAverageProgress(book.chapters || []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Book Metadata */}
          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              {book.collection && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Collection:</span>
                  <p className="text-sm">{book.collection}</p>
                </div>
              )}
              {book.owner && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Owner:</span>
                  <p className="text-sm">{book.owner}</p>
                </div>
              )}
              {book.due_date && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Due Date:</span>
                  <p className="text-sm">{new Date(book.due_date).toLocaleDateString()}</p>
                </div>
              )}
              {book.ready_flag !== undefined && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <p className="text-sm flex items-center gap-1">
                    {book.ready_flag ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Ready for Review
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-yellow-500" />
                        In Development
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Book Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4">About This Book</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{book.lead}</p>
            </div>
          </section>

          {/* Key Topics */}
          <section>
            <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-primary" />
                    Core Concepts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Fundamental frameworks and methodologies</li>
                    <li>• Practical implementation strategies</li>
                    <li>• Real-world case studies and examples</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-primary" />
                    Community Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Expert thought leadership</li>
                    <li>• Community-contributed frameworks</li>
                    <li>• Interactive discussions and feedback</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Chapter Preview */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Chapter Overview</h2>
            {book.chapters && book.chapters.length > 0 ? (
              <div className="space-y-3">
                {book.chapters
                  .sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0))
                  .slice(0, 5) // Show first 5 chapters
                  .map((chapter, index) => (
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
                {book.chapters.length > 5 && (
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center text-muted-foreground">
                      <BookOpen className="w-6 h-6 mx-auto mb-2" />
                      <p>+ {book.chapters.length - 5} more chapters</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No chapters available yet.</p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Reading Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                    <span className="text-sm font-medium">{averageProgress}%</span>
                  </div>
                  <Progress value={averageProgress} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {book.chapters?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Chapters</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {book.chapters?.filter(ch => ch.progress === 100).length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Details */}
            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Collection</div>
                  <Badge variant="secondary">{book.collection || book.series_name}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Series</div>
                  <Badge variant="secondary">{book.series_name}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge variant={book.status === 'published' ? 'default' : 'outline'}>
                    {book.status?.replace('_', ' ') || 'Draft'}
                  </Badge>
                </div>
                {book.owner && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Owner</div>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="w-3 h-3" />
                      {book.owner}
                    </div>
                  </div>
                )}
                {book.due_date && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Due Date</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3" />
                      {new Date(book.due_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {book.ready_flag !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Ready Status</div>
                    <div className="flex items-center gap-1 text-sm">
                      {book.ready_flag ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Ready for Review
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-yellow-500" />
                          In Development
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Start reading from Chapter 1</li>
                  <li>• Explore related thinkers</li>
                  <li>• Add your own frameworks</li>
                  <li>• Join community discussions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOverview;