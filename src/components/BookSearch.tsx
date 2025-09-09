import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Book, FileText, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResult {
  type: 'book' | 'chapter';
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  book_title?: string;
  book_slug?: string;
  chapter_order?: number;
  slug?: string;
  match_snippet?: string;
}

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["book-search", query],
    queryFn: async () => {
      if (!query.trim()) return [];

      // Search books
      const { data: books, error: booksError } = await supabase
        .from("books")
        .select("id, title, subtitle, slug, lead_description")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,lead_description.ilike.%${query}%`);

      if (booksError) throw booksError;

      // Search chapters
      const { data: chapters, error: chaptersError } = await supabase
        .from("book_chapters")
        .select(`
          id, 
          title, 
          content, 
          chapter_order,
          book_id,
          books!inner(title, slug, status)
        `)
        .eq("is_published", true)
        .eq("books.status", "published")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`);

      if (chaptersError) throw chaptersError;

      const results: SearchResult[] = [
        ...books.map(book => ({
          type: 'book' as const,
          id: book.id,
          title: book.title,
          subtitle: book.subtitle,
          slug: book.slug,
          match_snippet: book.lead_description?.substring(0, 150) + "..."
        })),
        ...chapters.map(chapter => ({
          type: 'chapter' as const,
          id: chapter.id,
          title: chapter.title,
          book_title: chapter.books.title,
          book_slug: chapter.books.slug,
          chapter_order: chapter.chapter_order,
          match_snippet: chapter.content?.replace(/<[^>]*>/g, '').substring(0, 150) + "..."
        }))
      ];

      return results;
    },
    enabled: query.length >= 2,
  });

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search books and chapters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-9"
        />
      </div>

      {isOpen && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto">
          <div className="p-2">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : searchResults?.length ? (
              <div className="space-y-1">
                {searchResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    to={
                      result.type === 'book'
                        ? `/books/${result.slug}`
                        : `/books/${result.book_slug}/ch/${result.chapter_order}`
                    }
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="p-3 rounded-md hover:bg-muted transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {result.type === 'book' ? (
                            <Book className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {result.type === 'chapter' && result.chapter_order && (
                                <span className="text-muted-foreground mr-2">
                                  Ch. {result.chapter_order}:
                                </span>
                              )}
                              {result.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          {result.type === 'chapter' && result.book_title && (
                            <p className="text-xs text-muted-foreground mb-1">
                              from {result.book_title}
                            </p>
                          )}
                          {result.subtitle && result.type === 'book' && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {result.subtitle}
                            </p>
                          )}
                          {result.match_snippet && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {result.match_snippet}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BookSearch;