import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  GripVertical, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChapterEditor from './ChapterEditor';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  chapter_order: number;
  progress_percentage: number;
  sections?: string[];
}

interface ChapterManagerProps {
  bookId: string;
  chapters: Chapter[];
}

const ChapterManager = ({ bookId, chapters }: ChapterManagerProps) => {
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [showContent, setShowContent] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reorderChaptersMutation = useMutation({
    mutationFn: async (reorderedChapters: Chapter[]) => {
      const updates = reorderedChapters.map((chapter, index) => ({
        id: chapter.id,
        chapter_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('book_chapters')
          .update({ chapter_order: update.chapter_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Chapters reordered",
        description: "Chapter order has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error reordering chapters",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const createChapterMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('book_chapters')
        .insert({
          book_id: bookId,
          title: newChapterTitle,
          chapter_order: chapters.length + 1,
          progress_percentage: 0,
          content: ''
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setNewChapterTitle('');
      toast({
        title: "Chapter created",
        description: "New chapter has been added successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating chapter",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteChapterMutation = useMutation({
    mutationFn: async (chapterId: string) => {
      const { error } = await supabase
        .from('book_chapters')
        .delete()
        .eq('id', chapterId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Chapter deleted",
        description: "Chapter has been removed successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting chapter",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedChapters = Array.from(chapters);
    const [reorderedItem] = reorderedChapters.splice(result.source.index, 1);
    reorderedChapters.splice(result.destination.index, 0, reorderedItem);

    reorderChaptersMutation.mutate(reorderedChapters);
  };

  const toggleShowContent = (chapterId: string) => {
    setShowContent(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  if (editingChapter) {
    return (
      <ChapterEditor
        chapter={editingChapter}
        bookId={bookId}
        onSave={() => setEditingChapter(null)}
        onCancel={() => setEditingChapter(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Chapter */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Chapter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Enter chapter title..."
              onKeyPress={(e) => e.key === 'Enter' && newChapterTitle.trim() && createChapterMutation.mutate()}
            />
            <Button
              onClick={() => createChapterMutation.mutate()}
              disabled={!newChapterTitle.trim() || createChapterMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chapters List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {chapters
                .sort((a, b) => a.chapter_order - b.chapter_order)
                .map((chapter, index) => (
                  <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="w-full"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">
                                    {chapter.chapter_order}. {chapter.title}
                                  </CardTitle>
                                  <Badge variant="outline">
                                    {chapter.progress_percentage}%
                                  </Badge>
                                </div>
                                <Progress value={chapter.progress_percentage} className="w-32 h-2" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowContent(chapter.id)}
                              >
                                {showContent[chapter.id] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingChapter(chapter)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteChapterMutation.mutate(chapter.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {showContent[chapter.id] && (
                          <CardContent className="pt-0">
                            {chapter.sections && chapter.sections.length > 0 && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                  {chapter.sections.map((section, index) => (
                                    <Badge key={index} variant="secondary">
                                      {section}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {chapter.content && (
                              <div 
                                className="prose prose-sm max-w-none text-sm text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: chapter.content }}
                              />
                            )}
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ChapterManager;