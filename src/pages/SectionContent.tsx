import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ContentLoader } from '@/components/content/ContentLoader';
import { ContentLoader as ContentLoaderNew } from '@/components/content/ContentLoaderNew';
import { ExemplarCard } from '@/components/content/ExemplarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMaster4500Section, useMaster4500Progress } from '@/hooks/useMaster4500';
import { AllThinkersGrid } from '@/components/AllThinkersGrid';
import { isPlaceholderParam } from '@/lib/route-guards';

// Map section IDs to their corresponding JSON content files
function getContentFileForSection(sectionId: string): string {
  const sectionFileMap: Record<string, string> = {
    'thinkers': 'thinkers-brains-that-shaped-brains.json',
    'frameworks': 'frameworks.json',
    'quantum-logic-systems': 'quantum-logic-systems.json',
    'entangled-time': 'entangled-time.json',
    'roles-humans-in-machine': 'roles-humans-in-machine.json',
    // Add more mappings as needed
  };
  
  return sectionFileMap[sectionId] || `${sectionId}.json`;
}

export default function SectionContent() {
  const { bookSlug, sectionId } = useParams<{ bookSlug: string; sectionId: string }>();
  const navigate = useNavigate();

  // Guard against placeholder params
  if (!bookSlug || !sectionId || isPlaceholderParam(bookSlug) || isPlaceholderParam(sectionId)) {
    return <Navigate to="/books" replace />;
  }

  // Special handling for "The Thinking Engine" 
  const isThinkingEngine = bookSlug === 'thinking-engine';
  const { data: dbContent, isLoading: isDbLoading } = useMaster4500Section(sectionId || '');
  const { data: sectionProgress } = useMaster4500Progress();

  // For "The Thinking Engine", render database content directly
  if (isThinkingEngine) {
    if (isDbLoading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/books/${bookSlug}`)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            
            <div className="space-y-6">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const section = sectionProgress?.[sectionId];
    const exemplarCount = dbContent?.length || 0;

    return (
      <>
        <Helmet>
          <title>{sectionId} - The Thinking Engine Hub</title>
          <meta name="description" content={`Explore ${sectionId} content in The Thinking Engine Hub`} />
        </Helmet>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/books/${bookSlug}`)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>

            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">{sectionId}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Database-driven content for {sectionId} exemplars
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Badge className={`${section?.status === 'complete' ? 'bg-green-500' : section?.status === 'seeded' ? 'bg-blue-500' : 'bg-yellow-500'} text-white flex items-center gap-1`}>
                    <CheckCircle className="w-4 h-4" />
                    {section?.status || 'scaffold'}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{exemplarCount} exemplars</span>
                  </div>
                  {section?.avgProgress !== undefined && (
                    <Badge variant="outline">
                      {Math.round(section.avgProgress)}% complete
                    </Badge>
                  )}
                </div>
              </div>

              {/* Special handling for thinkers section - show interactive All Thinkers Grid */}
              {sectionId === 'thinkers' ? (
                <div className="space-y-8">
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg border p-6">
                    <h2 className="text-2xl font-bold mb-4">Interactive Thinkers Experience</h2>
                    <p className="text-muted-foreground mb-6">
                      Explore influential thinkers through interactive profiles, AI-powered chat, and team generation capabilities.
                    </p>
                    <AllThinkersGrid />
                  </div>
                  
                  <div className="bg-muted/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Database Content</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Additional exemplars from the database:
                    </p>
                    <ContentLoaderNew 
                      bookSlug={bookSlug}
                      contentFile={getContentFileForSection(sectionId)}
                    />
                  </div>
                </div>
              ) : (
                <ContentLoaderNew 
                  bookSlug={bookSlug}
                  contentFile={getContentFileForSection(sectionId)}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{sectionId} - {bookSlug === 'thinking-engine' ? 'The Thinking Engine Hub' : 'Book Content'}</title>
        <meta name="description" content={`Explore ${sectionId} content`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/books/${bookSlug}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>

          <ContentLoader bookSlug={bookSlug}>
            {({ content, loading, error }) => {
              if (loading) {
                return (
                  <div className="space-y-6">
                    <div className="h-8 bg-muted animate-pulse rounded" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                      ))}
                    </div>
                  </div>
                );
              }

              if (error || !content) {
                return (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        {error || 'Content not found'}
                      </p>
                    </CardContent>
                  </Card>
                );
              }

              const section = content.sections?.find(s => s.id === sectionId);
              if (!section) {
                return (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">Section not found</p>
                    </CardContent>
                  </Card>
                );
              }

              // Load section content from contentFile if available
              if (section.contentFile && section.status === 'seeded') {
                return (
                  <ContentLoader bookSlug={section.contentFile.replace('.json', '')}>
                    {({ content: sectionContent, loading: sectionLoading }) => {
                      if (sectionLoading) {
                        return (
                          <div className="space-y-6">
                            <div className="h-8 bg-muted animate-pulse rounded" />
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                              ))}
                            </div>
                          </div>
                        );
                      }

                      const exemplars = sectionContent?.clusters?.flatMap(cluster => cluster.exemplars) || [];

                      return (
                        <div className="space-y-8">
                          <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold">{section.title}</h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                              {section.lead}
                            </p>
                            <div className="flex items-center justify-center gap-4">
                              <Badge className="bg-green-500 text-white flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {section.status}
                              </Badge>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{exemplars.length} exemplars</span>
                              </div>
                            </div>
                          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exemplars.map((exemplar, index) => (
              <ExemplarCard 
                key={index} 
                exemplar={exemplar} 
                bookSlug={bookSlug}
                showContributionForm={bookSlug !== 'tech-for-humanity'}
              />
            ))}
          </div>
                        </div>
                      );
                    }}
                  </ContentLoader>
                );
              }

              // Scaffold section
              return (
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">{section.title}</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                      {section.lead}
                    </p>
                    <Badge className="bg-yellow-500 text-white">
                      Content framework ready - awaiting development
                    </Badge>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        This section is currently being developed. The content framework 
                        has been established and exemplars will be added soon.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            }}
          </ContentLoader>
        </div>
      </div>
    </>
  );
}