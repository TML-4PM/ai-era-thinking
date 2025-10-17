import { useParams, Link } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { GCBATCharacterGrid } from "@/components/gcbat/GCBATCharacterGrid";
import { GCBATArcNavigator } from "@/components/gcbat/GCBATArcNavigator";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet-async";
import { Grid3x3, BookOpen } from "lucide-react";

export default function GCBATLanding() {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  const book = books?.find(b => b.slug === slug);

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>{book.title} - Tech for Humanity</title>
        <meta name="description" content={book.lead} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">{book.title}</h1>
          {book.subtitle && (
            <p className="text-xl text-muted-foreground">{book.subtitle}</p>
          )}
          <p className="text-lg leading-relaxed">{book.lead}</p>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-semibold text-primary">About GCBAT & Brain-Computer Interfaces</p>
            <p className="text-sm text-muted-foreground mt-2">
              GCBAT (Governance, Compliance, Business, Architecture, Technology) provides frameworks 
              for responsible development of Brain-Computer Interface systems. These 32 stories explore 
              the ethical, security, and societal challenges as neural augmentation becomes reality.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center mt-6">
            <Button asChild size="lg">
              <Link to={`/books/${slug}/chapters`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Start Reading
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={`/books/${slug}/matrix`}>
                <Grid3x3 className="mr-2 h-4 w-4" />
                View Story Matrix
              </Link>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Characters Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Meet the Neural Ennead</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nine professionals navigating the ethical, technical, and societal challenges of Brain-Computer Interface governance
            </p>
          </div>
          <GCBATCharacterGrid />
        </div>

        <Separator />

        {/* Arcs Section */}
        <GCBATArcNavigator bookSlug={slug!} />
      </div>
    </>
  );
}
