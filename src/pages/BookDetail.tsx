import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react";
import { isPlaceholderParam } from "@/lib/route-guards";

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  
  // Guard against placeholder params
  if (!slug || isPlaceholderParam(slug)) {
    return <Navigate to="/books" replace />;
  }
  
  const book = books?.find(book => book.slug === slug);

  const calculateAverageProgress = (chapters: any[]) => {
    if (!chapters || chapters.length === 0) return 0;
    const sum = chapters.reduce((acc, chapter) => acc + (chapter.progress || 0), 0);
    return Math.round(sum / chapters.length);
  };


  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Book Not Found</h1>
          <Link to="/books">
            <Button>← Back to Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageProgress = calculateAverageProgress(book.chapters || []);

  return (
    <>
      <Helmet>
        <title>{book.title} — Tech for Humanity</title>
        <meta name="description" content={book.lead || `Read ${book.title} from the Tech for Humanity book series.`} />
        <link rel="canonical" href={`https://ai-thinker-flux.lovable.app/books/${book.slug}`} />
        <meta property="og:title" content={`${book.title} — Tech for Humanity`} />
        <meta property="og:description" content={book.lead || `Read ${book.title} from the Tech for Humanity book series.`} />
        <meta property="og:url" content={`https://ai-thinker-flux.lovable.app/books/${book.slug}`} />
        <meta name="twitter:title" content={`${book.title} — Tech for Humanity`} />
        <meta name="twitter:description" content={book.lead || `Read ${book.title} from the Tech for Humanity book series.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-6 py-6">
            <Link to="/books">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Books
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground">{book.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{book.subtitle}</p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg mb-6">
                  {book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={`${book.title} cover`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center p-6">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="text-xl font-bold">{book.title}</div>
                        <div className="text-sm opacity-60">{book.subtitle}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{averageProgress}%</span>
                  </div>
                  <Progress value={averageProgress} className="h-2" />
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{book.series_name}</Badge>
                    <Badge variant={book.status === 'published' ? 'default' : 'outline'}>
                      {book.status?.replace('_', ' ') || 'Draft'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <p className="text-lg text-foreground leading-relaxed">{book.lead}</p>
              </section>

              {/* Chapters */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Chapters</h2>
                  <Badge variant="outline">
                    {book.chapters?.length || 0} chapters
                  </Badge>
                </div>

                {book.chapters && book.chapters.length > 0 ? (
                  <div className="space-y-4">
                    {book.chapters
                      .sort((a, b) => (a.chapter_order || 0) - (b.chapter_order || 0))
                      .map((chapter, index) => (
                        <Card key={chapter.id || index}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {chapter.chapter_order || index + 1}. {chapter.title}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Progress value={chapter.progress} className="w-20 h-2" />
                                <span className="text-sm text-muted-foreground min-w-[3rem]">
                                  {chapter.progress}%
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          
                          {Array.isArray(chapter.sections) && chapter.sections.length > 0 && (
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-2">
                                {chapter.sections.map((section: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {section}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No chapters available yet.</p>
                  </div>
                )}
              </section>

              {/* Next Steps */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Next Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Add detailed chapter outlines</li>
                      <li>• Attach sources and references</li>
                      <li>• Connect to content management system</li>
                      <li>• Enable reader feedback and comments</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BookDetail;