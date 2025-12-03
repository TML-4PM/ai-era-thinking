import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBooks } from "@/hooks/useBooks";
import { GCBAT_ARCS } from "@/types/gcbat";
import { BookChapter } from "@/types/books";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GCBATArcPage() {
  const SLUG = "gcbat-vignettes";
  const { arcNumber } = useParams<{ arcNumber: string }>();
  const { data: books } = useBooks();
  const book = books?.find(b => b.slug === SLUG);
  const arc = GCBAT_ARCS.find(a => a.number === parseInt(arcNumber || '0'));

  const { data: chapters, isLoading } = useQuery({
    queryKey: ['arc-chapters', SLUG, arcNumber],
    queryFn: async () => {
      if (!book?.id || !arc) return [];

      const [start, end] = arc.chapterRange;
      const { data, error } = await supabase
        .from('book_chapters')
        .select('*')
        .eq('book_id', String(book.id))
        .gte('chapter_order', start)
        .lte('chapter_order', end)
        .order('chapter_order');
      
      if (error) throw error;
      return data.map(ch => ({
        id: ch.id,
        title: ch.title,
        sections: Array.isArray(ch.sections) ? ch.sections as string[] : [],
        progress: ch.progress_percentage || 0,
        chapter_order: ch.chapter_order
      })) as BookChapter[];
    },
    enabled: !!book && !!arc
  });

  if (!book || !arc) {
    return (
      <>
        <Helmet>
          <title>Arc Not Found</title>
        </Helmet>
        <div>Arc not found</div>
      </>
    );
  }

  const avgProgress = chapters?.length 
    ? Math.round(chapters.reduce((sum, ch) => sum + (ch.progress || 0), 0) / chapters.length)
    : 0;

  return (
    <>
      <Helmet>
        <title>{`Arc ${arc.number}: ${arc.name} - ${book.title}`}</title>
        <meta name="description" content={arc.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <Button variant="ghost" asChild>
          <Link to={`/books/${SLUG}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Book
          </Link>
        </Button>

        {/* Arc Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Arc {arc.number}
            </Badge>
            <h1 className="text-4xl font-bold">{arc.name}</h1>
          </div>
          <p className="text-xl text-muted-foreground">{arc.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{arc.storyCount} Stories</span>
            <span>·</span>
            <span>Chapters {arc.chapterRange[0]}-{arc.chapterRange[1]}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Arc Progress</span>
              <span className="font-medium">{avgProgress}%</span>
            </div>
            <Progress value={avgProgress} className="h-2" />
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Stories in this Arc</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(arc.storyCount)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {chapters?.map((chapter) => (
                <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Chapter {chapter.chapter_order}</Badge>
                          {chapter.progress === 100 && (
                            <Badge variant="default">Published</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{chapter.title}</CardTitle>
                      </div>
                      <Button asChild>
                        <Link to={`/books/${SLUG}/chapter/${chapter.chapter_order}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Read
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <Progress value={chapter.progress || 0} className="flex-1" />
                      <span className="text-muted-foreground min-w-[3rem]">
                        {chapter.progress || 0}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
