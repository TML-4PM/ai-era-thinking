import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import RichTextEditor from './RichTextEditor';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  chapter_order: number;
  progress_percentage: number;
  sections?: string[];
}

interface ChapterEditorProps {
  chapter: Chapter;
  bookId: string;
  onSave: () => void;
  onCancel: () => void;
}

const ChapterEditor = ({ chapter, bookId, onSave, onCancel }: ChapterEditorProps) => {
  const [title, setTitle] = useState(chapter.title);
  const [content, setContent] = useState(chapter.content || '');
  const [progress, setProgress] = useState(chapter.progress_percentage);
  const [sections, setSections] = useState<string[]>(chapter.sections || []);
  const [newSection, setNewSection] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveChapterMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('book_chapters')
        .update({
          title,
          content,
          progress_percentage: progress,
          sections
        })
        .eq('id', chapter.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Chapter saved",
        description: "Your changes have been saved successfully."
      });
      onSave();
    },
    onError: (error: any) => {
      toast({
        title: "Error saving chapter",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const addSection = () => {
    if (newSection.trim()) {
      setSections([...sections, newSection.trim()]);
      setNewSection('');
    }
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Edit Chapter {chapter.chapter_order}</span>
          <div className="flex gap-2">
            <Button
              onClick={() => saveChapterMutation.mutate()}
              disabled={saveChapterMutation.isPending}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chapter Title */}
        <div>
          <label className="text-sm font-medium mb-2 block">Chapter Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chapter title..."
          />
        </div>

        {/* Progress */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Progress: {progress}%
          </label>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1" />
            <Input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        {/* Sections */}
        <div>
          <label className="text-sm font-medium mb-2 block">Sections</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {sections.map((section, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {section}
                <button
                  onClick={() => removeSection(index)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="Add section..."
              onKeyPress={(e) => e.key === 'Enter' && addSection()}
            />
            <Button onClick={addSection} size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="text-sm font-medium mb-2 block">Chapter Content</label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your chapter content here..."
            className="min-h-[400px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChapterEditor;