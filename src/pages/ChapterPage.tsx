import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, Clock, BookOpen, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";
import { useToast } from "@/hooks/use-toast";

interface Chapter {
  id: string;
  title: string;
  content: string;
  chapter_order: number;
  is_published: boolean;
  word_count: number;
  est_read_minutes: number;
  sections: string[];
  chapter_status: string;
}

interface Book {
  id: string;
  title: string;
  subtitle: string;
  status: string;
}

const ChapterPage = () => {
  const { slug, chapterOrder } = useParams<{ slug: string; chapterOrder: string }>();
  const { toast } = useToast();

  const { data: book, isLoading: bookLoading } = useQuery({
    queryKey: ["book", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, subtitle, status")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Book | null;
    },
    enabled: !!slug,
  });

  const { data: chapter, isLoading: chapterLoading } = useQuery({
    queryKey: ["chapter", book?.id, chapterOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("book_chapters")
        .select("*")
        .eq("book_id", book!.id)
        .eq("chapter_order", parseInt(chapterOrder!))
        .maybeSingle();

      if (error) throw error;
      return data as Chapter | null;
    },
    enabled: !!book?.id && !!chapterOrder,
  });

  const { data: allChapters } = useQuery({
    queryKey: ["book-chapters", book?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("book_chapters")
        .select("chapter_order, title, is_published")
        .eq("book_id", book!.id)
        .eq("is_published", true)
        .order("chapter_order");

      if (error) throw error;
      return data;
    },
    enabled: !!book?.id,
  });

  // Check if user has admin access
  const { data: isAdmin } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      return !!data;
    },
  });

  if (bookLoading || chapterLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (!book) {
    return <Navigate to="/books" replace />;
  }

  // Check access permissions
  const canAccess = book.status === "published" || isAdmin;
  const chapterCanAccess = chapter?.is_published || isAdmin;

  if (!canAccess || !chapterCanAccess || !chapter) {
    toast({
      title: "Chapter not available",
      description: "This chapter is not published yet.",
      variant: "destructive",
    });
    return <Navigate to={`/books/${slug}`} replace />;
  }

  const currentIndex = allChapters?.findIndex(c => c.chapter_order === chapter.chapter_order) ?? -1;
  const prevChapter = currentIndex > 0 ? allChapters![currentIndex - 1] : null;
  const nextChapter = currentIndex < (allChapters?.length ?? 0) - 1 ? allChapters![currentIndex + 1] : null;

  const sanitizedContent = DOMPurify.sanitize(chapter.content);

  const generateTOC = () => {
    if (!chapter.sections || chapter.sections.length === 0) return null;
    
    return (
      <Card className="mb-8 p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          In This Chapter
        </h3>
        <ul className="space-y-1 text-sm">
          {chapter.sections.map((section, index) => (
            <li key={index}>
              <a 
                href={`#section-${index}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {section}
              </a>
            </li>
          ))}
        </ul>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>{chapter.title} - {book.title}</title>
        <meta name="description" content={`Chapter ${chapter.chapter_order}: ${chapter.title} from ${book.title}${book.subtitle ? ` - ${book.subtitle}` : ''}`} />
        <meta property="og:title" content={`${chapter.title} - ${book.title}`} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`/books/${slug}/ch/${chapterOrder}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to={`/books/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to {book.title}
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Chapter {chapter.chapter_order}</span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {chapter.est_read_minutes} min read
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span>{chapter.word_count} words</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
          
          {chapter.chapter_status && (
            <Badge variant="outline" className="mb-4">
              {chapter.chapter_status.charAt(0).toUpperCase() + chapter.chapter_status.slice(1)}
            </Badge>
          )}
        </div>

        {generateTOC()}

        <article className="prose prose-gray dark:prose-invert max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </article>

        <div className="flex justify-between items-center pt-8 border-t">
          {prevChapter ? (
            <Link to={`/books/${slug}/ch/${prevChapter.chapter_order}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous: {prevChapter.title}
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <Link to={`/books/${slug}/ch/${nextChapter.chapter_order}`}>
              <Button className="flex items-center gap-2">
                Next: {nextChapter.title}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to={`/books/${slug}`}>
              <Button variant="outline">
                Back to Book
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterPage;