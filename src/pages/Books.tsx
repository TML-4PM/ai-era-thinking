import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { ThemeToggle } from "@/components/ThemeToggle";

const Books: React.FC = () => {
  const navigate = useNavigate();
  const { data: books, isLoading } = useBooks();
  const [selectedCollection, setSelectedCollection] = useState<string>("all");

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

  const collections = [
    { id: 'all', label: 'All Books', count: books?.length || 0 },
    { id: 'Suite Hub', label: 'Suite Hubs', count: books?.filter(b => b.collection === 'Suite Hub').length || 0 },
    { id: 'A Series', label: 'Tech for Humanity', count: books?.filter(b => b.collection === 'A Series').length || 0 },
    { id: 'C Series', label: 'Thinking Engine', count: books?.filter(b => b.collection === 'C Series').length || 0 },
    { id: 'Single Volume', label: 'Single Volumes', count: books?.filter(b => b.collection === 'Single Volume').length || 0 }
  ];

  const filteredBooks = books?.filter(book => {
    if (selectedCollection === 'all') return true;
    return book.collection === selectedCollection;
  }) || [];

  return (
    <>
      <Helmet>
        <title>Tech for Humanity Book Series | The Organ</title>
        <meta name="description" content="Explore our comprehensive book series on AI transformation, digital sovereignty, and human-centered technology. 20 volumes covering augmented humanity, governance frameworks, and practical implementation guides." />
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
                <span className="text-primary-foreground font-bold text-sm">O</span>
              </div>
              <span className="text-xl font-bold">The Organ</span>
            </div>
            <ThemeToggle />
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Tech for Humanity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive book series exploring AI transformation, digital sovereignty, and human-centered technology for the modern era.
            </p>
          </div>

          {/* Collection Filters */}
          <div className="mb-8">
            <Tabs value={selectedCollection} onValueChange={setSelectedCollection}>
              <TabsList className="grid w-full grid-cols-5">
                {collections.map(collection => (
                  <TabsTrigger key={collection.id} value={collection.id} className="flex items-center gap-2">
                    {collection.label}
                    <Badge variant="secondary" className="text-xs">
                      {collection.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {collections.map(collection => (
                <TabsContent key={collection.id} value={collection.id} className="mt-8">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
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
                      {filteredBooks.map((book) => (
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

                              {/* Collection Badge */}
                              <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="text-xs">
                                  {book.collection}
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

                  {!isLoading && filteredBooks.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No books found in this collection yet.
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Books;