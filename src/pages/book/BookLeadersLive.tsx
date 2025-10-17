import { useParams, Navigate } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { AllThinkersGrid } from "@/components/AllThinkersGrid";
import { TopThinkersPanel } from "@/components/TopThinkersPanel";
import { ThinkerDetailModal } from "@/components/ThinkerDetailModal";
import { EnhancedThinkerModal } from "@/components/EnhancedThinkerModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { THINKERS } from "@/data/thinkers";
import { useState } from "react";
import { Users, BookOpen, Star } from "lucide-react";
import { isPlaceholderParam } from "@/lib/route-guards";

const BookLeadersLive = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  
  // Guard against placeholder params
  if (!slug || isPlaceholderParam(slug)) {
    return <Navigate to="/books" replace />;
  }
  
  const book = books?.find(book => book.slug === slug);
  const [selectedThinker, setSelectedThinker] = useState<any>(null);

  if (!book) return null;

  // For now, show all thinkers - in a real implementation, 
  // you'd filter thinkers related to this specific book
  const relatedThinkers = THINKERS.slice(0, 8);

  const handleThinkerSelect = (thinker: any) => {
    setSelectedThinker(thinker);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Leaders Live</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Explore the thought leaders and frameworks that inspire and connect to {book.title}. 
          Discover how their ideas apply across different domains and contexts.
        </p>
      </div>

      {/* Featured Thinkers for this Book */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Featured Thinkers for {book.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              These thought leaders' frameworks are particularly relevant to the concepts explored in this book.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedThinkers.slice(0, 4).map((thinker, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleThinkerSelect(thinker)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{thinker.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{thinker.area}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{thinker.coreIdea}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* All Thinkers Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Thinkers</h2>
          <div className="text-sm text-muted-foreground">
            Explore the complete collection of thought leaders
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <AllThinkersGrid />
            <div className="mt-6">
              <div dangerouslySetInnerHTML={{
                __html: `<thinker-card data-src="/data/kahneman.json" data-book="${book.slug}"></thinker-card>`
              }} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <TopThinkersPanel 
              thinkers={THINKERS}
              onThinkerSelect={(name: string) => {
                const thinker = THINKERS.find(t => t.name === name);
                if (thinker) handleThinkerSelect(thinker);
              }}
            />
          </div>
        </div>
      </section>

      {/* Connection to Book */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              How These Thinkers Connect to {book.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                The frameworks and methodologies developed by these thought leaders provide 
                foundational concepts that are explored and expanded upon throughout {book.title}.
              </p>
              <p>
                By understanding their core ideas, you'll gain deeper insights into the 
                practical applications and implications discussed in each chapter.
              </p>
              <p>
                Each thinker's work contributes to the broader ecosystem of knowledge that 
                makes {book.series_name} a comprehensive resource for understanding modern 
                technology and human-centered design principles.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Thinker Modal */}
      {selectedThinker && (
        <EnhancedThinkerModal
          thinker={selectedThinker}
          isOpen={!!selectedThinker}
          onClose={() => setSelectedThinker(null)}
        />
      )}
    </div>
  );
};

export default BookLeadersLive;