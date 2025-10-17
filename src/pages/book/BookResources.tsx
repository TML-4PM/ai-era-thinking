import { useParams, Navigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentLoader } from "@/components/content/ContentLoader";
import { 
  Settings, 
  FileText, 
  Download, 
  ExternalLink, 
  Calculator,
  Wrench,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  Clock,
  Database,
  Code,
  Link,
  Shield,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isPlaceholderParam } from "@/lib/route-guards";

const BookResources = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  
  // Guard against placeholder params
  if (!slug || isPlaceholderParam(slug)) {
    return <Navigate to="/books" replace />;
  }
  
  const book = books?.find(book => book.slug === slug);

  if (!book) return null;

  const isThinkingEngine = slug === 'thinking-engine';

  const resources = [
    {
      category: "Seeded Chapters",
      icon: BookOpen,
      items: [
        {
          title: "Frameworks - Patterns of Action",
          description: "40+ decision-making frameworks analyzed across five technological eras from OODA Loop to Systems Thinking.",
          type: "Seeded Chapter",
          url: `/books/thinking-engine/sections/frameworks`
        },
        {
          title: "Thinkers - Brains that Shaped Brains",
          description: "70+ influential minds from cognitive science, AI, and organizational theory with interactive profiles.",
          type: "Seeded Chapter",
          url: `/books/thinking-engine/sections/thinkers-brains-that-shaped-brains`
        },
        {
          title: "Roles - Humans in the Machine",
          description: "132 roles exploring how human responsibilities evolve in AI-augmented systems.",
          type: "Seeded Chapter",
          url: `/books/thinking-engine/sections/roles-humans-in-machine`
        },
        {
          title: "Eras - Technological Epochs",
          description: "30 transformations across five eras: On-Prem, Cloud-Native, Gen AI, Agentic AI, and BCI.",
          type: "Seeded Chapter",
          url: `/books/thinking-engine/sections/thinking-engine-eras`
        },
        {
          title: "Technologies - The Technical Stack",
          description: "85 core technologies from RDBMS to neural buffers, organized across six technical planes.",
          type: "Seeded Chapter",
          url: `/books/thinking-engine/sections/thinking-engine-technologies`
        },
        {
          title: "Disciplines - Academic Foundations",
          description: "60 academic disciplines contributing to AI development and human-machine collaboration.",
          type: "Seeded Chapter",
          url: `/books/thinking-engine/sections/thinking-engine-disciplines`
        }
      ]
    },
    {
      category: "Workshop Materials",
      icon: Users,
      items: [
        {
          title: "AI Perception Bias in Healthcare",
          description: "45-minute workshop scenario on detecting and mitigating AI bias in diagnostic systems. Includes roles for Clinical Lead, AI Engineer, Ethics Officer, and Patient Advocate.",
          type: "Workshop Scenario",
          url: "/workshops"
        },
        {
          title: "Trading Agent Exceeds Authority",
          description: "60-minute governance simulation where agentic trading systems game success metrics. Practice per-action consent and reflex stop implementation.",
          type: "Workshop Scenario",
          url: "/workshops"
        },
        {
          title: "Neural Data Consent Revocation",
          description: "90-minute ethical dilemma workshop on consent management in BCI systems with irreversible learning.",
          type: "Workshop Scenario",
          url: "/workshops"
        }
      ]
    },
    {
      category: "Governance Tools",
      icon: Shield,
      items: [
        {
          title: "Context Integrity Enforcement",
          description: "Policy-as-code template ensuring every action remains within its intended context. Prevents neural movement data from being used for marketing.",
          type: "Code Template",
          url: "/governance"
        },
        {
          title: "Per-Action Consent Module",
          description: "TypeScript implementation enforcing consent requirements before each autonomous agent action. Includes value thresholds and time windows.",
          type: "Code Template",
          url: "/governance"
        },
        {
          title: "Reflex Stop System",
          description: "Safety harness that instantly halts systems on detecting unsafe states. Includes BCI neural spike anomaly detection.",
          type: "Code Template",
          url: "/governance"
        },
        {
          title: "Neural Consent Vault",
          description: "Manages consent for neural data with revocation, audit trails, and immediate processing halts. Medical-grade privacy implementation.",
          type: "Code Template",
          url: "/governance"
        }
      ]
    },
    {
      category: "Data Exports",
      icon: FileText,
      items: [
        {
          title: "Architecture Across Eras",
          description: "CSV export mapping how technical architecture components evolve from On-Prem through BCI era.",
          type: "Data Export",
          url: "/architecture_guts_by_era.csv"
        },
        {
          title: "Governance Risks & Metrics",
          description: "Comprehensive CSV of governance challenges, risk mitigation strategies, and success metrics by era.",
          type: "Data Export",
          url: "/governance_risks_metrics.csv"
        },
        {
          title: "Organ Map Across Eras",
          description: "Five-lobe Organ framework capabilities mapped across all technological eras with examples.",
          type: "Data Export",
          url: "/organ_across_eras.csv"
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Resources & Tools</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {isThinkingEngine 
            ? 'Access chapter-specific resources, data exports, and learning materials for The Thinking Engine Hub.'
            : `Comprehensive resources to help you apply the concepts from ${book.title} in your work. From calculators and templates to workshops and case studies.`
          }
        </p>
      </div>

      {isThinkingEngine && (
        <ContentLoader bookSlug={slug!}>
          {({ content }) => {
            const volumes = content?.volumes || [];
            const seededVolumes = volumes.filter(v => v.status === 'seeded');

            return (
              <section className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Seeded Chapters
                    </CardTitle>
                    <CardDescription>
                      {seededVolumes.length} chapters with complete content available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {seededVolumes.map((volume) => (
                        <a 
                          key={volume.id}
                          href={`/section-content/${volume.slug}`}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div>
                            <div className="font-medium">{volume.title}</div>
                            <div className="text-sm text-muted-foreground">{volume.exemplarCount} exemplars</div>
                          </div>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            );
          }}
        </ContentLoader>
      )}

      {/* Book-Specific Resources */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {book.title} Resource Kit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Download className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm mb-2">Export Options</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Generate HTML preview or PDF export
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.functions.invoke('generate-book-pdf', {
                            body: { bookSlug: book.slug, format: 'html' }
                          });
                          if (error) throw error;
                          toast({
                            title: "Export Available",
                            description: "HTML export is ready for download.",
                          });
                        } catch (error) {
                          toast({
                            title: "Export Failed", 
                            description: "Could not generate export. Please try again.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      HTML
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "PDF export is not yet available.",
                        });
                      }}
                    >
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {book.draft_url && (
                <Card className="hover:shadow-md transition-shadow border-green-200">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-2">Latest Draft</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Current working version
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => window.open(book.draft_url, '_blank')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View Draft
                    </Button>
                    {book.ready_flag ? (
                      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Ready for review
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-yellow-600">
                        <Clock className="w-3 h-3" />
                        Work in progress
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm mb-2">Implementation Checklist</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Step-by-step checklist for applying concepts
                  </p>
                  <Button size="sm" variant="outline">View Checklist</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm mb-2">Discussion Guide</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Questions for team discussions and workshops
                  </p>
                  <Button size="sm" variant="outline">Get Guide</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* All Resources */}
      <section className="space-y-8">
        {resources.map((category, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{category.category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item, itemIndex) => (
                <Card key={itemIndex} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-4 text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Free resource
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.url} className="inline-flex items-center gap-2">
                          Access
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Additional Resources */}
      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              More Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Related Books</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Explore other books in the {book.series_name} series</li>
                  <li>• Cross-reference concepts across different volumes</li>
                  <li>• Build comprehensive understanding</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Community Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Join discussion forums and study groups</li>
                  <li>• Connect with other practitioners</li>
                  <li>• Share your implementation experiences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default BookResources;