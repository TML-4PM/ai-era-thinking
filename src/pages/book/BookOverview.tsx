import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Target, CheckCircle, User, Calendar } from "lucide-react";
import { ContentLoader } from "@/components/content/ContentLoader";
import { ClusterList } from "@/components/content/ClusterList";
import { SectionList } from "@/components/content/SectionList";
import { ContributionForm } from "@/components/content/ContributionForm";
import { AuthorModeToggle } from "@/components/AuthorModeToggle";
import { InsightInbox } from '@/components/author/InsightInbox';
import { useAuthorMode } from '@/hooks/useAuthorMode';
import { isPlaceholderParam } from '@/lib/route-guards';

export default function BookOverview() {
  const { slug: bookSlug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  const { isAuthorMode } = useAuthorMode();
  
  // Guard against placeholder params
  if (!bookSlug || isPlaceholderParam(bookSlug)) {
    return <Navigate to="/books" replace />;
  }
  
  const book = books?.find(book => book.slug === bookSlug);

  if (!book) return null;

  const calculateAverageProgress = (chapters: any[]) => {
    if (!chapters || chapters.length === 0) return 0;
    const sum = chapters.reduce((acc, chapter) => acc + (chapter.progress || 0), 0);
    return Math.round(sum / chapters.length);
  };

  const calculateHubProgress = (content: any) => {
    if (!content) return 0;
    if (content.sections) {
      const seeded = content.sections.filter((s: any) => s.status === 'seeded').length;
      const total = content.sections.length;
      return Math.round((seeded / total) * 100);
    }
    if (content.volumes) {
      const seeded = content.volumes.filter((v: any) => v.status === 'seeded').length;
      const total = content.volumes.length;
      return Math.round((seeded / total) * 100);
    }
    return 0;
  };

  const averageProgress = book.collection === "Suite Hub" 
    ? 0 // Will be calculated from content
    : calculateAverageProgress(book.chapters || []);

  return (
    <>
      <Helmet>
        <title>{book.title} - Overview | Tech for Humanity</title>
        <meta name="description" content={`${book.lead} Explore structured content, era evolution, and collaborative insights.`} />
        <meta name="keywords" content={`${book.title}, ${book.series_name}, book overview, structured content`} />
        <link rel="canonical" href={`/books/${bookSlug}`} />
        
        {/* Social sharing images for Tech4Humanity */}
        {(bookSlug === 'tech-for-humanity' || book.series_name === 'Tech for Humanity') && (
          <>
            <meta property="og:title" content={`${book.title} - Tech for Humanity`} />
            <meta property="og:description" content={book.lead} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="/assets/covers/tech-for-humanity-hub.jpg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={`/books/${bookSlug}`} />
            
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${book.title} - Tech for Humanity`} />
            <meta name="twitter:description" content={book.lead} />
            <meta name="twitter:image" content="/assets/covers/tech-for-humanity-hub.jpg" />
          </>
        )}
      </Helmet>
    
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ContentLoader bookSlug={bookSlug}>
          {({ content, loading, error }) => {
            if (loading) {
              return <div className="text-center py-8">Loading content...</div>;
            }
            
            // Update progress for hub books based on content
            const hubProgress = content ? calculateHubProgress(content) : 0;
            const displayProgress = book.collection === "Suite Hub" ? hubProgress : averageProgress;

            return (
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

                  {/* Quick Insight Form - Only for books with volumes */}
                  {content?.volumes && (
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Quick Insight</h2>
                      <ContributionForm
                        bookSlug={bookSlug}
                        volumes={content.volumes}
                        isQuickInsight={true}
                      />
                    </section>
                  )}

                  {/* Content & Frameworks */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Content & Frameworks</h2>
                    {error || !content ? (
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
                    ) : (
                      <>
                        {/* Handle different content structures */}
                        {content.sections ? (
                          <SectionList sections={content.sections} bookSlug={bookSlug} />
                        ) : content.volumes ? (
                          <div className="grid gap-6 md:grid-cols-2">
                            {content.volumes.map((volume: any) => (
                              <Card key={volume.id} className="hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-4">
                                  <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{volume.title}</CardTitle>
                                    <Badge className={`${volume.status === 'seeded' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'} flex items-center gap-1`}>
                                      {volume.status === 'seeded' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                      {volume.status}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <p className="text-muted-foreground text-sm leading-relaxed">
                                    {volume.lead}
                                  </p>
                                  {volume.exemplarCount && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Users className="w-4 h-4" />
                                      <span>{volume.exemplarCount} exemplars</span>
                                    </div>
                                  )}
                                  {volume.status === 'seeded' && volume.slug && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => window.location.href = `/books/${volume.slug}`}
                                      className="w-full"
                                    >
                                      <BookOpen className="w-4 h-4 mr-2" />
                                      Explore Volume
                                    </Button>
                                  )}
                                  {volume.status === 'scaffold' && (
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                      <p className="text-xs text-muted-foreground">
                                        Volume framework ready - awaiting development
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : content.clusters ? (
                          <ClusterList clusters={content.clusters} bookSlug={bookSlug} />
                        ) : (
                          <div>No structured content available yet.</div>
                        )}
                      </>
                    )}
                  </section>

                  {/* User Contribution Form - Only for books without volumes */}
                  {!content?.volumes && (
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Contribute Your Insights</h2>
                      <ContributionForm bookSlug={bookSlug} />
                    </section>
                  )}

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
                    {/* Author Mode Toggle */}
                    <AuthorModeToggle />
                    
                    {/* Insight Inbox - Author Mode Only */}
                    {isAuthorMode && (
                      <InsightInbox 
                        bookSlug={bookSlug} 
                        volumes={content?.volumes || []} 
                      />
                    )}
                    
                    {/* Progress Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Writing Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Overall Progress</span>
                            <span className="text-sm font-medium">{displayProgress}%</span>
                          </div>
                          <Progress value={displayProgress} className="h-3" />
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t text-center">
                              <div>
                                <div className="text-2xl font-bold text-foreground">
                                  {content?.sections?.length || content?.volumes?.length || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">Sections</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">
                                  {content?.sections?.filter((s: any) => s.status === 'seeded').length || 
                                   content?.volumes?.filter((v: any) => v.status === 'seeded').length || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">Seeded</div>
                              </div>
                            </div>
                            {((content?.sections?.reduce((total: number, section: any) => 
                              total + (section.exemplarCount || 0), 0)) || 
                              (content?.volumes?.reduce((total: number, volume: any) => 
                                total + (volume.exemplarCount || 0), 0)) || 0) > 0 && (
                              <div className="grid grid-cols-1 gap-2 pt-2 border-t text-center">
                                <div>
                                  <div className="text-lg font-bold text-foreground">
                                    {content?.sections?.reduce((total: number, section: any) => 
                                      total + (section.exemplarCount || 0), 0) || 
                                     content?.volumes?.reduce((total: number, volume: any) => 
                                       total + (volume.exemplarCount || 0), 0) || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Total Exemplars</div>
                                </div>
                              </div>
                            )}
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
            );
          }}
        </ContentLoader>
      </div>
    </>
  );
}