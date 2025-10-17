import { useBooks } from "@/hooks/useBooks";
import { GCBATCharacterGrid } from "@/components/gcbat/GCBATCharacterGrid";
import { Helmet } from "react-helmet-async";
import { Users } from "lucide-react";

export default function GCBATCharactersPage() {
  const SLUG = "gcbat-vignettes";
  const { data: books } = useBooks();
  const book = books?.find(b => b.slug === SLUG);

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>Characters - {book.title}</title>
        <meta name="description" content="Meet the nine Neural Ennead characters" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Users className="w-8 h-8" />
            <h1 className="text-4xl font-bold">The Neural Ennead</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Nine professionals navigating Brain-Computer Interface governance across the GCBAT framework—
            from neural ethics and cognitive privacy to BCI architecture and neurotechnology policy.
          </p>
        </div>

        <GCBATCharacterGrid />
      </div>
    </>
  );
}
