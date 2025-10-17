import { useParams, Navigate } from "react-router-dom";
import { GCBATStoryMatrix } from "@/components/gcbat/GCBATStoryMatrix";
import { isPlaceholderParam } from "@/lib/route-guards";

export default function GCBATMatrixPage() {
  const { slug } = useParams<{ slug: string }>();

  // Guard against placeholder params
  if (!slug || isPlaceholderParam(slug)) {
    return <Navigate to="/books" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">Story-Character Matrix</h2>
        <p className="text-lg text-muted-foreground">
          Explore which Neural Ennead characters appear in each of the 32 BCI governance stories. 
          <span className="block mt-2">
            <strong>P</strong> = Protagonist · <strong>S</strong> = Supporting · <strong>C</strong> = Cameo
          </span>
        </p>
      </div>

      <GCBATStoryMatrix bookSlug={slug || 'gcbat-vignettes'} />
    </div>
  );
}
