import { useParams } from "react-router-dom";
import { useBooks } from "@/hooks/useBooks";
import { GCBATArcNavigator } from "@/components/gcbat/GCBATArcNavigator";

export default function GCBATLanding() {
  const { slug } = useParams<{ slug: string }>();
  const { data: books } = useBooks();
  const book = books?.find(b => b.slug === slug);

  if (!book) {
    return <div className="container mx-auto px-4 py-8">Book not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* About GCBAT Section */}
      <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
        <h2 className="text-xl font-semibold text-primary mb-2">About GCBAT & Brain-Computer Interfaces</h2>
        <p className="text-muted-foreground">
          GCBAT (Governance, Compliance, Business, Architecture, Technology) provides frameworks 
          for responsible development of Brain-Computer Interface systems. These 32 stories explore 
          the ethical, security, and societal challenges as neural augmentation becomes reality.
        </p>
      </div>

      {/* Story Arcs Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Story Arcs</h2>
          <p className="text-muted-foreground">
            Explore 32 BCI governance stories organized into 5 narrative arcs, each examining critical challenges 
            in the emergence of brain-computer interfaces.
          </p>
        </div>
        <GCBATArcNavigator bookSlug={slug || 'gcbat-vignettes'} />
      </div>
    </div>
  );
}
