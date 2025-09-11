import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ContentLoader } from '@/components/content/ContentLoader';
import { ExemplarCard } from '@/components/content/ExemplarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SectionContent() {
  const { bookSlug, sectionId } = useParams<{ bookSlug: string; sectionId: string }>();
  const navigate = useNavigate();

  if (!bookSlug || !sectionId) {
    return <Navigate to="/books" replace />;
  }

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