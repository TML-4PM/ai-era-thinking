import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Step4Props {
  wizard: ReturnType<typeof import("@/hooks/useBookWizard").useBookWizard>;
}

export const Step4PublishingOptions = ({ wizard }: Step4Props) => {
  const { state, updateBookData, nextStep, previousStep } = wizard;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Publishing Options</h3>
        <p className="text-muted-foreground">
          Configure how your book will be published and who can access it.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Book Status</Label>
              <Select
                value={state.bookData.status}
                onValueChange={(value: any) => updateBookData({ status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft - Work in progress</SelectItem>
                  <SelectItem value="in_progress">In Progress - Actively writing</SelectItem>
                  <SelectItem value="review">Review - Ready for feedback</SelectItem>
                  <SelectItem value="published">Published - Available to readers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="ready-flag">Mark as Ready</Label>
                <p className="text-sm text-muted-foreground">
                  Indicate that this book is ready for public viewing
                </p>
              </div>
              <Switch
                id="ready-flag"
                checked={state.bookData.ready_flag}
                onCheckedChange={(checked) => updateBookData({ ready_flag: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="is-public">Public Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anyone to view this book (you can change this later)
                </p>
              </div>
              <Switch
                id="is-public"
                checked={state.bookData.is_public}
                onCheckedChange={(checked) => updateBookData({ is_public: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="p-4 rounded-lg bg-muted space-y-2">
          <p className="text-sm font-medium">What happens next?</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Your book will be created with the structure you've defined</li>
            <li>You can start adding content to each chapter immediately</li>
            <li>
              {state.bookData.is_public 
                ? "The book will be visible to all users" 
                : "Only you can access the book until you make it public"}
            </li>
            <li>You can invite collaborators to help edit the book</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>
        <Button onClick={nextStep}>
          Review & Create
        </Button>
      </div>
    </div>
  );
};
