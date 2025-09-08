import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Books = () => {
  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          book_chapters(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const calculateAverageProgress = (chapters: any[]) => {
    if (!chapters || chapters.length === 0) return 0;
    const sum = chapters.reduce((acc, chapter) => acc + (chapter.progress_percentage || 0), 0);
    return Math.round(sum / chapters.length);
  };

  return (
    <>
      <Helmet>
        <title>Tech for Humanity — Book Series</title>
        <meta name="description" content="Explore our comprehensive book series on AI, technology, and human-centered design. From WorkFamilyAI to Sovereign Systems." />
        <link rel="canonical" href="https://lovable.dev/books" />
        <meta property="og:title" content="Tech for Humanity — Book Series" />
        <meta property="og:description" content="Explore our comprehensive book series on AI, technology, and human-centered design." />
        <meta property="og:url" content="https://lovable.dev/books" />
        <meta name="twitter:title" content="Tech for Humanity — Book Series" />
        <meta name="twitter:description" content="Explore our comprehensive book series on AI, technology, and human-centered design." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-foreground">Tech for Humanity — Book Series</h1>
            <p className="text-muted-foreground mt-2">Practical guides for human-centered technology</p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                    <div className="h-3 bg-muted rounded mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-8 bg-muted rounded w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books?.map((book) => {
                const averageProgress = calculateAverageProgress(book.book_chapters);
                return (
                  <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-muted-foreground"
                    >
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
                        <div className="text-center p-4">
                          <div className="text-2xl font-bold">{book.title}</div>
                          <div className="text-sm opacity-60">{book.subtitle}</div>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-1">{book.title}</h2>
                      <p className="text-sm text-muted-foreground mb-2">{book.subtitle}</p>
                      <p className="text-sm text-foreground mb-4 line-clamp-2">{book.lead_description}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 mr-4">
                          <Progress value={averageProgress} className="h-2" />
                        </div>
                        <span className="text-xs text-muted-foreground">{averageProgress}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {book.status?.replace('_', ' ') || 'Draft'}
                        </span>
                        <Link to={`/books/${book.slug}`}>
                          <Button size="sm">Open</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Books;