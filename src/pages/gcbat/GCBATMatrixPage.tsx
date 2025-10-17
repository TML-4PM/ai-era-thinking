import { useBooks } from "@/hooks/useBooks";
import { GCBATStoryMatrix } from "@/components/gcbat/GCBATStoryMatrix";
import { Helmet } from "react-helmet-async";
import { Grid3x3 } from "lucide-react";

export default function GCBATMatrixPage() {
  const SLUG = "gcbat-vignettes";
  const { data: books } = useBooks();
  const book = books?.find(b => b.slug === SLUG);

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>Story Matrix - {book.title}</title>
        <meta name="description" content="Interactive matrix showing which characters appear in each story" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Grid3x3 className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Story-Character Matrix</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Explore which Neural Ennead characters appear in each of the 32 BCI governance stories. 
            <span className="block mt-2">
              <strong>P</strong> = Protagonist · <strong>S</strong> = Supporting · <strong>C</strong> = Cameo
            </span>
          </p>
        </div>

        <GCBATStoryMatrix bookSlug={SLUG} />
      </div>
    </>
  );
}
