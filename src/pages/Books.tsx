import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, FileText, CheckCircle, AlertCircle, Clock, Edit, BookOpen } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UPCOMING_BOOKS } from "@/data/upcoming-books";
import { FutureVolumesCard } from "@/components/FutureVolumesCard";
import { useAuthorMode } from "@/hooks/useAuthorMode";

const Books: React.FC = () => {
  const navigate = useNavigate();
  const { data: books, isLoading } = useBooks();

  const calculateAverageProgress = (chapters: any[]): number => {
    if (!chapters || chapters.length === 0) return 0;
    const totalProgress = chapters.reduce((sum, chapter) => sum + (chapter.progress || 0), 0);
    return Math.round(totalProgress / chapters.length);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-500';
      case 'draft': return 'bg-yellow-500';
      case 'concept': return 'bg-gray-500';
      case 'published': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'draft': return 'Draft';
      case 'concept': return 'Concept';
      case 'published': return 'Published';
      default: return 'Unknown';
    }
  };

  const { isAuthorMode } = useAuthorMode();

  // Three-tier organization
  const premierSlugs = ['tech-for-humanity', 'thinking-engine', 'gcbat-vignettes'];
  const coreSlugs = ['workfamilyai', 'sovereign-systems', 'entangled-time'];
  
  // Sort books by predefined order
  const sortByOrder = (bookList: any[], order: string[]) => {
    return bookList.sort((a, b) => {
      const indexA = order.indexOf(a.slug);
      const indexB = order.indexOf(b.slug);
      return indexA - indexB;
    });
  };

  // Premier Collection - Top tier foundational works
  const premierBooks = sortByOrder(
    books?.filter(book => premierSlugs.includes(book.slug)) || [],
    premierSlugs
  );
  
  // Core Books - Essential explorations
  const coreBooks = sortByOrder(
    books?.filter(book => coreSlugs.includes(book.slug)) || [],
    coreSlugs
  );
  
  // Development Books - Everything else
  const developmentBooks = books?.filter(book => 
    !premierSlugs.includes(book.slug) && 
    !coreSlugs.includes(book.slug)
  ) || [];
  
  // Check if a book slug is "coming soon" (in UPCOMING_BOOKS but not in DB)
  const isComingSoon = (slug: string) => {
    return UPCOMING_BOOKS.some(ub => ub.slug === slug) && !books?.some(b => b.slug === slug);
  };

  const getBookSnapshot = (book: any) => {
    switch (book.slug) {
      case 'tech-for-humanity':
        return 'Ethics & Consent, Governance & Policy, Education & Knowledge, Healthcare & Wellbeing, Climate & Environment';
      case 'thinking-engine':
        return 'Sections seeded • Roles, Frameworks, Thinkers';
      case 'gcbat-vignettes':
        return 'Character-driven exploration • 9 characters across 5 story arcs';
      case 'workfamilyai':
        return '3 chapters in progress • Impact, Family Systems, Practical Frameworks';
      case 'sovereign-systems':
        return 'Digital sovereignty exploration • Identity, autonomy, and control in the digital age';
      case 'entangled-time':
        return 'Temporal intelligence exploration • Foresight, narrative, and speculative futures';
      case 'eras-time-canvas':
        return '3 clusters seeded • Past Systems, Cloud Native & Mobile First, Generative AI Era';
      case 'quantum-logic-systems':
        return '3 clusters seeded • Quantum Computation, Quantum Biology, Quantum Medicine';
      case 'regenerative-organization':
        return '3 clusters seeded • Strip (Current State), Map (Ecosystem), Update (Transformation Paths)';
      default:
        return book.lead || '';
    }
  };

  return (
    <>
      <Helmet>
        <title>The Book Club - Tech4Humanity</title>
        <meta name="description" content="Join The Book Club exploring AI transformation, digital sovereignty, and human-centered technology through our comprehensive series." />
        <meta name="keywords" content="AI transformation, digital sovereignty, tech for humanity, book series, augmented humanity" />
        <link rel="canonical" href="/books" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Sticky Navigation */}
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold">Tech4Humanity</span>
            </div>
            <ThemeToggle />
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              The Book Club
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive book series exploring AI transformation, digital sovereignty, and human-centered technology for the modern era
            </p>
          </div>

          {/* Premier Collection */}
          <div className="mb-16">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Premier Collection</h2>
                  <p className="text-muted-foreground">
                    Foundational works exploring AI, governance, and human-centered technology
                  </p>
                </div>
                {isAuthorMode && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin/books')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Author Panel
                  </Button>
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="h-96">
                    <CardHeader>
                      <Skeleton className="h-48 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {premierBooks.map((book) => (
                  <Card key={book.slug} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader className="p-0">
                  <div 
                    className="relative aspect-[3/4] overflow-hidden rounded-t-lg cursor-pointer"
                    onClick={() => navigate(`/books/${book.slug}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/books/${book.slug}`);
                      }
                    }}
                  >
                        {book.cover && book.cover !== "/assets/covers/placeholder.jpg" ? (
                          <img 
                            src={book.cover} 
                            alt={`${book.title} cover`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-primary/60" />
                          </div>
                        )}
                        
                        {/* Status and Ready Flag Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {isComingSoon(book.slug) ? (
                            <Badge className="bg-purple-500 text-white">
                              <Clock className="w-3 h-3 mr-1" />
                              Coming Soon
                            </Badge>
                          ) : (
                            <>
                              <Badge className={`${getStatusColor(book.status)} text-white`}>
                                {getStatusLabel(book.status)}
                              </Badge>
                              {book.ready_flag && (
                                <Badge className="bg-green-500 text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Ready
                                </Badge>
                              )}
                            </>
                          )}
                        </div>

                        {/* Collection Badge */}
                        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="text-xs">
            {book.id === "A5" ? "seeded" : book.id === "A" || book.id === "C" ? "hub" : "scaffolded"}
          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        {book.subtitle && (
                          <p className="text-sm text-muted-foreground mb-2">{book.subtitle}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{book.lead}</p>
                      </div>

                      {/* Content Snapshot */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {getBookSnapshot(book)}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {book.owner && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Owner: {book.owner}</span>
                          </div>
                        )}
                        {book.due_date && (
                          <div className="flex items-center gap-1">
                            {new Date(book.due_date) < new Date() ? (
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            ) : (
                              <Calendar className="w-3 h-3" />
                            )}
                            <span className={new Date(book.due_date) < new Date() ? "text-red-500" : ""}>
                              Due: {new Date(book.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {book.chapters && book.chapters.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateAverageProgress(book.chapters)}%</span>
                          </div>
                          <Progress 
                            value={calculateAverageProgress(book.chapters)} 
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate(`/books/${book.slug}`)}
                          className="flex-1"
                        >
                          Open Book
                        </Button>
                        {book.draft_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(book.draft_url, '_blank')}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Core Volumes */}
          {!isLoading && coreBooks.length > 0 && (
            <div className="mb-16">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Core Books</h2>
                <p className="text-muted-foreground">
                  Essential explorations of emerging topics
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coreBooks.map((book) => (
                  <Card key={book.slug} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader className="p-0">
                  <div 
                    className="relative aspect-[3/4] overflow-hidden rounded-t-lg cursor-pointer"
                    onClick={() => navigate(`/books/${book.slug}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/books/${book.slug}`);
                      }
                    }}
                  >
                        {book.cover && book.cover !== "/assets/covers/placeholder.jpg" ? (
                          <img 
                            src={book.cover} 
                            alt={`${book.title} cover`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-primary/60" />
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                          {isComingSoon(book.slug) ? (
                            <Badge className="bg-purple-500 text-white">
                              <Clock className="w-3 h-3 mr-1" />
                              Coming Soon
                            </Badge>
                          ) : (
                            <>
                              <Badge className={`${getStatusColor(book.status)} text-white`}>
                                {getStatusLabel(book.status)}
                              </Badge>
                              {book.ready_flag && (
                                <Badge className="bg-green-500 text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Ready
                                </Badge>
                              )}
                            </>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="text-xs">
                            Core
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        {book.subtitle && (
                          <p className="text-sm text-muted-foreground mb-2">{book.subtitle}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{book.lead}</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {getBookSnapshot(book)}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        {book.owner && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Owner: {book.owner}</span>
                          </div>
                        )}
                        {book.due_date && (
                          <div className="flex items-center gap-1">
                            {new Date(book.due_date) < new Date() ? (
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            ) : (
                              <Calendar className="w-3 h-3" />
                            )}
                            <span className={new Date(book.due_date) < new Date() ? "text-red-500" : ""}>
                              Due: {new Date(book.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {book.chapters && book.chapters.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateAverageProgress(book.chapters)}%</span>
                          </div>
                          <Progress 
                            value={calculateAverageProgress(book.chapters)} 
                            className="h-2"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate(`/books/${book.slug}`)}
                          className="flex-1"
                        >
                          Open Book
                        </Button>
                        {book.draft_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(book.draft_url, '_blank')}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Development Volumes */}
          {!isLoading && developmentBooks.length > 0 && (
            <div className="mb-16">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">In Development</h2>
                <p className="text-muted-foreground">
                  Works in active development and expansion
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developmentBooks.map((book) => (
                  <Card key={book.slug} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader className="p-0">
                  <div 
                    className="relative aspect-[3/4] overflow-hidden rounded-t-lg cursor-pointer"
                    onClick={() => navigate(`/books/${book.slug}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/books/${book.slug}`);
                      }
                    }}
                  >
                        {book.cover && book.cover !== "/assets/covers/placeholder.jpg" ? (
                          <img 
                            src={book.cover} 
                            alt={`${book.title} cover`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-primary/60" />
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className={`${getStatusColor(book.status)} text-white`}>
                            {getStatusLabel(book.status)}
                          </Badge>
                          {book.ready_flag && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        {book.subtitle && (
                          <p className="text-sm text-muted-foreground mb-2">{book.subtitle}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{book.lead}</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {getBookSnapshot(book)}
                        </p>
                      </div>

                      {book.chapters && book.chapters.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateAverageProgress(book.chapters)}%</span>
                          </div>
                          <Progress 
                            value={calculateAverageProgress(book.chapters)} 
                            className="h-2"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {isAuthorMode ? (
                          <Button 
                            onClick={() => navigate('/admin/books')}
                            className="flex-1"
                            variant="default"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Chapters
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => navigate(`/books/${book.slug}`)}
                            className="flex-1"
                          >
                            Open Book
                          </Button>
                        )}
                        {book.draft_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(book.draft_url, '_blank')}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Future Volumes */}
          {!isLoading && (
            <div className="mb-16">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Future Volumes</h2>
                <p className="text-muted-foreground">
                  Planned additions to the collection
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FutureVolumesCard />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Books;