import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ImageResult {
  id: string;
  title: string;
  creator: string;
  creator_url?: string;
  license: string;
  license_url?: string;
  attribution: string;
  url: string;
  thumbnail: string;
  tags: Array<{ name: string }>;
}

interface ImageSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelected: (imageUrl: string, attribution: string) => void;
}

export function ImageSearchModal({ open, onOpenChange, onImageSelected }: ImageSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const searchImages = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('openverse-images', {
        body: { action: 'search', query: query.trim() }
      });

      if (error) throw error;
      setResults(data.images || []);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search for images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const downloadImage = async (image: ImageResult) => {
    setDownloadingId(image.id);
    try {
      const { data, error } = await supabase.functions.invoke('openverse-images', {
        body: { 
          action: 'download', 
          imageUrl: image.url,
          title: image.title,
          creator: image.creator,
          license: image.license,
          license_url: image.license_url,
          attribution: image.attribution,
          tags: image.tags,
        }
      });

      if (error) throw error;

      toast({
        title: "Image Downloaded",
        description: "Image has been saved and is ready to use.",
      });

      onImageSelected(data.publicUrl, image.attribution);
      onOpenChange(false);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Free Images</DialogTitle>
          <DialogDescription>
            Search millions of free images from Openverse. All images are licensed for reuse.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Search for book cover images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        <div className="flex-1 overflow-auto">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {results.map((image) => (
                <div key={image.id} className="border rounded-lg p-3 space-y-2">
                  <div className="aspect-video relative overflow-hidden rounded bg-muted">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium line-clamp-1">{image.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      by {image.creator}
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {image.license.toUpperCase()}
                      </Badge>
                      {image.license_url && (
                        <a
                          href={image.license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image)}
                      disabled={downloadingId === image.id}
                      className="flex-1"
                    >
                      {downloadingId === image.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Download className="h-3 w-3 mr-1" />
                      )}
                      Use
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(image.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : query && !isSearching ? (
            <div className="text-center text-muted-foreground py-8">
              No images found. Try different keywords.
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Enter a search term to find free images for your book covers.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}