import { useParams } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Link
} from "lucide-react";

const BookResources = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  const book = books?.find(book => book.slug === slug);

  if (!book) return null;

  const resources = [
    {
      category: "Calculators & Tools",
      icon: Calculator,
      items: [
        {
          title: "AI Impact Calculator",
          description: "Assess the impact of AI implementations on your organization",
          type: "Interactive Tool",
          url: "/calculators"
        },
        {
          title: "Framework Comparison Matrix",
          description: "Compare different thinking frameworks side by side",
          type: "Spreadsheet Template",
          url: "#"
        }
      ]
    },
    {
      category: "Workshops & Training",
      icon: Wrench,
      items: [
        {
          title: "Implementation Workshop Guide",
          description: "Step-by-step guide for running framework workshops",
          type: "PDF Guide",
          url: "/resources/workshops"
        },
        {
          title: "Team Assessment Templates",
          description: "Ready-to-use templates for team capability assessments",
          type: "Template Pack",
          url: "#"
        }
      ]
    },
    {
      category: "Case Studies",
      icon: FileText,
      items: [
        {
          title: "Enterprise Transformation Cases",
          description: "Real-world examples of successful framework implementations",
          type: "Case Study Collection",
          url: "/resources/case-studies"
        },
        {
          title: "Governance Implementation Stories",
          description: "How organizations have applied governance frameworks",
          type: "Success Stories",
          url: "#"
        }
      ]
    },
    {
      category: "Community Resources",
      icon: Users,
      items: [
        {
          title: "Discussion Forums",
          description: "Connect with other readers and practitioners",
          type: "Community Platform",
          url: "#"
        },
        {
          title: "Expert Q&A Sessions",
          description: "Regular sessions with thought leaders and practitioners",
          type: "Live Events",
          url: "#"
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Resources & Tools</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive resources to help you apply the concepts from {book.title} in your work. 
          From calculators and templates to workshops and case studies.
        </p>
      </div>

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
                  <h3 className="font-semibold text-sm mb-2">Chapter Summaries</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Quick reference guides for each chapter
                  </p>
                  <Button size="sm" variant="outline">Download PDF</Button>
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