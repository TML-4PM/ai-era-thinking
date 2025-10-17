import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GCBATCharacter, GCBATCharacterAppearance } from "@/types/gcbat";
import { BookChapter } from "@/types/books";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface GCBATStoryMatrixProps {
  bookSlug: string;
}

export const GCBATStoryMatrix = ({ bookSlug }: GCBATStoryMatrixProps) => {
  const navigate = useNavigate();

  const { data: characters, isLoading: loadingCharacters } = useQuery({
    queryKey: ['gcbat-characters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gcbat_characters')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as GCBATCharacter[];
    }
  });

  const { data: stories, isLoading: loadingStories } = useQuery({
    queryKey: ['gcbat-stories', bookSlug],
    queryFn: async () => {
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('id')
        .eq('slug', bookSlug)
        .single();
      
      if (bookError) throw bookError;

      const { data, error } = await supabase
        .from('book_chapters')
        .select('*')
        .eq('book_id', bookData.id)
        .gte('chapter_order', 11)
        .lte('chapter_order', 46)
        .order('chapter_order');
      
      if (error) throw error;
      return data.map(ch => ({
        id: ch.id,
        title: ch.title,
        sections: Array.isArray(ch.sections) ? ch.sections as string[] : [],
        progress: ch.progress_percentage || 0,
        chapter_order: ch.chapter_order
      })) as BookChapter[];
    }
  });

  const { data: appearances, isLoading: loadingAppearances } = useQuery({
    queryKey: ['gcbat-appearances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gcbat_character_appearances')
        .select('*');
      
      if (error) throw error;
      return data as GCBATCharacterAppearance[];
    }
  });

  const getAppearanceType = (storyId: string | number, characterId: string): string | null => {
    const appearance = appearances?.find(
      a => a.story_chapter_id === String(storyId) && a.character_id === characterId
    );
    return appearance?.appearance_type || null;
  };

  const getAppearanceBadge = (type: string | null) => {
    if (!type) return null;
    
    const variants = {
      protagonist: { variant: "default" as const, label: "P" },
      supporting: { variant: "secondary" as const, label: "S" },
      cameo: { variant: "outline" as const, label: "C" }
    };

    const config = variants[type as keyof typeof variants];
    return (
      <Badge variant={config.variant} className="w-8 h-8 flex items-center justify-center">
        {config.label}
      </Badge>
    );
  };

  if (loadingCharacters || loadingStories || loadingAppearances) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background min-w-[200px]">Story</TableHead>
            {characters?.map((character) => (
              <TableHead key={character.id} className="text-center min-w-[100px]">
                <div className="text-xs">{character.name}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories?.map((story) => (
            <TableRow 
              key={story.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/books/${bookSlug}/story/${String(story.id)}`)}
            >
              <TableCell className="sticky left-0 bg-background font-medium">
                <div className="text-sm">{story.title}</div>
                <div className="text-xs text-muted-foreground">Chapter {story.chapter_order}</div>
              </TableCell>
              {characters?.map((character) => (
                <TableCell key={character.id} className="text-center">
                  {getAppearanceBadge(getAppearanceType(story.id!, character.id))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
