import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, ArrowRight, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Book as BookType } from "@/types/books";

interface SuiteHubProps {
  suiteBook: BookType;
  volumes: BookType[];
}

export function SuiteHub({ suiteBook, volumes }: SuiteHubProps) {
  const navigate = useNavigate();

  const handleVolumeClick = (slug: string) => {
    navigate(`/books/${slug}`);
  };

  const completedVolumes = volumes.filter(v => v.status === "completed" || v.ready_flag).length;
  const inProgressVolumes = volumes.filter(v => v.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Suite Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Book className="h-8 w-8 text-primary mr-3" />
            <Badge variant="secondary" className="text-sm">
              {volumes.length}-Part Collection
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {suiteBook.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            {suiteBook.lead_description}
          </p>
          
          {/* Progress Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedVolumes}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{inProgressVolumes}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{volumes.length - completedVolumes - inProgressVolumes}</div>
              <div className="text-sm text-muted-foreground">Planned</div>
            </div>
          </div>
        </div>

        {/* Volume Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {volumes.map((volume, index) => (
            <Card 
              key={volume.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-primary/20 hover:border-l-primary"
              onClick={() => handleVolumeClick(volume.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleVolumeClick(volume.slug);
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    Part {index + 1}
                  </Badge>
                  <Badge 
                    variant={
                      volume.status === "completed" || volume.ready_flag ? "default" :
                      volume.status === "in_progress" ? "secondary" :
                      "outline"
                    }
                    className="text-xs"
                  >
                    {volume.status === "completed" || volume.ready_flag ? "Ready" :
                     volume.status === "in_progress" ? "In Progress" :
                     "Planned"}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {volume.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4 line-clamp-2">
                  {volume.lead_description}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {volume.chapters && volume.chapters.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Book className="h-3 w-3" />
                        {volume.chapters.length} ch
                      </div>
                    )}
                    {volume.owner && volume.owner !== "TBA" && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {volume.owner}
                      </div>
                    )}
                    {volume.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(volume.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Suite Actions */}
        <div className="text-center">
          <div className="bg-card rounded-lg p-8 border">
            <h3 className="text-xl font-semibold mb-4">Explore the Complete {suiteBook.title} Collection</h3>
            <p className="text-muted-foreground mb-6">
              Each section builds on the others to create a comprehensive exploration of {suiteBook.series_name?.toLowerCase()}.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => navigate('/books')} variant="outline">
                All Books
              </Button>
              <Button onClick={() => navigate('/thinkers')}>
                Featured Thinkers
              </Button>
              <Button onClick={() => navigate('/frameworks')}>
                Frameworks
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}