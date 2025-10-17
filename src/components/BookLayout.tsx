import { Helmet } from "react-helmet-async";
import { useParams, Link, useLocation, Outlet } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { UPCOMING_BOOKS } from "@/data/upcoming-books";
import { ComingSoonBookPage } from "@/components/ComingSoonBookPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthorMode } from "@/hooks/useAuthorMode";
import { isPlaceholderParam } from "@/lib/route-guards";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Plus, 
  Heart,
  Settings,
  Home,
  FileText,
  Edit
} from "lucide-react";

const BookLayout = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { data: books } = useBooks();
  const { isAuthorMode } = useAuthorMode();
  
  // Guard against placeholder params - redirect to books list
  if (!slug || isPlaceholderParam(slug)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Book URL</h1>
          <p className="text-muted-foreground mb-4">The book URL appears to be a template.</p>
          <Link to="/books">
            <Button>← Back to Books</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const book = books?.find(book => book.slug === slug);
  
  // Check if this slug is in UPCOMING_BOOKS and NOT in the database
  const upcomingBook = UPCOMING_BOOKS.find(b => b.slug === slug);
  const isUpcomingOnly = upcomingBook && !book;

  const calculateAverageProgress = (chapters: any[]) => {
    if (!chapters || chapters.length === 0) return 0;
    const sum = chapters.reduce((acc, chapter) => acc + (chapter.progress || 0), 0);
    return Math.round(sum / chapters.length);
  };

  const isActive = (path: string) => {
    if (path === `/books/${slug}` && location.pathname === `/books/${slug}`) {
      return true;
    }
    return location.pathname.startsWith(path) && path !== `/books/${slug}`;
  };

  // Show coming soon page if book is upcoming and not in DB
  if (isUpcomingOnly) {
    return <ComingSoonBookPage book={upcomingBook!} />;
  }

  // Only show 404 if book is not found in either active or upcoming lists
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
        <title>{book.title} — Tech4Humanity</title>
        <meta name="description" content={book.lead || `Explore ${book.title} from the Tech4Humanity book series with interactive content and community features.`} />
        <link rel="canonical" href={`https://ai-thinker-flux.lovable.app/books/${book.slug}`} />
        <meta property="og:title" content={`${book.title} — Tech4Humanity`} />
        <meta property="og:description" content={book.lead || `Explore ${book.title} from the Tech4Humanity book series.`} />
        <meta property="og:url" content={`https://ai-thinker-flux.lovable.app/books/${book.slug}`} />
        <meta name="twitter:title" content={`${book.title} — Tech4Humanity`} />
        <meta name="twitter:description" content={book.lead || `Explore ${book.title} from the Tech4Humanity book series.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Navigation Header */}
        <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-3">
                  <img 
                    src="https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp" 
                    alt="AHC droid head logo"
                    className="h-12 w-12 rounded-lg object-contain" 
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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

              <div className="flex items-center gap-2">
                {isAuthorMode && (
                  <Link to="/admin/books">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Author Panel
                    </Button>
                  </Link>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Book Header */}
        <div className="border-b bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="w-32 h-40 rounded-lg overflow-hidden shadow-lg">
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
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{book.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{book.subtitle}</p>
                <p className="text-foreground mb-4">{book.lead}</p>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Progress:</span>
                    <Progress value={averageProgress} className="w-20 h-2" />
                    <span className="text-sm font-medium">{averageProgress}%</span>
                  </div>
                  <Badge variant="secondary">{book.series_name}</Badge>
                  <Badge variant={book.status === 'published' ? 'default' : 'outline'}>
                    {book.status?.replace('_', ' ') || 'Draft'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Navigation */}
        <div className="border-b bg-white/20 dark:bg-gray-900/20">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex gap-1 overflow-x-auto">
              <Link to={`/books/${slug}`}>
                <Button 
                  variant={isActive(`/books/${slug}`) ? "default" : "ghost"} 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Overview
                </Button>
              </Link>
              <Link to={`/books/${slug}/chapters`}>
                <Button 
                  variant={isActive(`/books/${slug}/chapters`) ? "default" : "ghost"} 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Chapters
                </Button>
              </Link>
              <Link to={`/books/${slug}/leaders-live`}>
                <Button 
                  variant={isActive(`/books/${slug}/leaders-live`) ? "default" : "ghost"} 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Leaders Live
                </Button>
              </Link>
              <Link to={`/books/${slug}/add-guru`}>
                <Button 
                  variant={isActive(`/books/${slug}/add-guru`) ? "default" : "ghost"} 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Guru
                </Button>
              </Link>
              <Link to={`/books/${slug}/resources`}>
                <Button 
                  variant={isActive(`/books/${slug}/resources`) ? "default" : "ghost"} 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Resources
                </Button>
              </Link>
              <Link to="/thinkers">
                <Button 
                  variant={isActive('/thinkers') ? "default" : "ghost"} 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Crowdsourced Thinkers
                </Button>
              </Link>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default BookLayout;