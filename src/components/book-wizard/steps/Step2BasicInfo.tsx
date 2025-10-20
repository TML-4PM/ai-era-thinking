import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Step2Props {
  wizard: ReturnType<typeof import("@/hooks/useBookWizard").useBookWizard>;
}

export const Step2BasicInfo = ({ wizard }: Step2Props) => {
  const { state, updateBookData, nextStep, previousStep } = wizard;
  const [title, setTitle] = useState(state.bookData.title);
  const [subtitle, setSubtitle] = useState(state.bookData.subtitle);
  const [description, setDescription] = useState(state.bookData.description);
  const [seriesName, setSeriesName] = useState(state.bookData.series_name || '');

  const handleContinue = () => {
    updateBookData({
      title,
      subtitle,
      description,
      series_name: seriesName || undefined,
    });
    nextStep();
  };

  const canContinue = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Book Information</h3>
        <p className="text-muted-foreground">
          Provide basic details about your book. You can always edit these later.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter your book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            placeholder="Optional subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your book's content and purpose"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            This will be displayed on the book's overview page
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="series">Series Name</Label>
          <Input
            id="series"
            placeholder={state.template?.suggested_series || "Optional series name"}
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Group related books together in a series
          </p>
        </div>

        {state.template && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium mb-1">Template: {state.template.name}</p>
            <p className="text-sm text-muted-foreground">
              Collection: {state.template.collection}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!canContinue}>
          Continue to Chapters
        </Button>
      </div>
    </div>
  );
};
