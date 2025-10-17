import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, Clock, BookOpen, ArrowLeft } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";
import { isPlaceholderParam } from "@/lib/route-guards";

const StaticChapterPage = () => {
  const { slug, chapterNumber } = useParams<{ slug: string; chapterNumber: string }>();
  const { data: books, isLoading } = useBooks();
  
  // Guard against placeholder params
  if (!slug || !chapterNumber || isPlaceholderParam(slug) || isPlaceholderParam(chapterNumber)) {
    return <Navigate to="/books" replace />;
  }

  if (isLoading) {
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

  const book = books?.find(b => b.slug === slug);
  if (!book || !book.chapters || book.chapters.length === 0) {
    return <Navigate to={`/books/${slug}`} replace />;
  }

  const chapterIndex = parseInt(chapterNumber || "1") - 1;
  const chapter = book.chapters[chapterIndex];
  
  if (!chapter) {
    return <Navigate to={`/books/${slug}/chapters`} replace />;
  }

  const prevChapter = chapterIndex > 0 ? book.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < book.chapters.length - 1 ? book.chapters[chapterIndex + 1] : null;

  // Calculate estimated reading time (rough estimate: 200 words per minute, 50 words per section)
  const wordCount = (chapter.sections?.length || 0) * 50;
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

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

  const renderPlaceholderContent = () => {
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg mb-8">
          <h3 className="text-xl font-semibold mb-2">Chapter Content Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            This chapter is currently being developed. Check back soon for the full content.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">{chapter.progress || 0}% Complete</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{chapter.sections?.length || 0} sections planned</span>
          </div>
        </div>

        {chapter.sections && chapter.sections.length > 0 && (
          <>
            <h2>Planned Sections</h2>
            <div className="grid gap-4 my-6">
              {chapter.sections.map((section, index) => (
                <Card key={index} className="p-4" id={`section-${index}`}>
                  <h3 className="text-lg font-semibold mb-2">{section}</h3>
                  <p className="text-muted-foreground">
                    Content for this section is currently in development.
                  </p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{chapter.title} - {book.title}</title>
        <meta name="description" content={`Chapter ${chapterIndex + 1}: ${chapter.title} from ${book.title}${book.subtitle ? ` - ${book.subtitle}` : ''}`} />
        <meta property="og:title" content={`${chapter.title} - ${book.title}`} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`/books/${slug}/chapter/${chapterNumber}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to={`/books/${slug}/chapters`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to {book.title}
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Chapter {chapterIndex + 1}</span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readMinutes} min read
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span>{wordCount} words (est.)</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
          
          <Badge variant="outline" className="mb-4">
            {chapter.progress || 0}% Complete
          </Badge>
        </div>

        {generateTOC()}

        <article className="mb-8">
          {renderPlaceholderContent()}
        </article>

        <div className="flex justify-between items-center pt-8 border-t">
          {prevChapter ? (
            <Link to={`/books/${slug}/chapter/${chapterIndex}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous: {prevChapter.title}
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <Link to={`/books/${slug}/chapter/${chapterIndex + 2}`}>
              <Button className="flex items-center gap-2">
                Next: {nextChapter.title}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to={`/books/${slug}/chapters`}>
              <Button variant="outline">
                Back to Chapters
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default StaticChapterPage;
