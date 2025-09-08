import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react";

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          book_chapters(*)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const calculateAverageProgress = (chapters: any[]) => {
    if (!chapters || chapters.length === 0) return 0;
    const sum = chapters.reduce((acc, chapter) => acc + (chapter.progress_percentage || 0), 0);
    return Math.round(sum / chapters.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6" />
            <div className="h-12 bg-muted rounded w-2/3 mb-4" />
            <div className="h-6 bg-muted rounded w-1/3 mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="aspect-[3/4] bg-muted rounded-lg" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const averageProgress = calculateAverageProgress(book.book_chapters);

  return (
    <>
      <Helmet>
        <title>{book.title} — Tech for Humanity</title>
        <meta name="description" content={book.lead_description || `Read ${book.title} from the Tech for Humanity book series.`} />
        <link rel="canonical" href={`https://lovable.dev/books/${book.slug}`} />
        <meta property="og:title" content={`${book.title} — Tech for Humanity`} />
        <meta property="og:description" content={book.lead_description || `Read ${book.title} from the Tech for Humanity book series.`} />
        <meta property="og:url" content={`https://lovable.dev/books/${book.slug}`} />
        <meta name="twitter:title" content={`${book.title} — Tech for Humanity`} />
        <meta name="twitter:description" content={book.lead_description || `Read ${book.title} from the Tech for Humanity book series.`} />
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
                  {book.cover_url ? (
                    <img 
                      src={book.cover_url} 
                      alt={`${book.title} cover`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/covers/placeholder.jpg';
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
                <p className="text-lg text-foreground leading-relaxed">{book.lead_description}</p>
              </section>

              {/* Chapters */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Chapters</h2>
                  <Badge variant="outline">
                    {book.book_chapters?.length || 0} chapters
                  </Badge>
                </div>

                {book.book_chapters && book.book_chapters.length > 0 ? (
                  <div className="space-y-4">
                    {book.book_chapters
                      .sort((a, b) => a.chapter_order - b.chapter_order)
                      .map((chapter) => (
                        <Card key={chapter.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {chapter.chapter_order}. {chapter.title}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Progress value={chapter.progress_percentage} className="w-20 h-2" />
                                <span className="text-sm text-muted-foreground min-w-[3rem]">
                                  {chapter.progress_percentage}%
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