import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UpcomingBook } from "@/data/upcoming-books";
import { ArrowLeft, BookOpen, Clock, Sparkles } from "lucide-react";

interface ComingSoonBookPageProps {
  book: UpcomingBook;
}

export const ComingSoonBookPage = ({ book }: ComingSoonBookPageProps) => {
  return (
    <>
      <Helmet>
        <title>{book.title} — Coming Soon — Tech4Humanity</title>
        <meta name="description" content={book.lead_description} />
        <link rel="canonical" href={`https://ai-thinker-flux.lovable.app/books/${book.slug}`} />
        <meta property="og:title" content={`${book.title} — Coming Soon — Tech4Humanity`} />
        <meta property="og:description" content={book.lead_description} />
        <meta property="og:url" content={`https://ai-thinker-flux.lovable.app/books/${book.slug}`} />
        <meta name="twitter:title" content={`${book.title} — Coming Soon`} />
        <meta name="twitter:description" content={book.lead_description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        {/* Navigation Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-3">
                  <img 
                    src="https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp" 
                    alt="AHC droid head logo"
                    className="h-12 w-12 rounded-lg object-contain" 
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Tech4Humanity
                  </span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-4">
                  <Link to="/books">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Books
                    </Button>
                  </Link>
                </nav>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
              <Clock className="w-3 h-3 mr-1.5" />
              Coming Soon {book.expectedDate && `• ${book.expectedDate}`}
            </Badge>
          </div>

          <Card className="overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Book Cover */}
                <div className="md:w-1/3 bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                  <div className="w-48 h-64 rounded-lg overflow-hidden shadow-2xl">
                    {book.cover ? (
                      <img 
                        src={book.cover} 
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Info */}
                <div className="md:w-2/3 p-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
                  {book.subtitle && (
                    <p className="text-xl text-muted-foreground mb-4">{book.subtitle}</p>
                  )}
                  
                  <p className="text-foreground mb-6 leading-relaxed">{book.lead_description}</p>

                  {book.teaserPoints && book.teaserPoints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        What to Expect
                      </h3>
                      <ul className="space-y-2">
                        {book.teaserPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="outline">{book.series_name}</Badge>
                    <Badge variant="secondary">In Development</Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/books" className="flex-1">
                      <Button variant="default" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore Available Books
                      </Button>
                    </Link>
                    <Link to="/thinkers" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Browse Thinkers
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-8 animate-in fade-in duration-700 delay-300">
            This book is currently in development. Check back soon for updates.
          </p>
        </main>
      </div>
    </>
  );
};
