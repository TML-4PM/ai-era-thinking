import { useParams, Navigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { AddThinkerForm } from "@/components/AddThinkerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthorMode } from "@/hooks/useAuthorMode";
import { Plus, Lightbulb, Users, BookOpen } from "lucide-react";
import { isPlaceholderParam } from "@/lib/route-guards";

const BookAddGuru = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  const { isAuthorMode } = useAuthorMode();
  
  // Guard against placeholder params
  if (!slug || isPlaceholderParam(slug)) {
    return <Navigate to="/books" replace />;
  }
  
  const book = books?.find(book => book.slug === slug);

  if (!book) return null;

  const isTechForHumanity = slug === 'tech-for-humanity';
  const showHelperPanels = !isTechForHumanity || isAuthorMode;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Add Your Guru</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Contribute your own thought leaders and frameworks that connect to the themes in {book.title}. 
          Help expand our understanding by sharing insights from thinkers who inspire your work.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Contribute a New Thinker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddThinkerForm />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        {showHelperPanels && (
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Book Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5" />
                    Book Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">{book.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{book.lead}</p>
                    <Badge variant="secondary" className="text-xs">{book.series_name}</Badge>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Consider how your thinker's ideas relate to the themes and concepts explored in this book.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="w-5 h-5" />
                    Contribution Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>Choose thinkers whose frameworks complement the book's themes</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>Provide clear explanations of their core ideas and methodologies</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>Explain how their work applies in modern contexts</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>Include practical examples and real-world applications</div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Community Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5" />
                    Community Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Your contributions help build a comprehensive knowledge base that benefits:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>• Other readers exploring similar concepts</li>
                      <li>• Researchers studying thought leadership evolution</li>
                      <li>• Practitioners applying frameworks in their work</li>
                      <li>• Students learning about intellectual history</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Contributions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium">Simon Sinek</div>
                      <div className="text-xs text-muted-foreground">Added 2 hours ago</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Brené Brown</div>
                      <div className="text-xs text-muted-foreground">Added 1 day ago</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Cal Newport</div>
                      <div className="text-xs text-muted-foreground">Added 2 days ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAddGuru;