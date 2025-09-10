import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Compass, BookOpen } from "lucide-react";

const Books = () => {
  const navigate = useNavigate();
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
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/books" />
        <meta property="og:title" content="Tech for Humanity — Book Series" />
        <meta property="og:description" content="Explore our comprehensive book series on AI, technology, and human-centered design." />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/books" />
        <meta name="twitter:title" content="Tech for Humanity — Book Series" />
        <meta name="twitter:description" content="Explore our comprehensive book series on AI, technology, and human-centered design." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Navigation Header */}
        <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/T4H%20Logo%201.jpg" 
                    alt="Tech4Humanity logo" 
                    className="h-12 w-12 rounded-lg object-contain" 
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Tech4Humanity
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/explore")}
                    className="flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    Explore Thinkers
                  </Button>
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        <header className="border-b border-border/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Book Series
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Comprehensive guides for human-centered technology and AI integration
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>{books?.length || 0} books available</span>
                <span>•</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => navigate("/explore")}
                  className="p-0 h-auto font-normal"
                >
                  Explore our thinkers →
                </Button>
              </div>
            </div>
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