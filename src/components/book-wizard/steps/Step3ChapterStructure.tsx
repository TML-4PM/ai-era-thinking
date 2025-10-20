import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ChapterTemplate } from "@/types/book-templates";

interface Step3Props {
  wizard: ReturnType<typeof import("@/hooks/useBookWizard").useBookWizard>;
}

export const Step3ChapterStructure = ({ wizard }: Step3Props) => {
  const { state, updateChapters, removeChapter, addChapter, nextStep, previousStep } = wizard;
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleRemoveChapter = (index: number) => {
    removeChapter(index);
  };

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      addChapter({
        title: newChapterTitle,
        sections: ['Section 1'],
        order: state.chapters.length + 1,
      });
      setNewChapterTitle('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Chapter Structure</h3>
        <p className="text-muted-foreground">
          Review and customize your book's chapters. These are suggestions based on your template.
        </p>
      </div>

      <div className="space-y-3">
        {state.chapters.map((chapter, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 cursor-move" />
                <div className="flex-1">
                  <CardTitle className="text-base">
                    Chapter {index + 1}: {chapter.title}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveChapter(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {chapter.sections.map((section, sIndex) => (
                  <Badge key={sIndex} variant="secondary">
                    {section}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Label htmlFor="new-chapter">Add Custom Chapter</Label>
            <div className="flex gap-2">
              <Input
                id="new-chapter"
                placeholder="Chapter title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChapter()}
              />
              <Button onClick={handleAddChapter} disabled={!newChapterTitle.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={state.chapters.length === 0}>
          Continue to Publishing
        </Button>
      </div>
    </div>
  );
};
