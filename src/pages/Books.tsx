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

  const fiveMainBooks = [
    'tech-for-humanity',
    'entangled-time', 
    'thinking-engine',
    'quantum-logic-systems',
    'regenerative-organization'
  ];

  // Featured Collection - the 5 aspirational books
  const featuredBooks = books?.filter(book => 
    fiveMainBooks.includes(book.slug)
  ) || [];
  
  // Books in Progress - DB books NOT in featured list
  const activeBooks = books?.filter(book => 
    !fiveMainBooks.includes(book.slug) && 
    typeof book.id === 'string' && 
    book.id.includes('-') // UUID-like IDs from DB
  ) || [];
  
  // Check if a book slug is "coming soon" (in UPCOMING_BOOKS but not in DB)
  const isComingSoon = (slug: string) => {
    return UPCOMING_BOOKS.some(ub => ub.slug === slug) && !books?.some(b => b.slug === slug);
  };

  const getBookSnapshot = (book: any) => {
    switch (book.slug) {
      case 'tech-for-humanity':
        return 'Seeded 5/15 volumes • Ethics & Consent, Governance & Policy, Education & Knowledge, Healthcare & Wellbeing, Climate & Environment';
      case 'entangled-time':
        return '3 clusters seeded • Past Systems, Cloud Native & Mobile First, Generative AI Era';
      case 'thinking-engine':
        return 'Sections seeded • Roles, Frameworks, Thinkers';
      case 'quantum-logic-systems':
        return '3 clusters seeded • Quantum Computation, Quantum Biology, Quantum Medicine';
      case 'regenerative-organization':
        return '3 clusters seeded • Strip (Current State), Map (Ecosystem), Update (Transformation Paths)';
      default:
        return '';
    }
  };

  return (
    <>
      <Helmet>
        <title>Tech4Humanity Book Series</title>
        <meta name="description" content="Explore our comprehensive book series on AI transformation, digital sovereignty, and human-centered technology. Five books covering augmented humanity, governance frameworks, and practical implementation guides." />
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
              Tech for Humanity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive book series exploring AI transformation, digital sovereignty, and human-centered technology for the modern era.
            </p>
          </div>

          {/* Collection Status Panel */}
          <div className="mb-12 max-w-3xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-semibold">📚 Collection Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">• </span>
                        <span className="font-medium text-green-600 dark:text-green-400">{activeBooks.length} books</span>
                        <span className="text-muted-foreground"> in active development</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">• </span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">{featuredBooks.length} featured volumes</span>
                        <span className="text-muted-foreground"> coming soon</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">• </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">12+ future volumes</span>
                        <span className="text-muted-foreground"> in planning</span>
                      </div>
                    </div>
                    {isAuthorMode && (
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/admin/books')}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Author Panel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Collection */}
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Featured Collection</h2>
              <p className="text-muted-foreground">
                Aspirational volumes exploring the intersection of technology and humanity
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBooks.map((book) => (
                  <Card key={book.slug} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
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

          {/* Books in Progress */}
          {!isLoading && activeBooks.length > 0 && (
            <div className="mb-16">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Books in Progress</h2>
                <p className="text-muted-foreground">
                  Active development — add your content here
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBooks.map((book) => (
                  <Card key={book.slug} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500/30">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
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
                          <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-green-600/60 dark:text-green-400/60" />
                          </div>
                        )}
                        
                        {/* Active Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
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

                      {/* Chapter Count */}
                      {book.chapters && book.chapters.length > 0 && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">
                            {book.chapters.length} chapters • {calculateAverageProgress(book.chapters)}% complete
                          </p>
                        </div>
                      )}

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