import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateBookFromTemplate } from "@/hooks/useBookTemplates";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen, Users, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Step5Props {
  wizard: ReturnType<typeof import("@/hooks/useBookWizard").useBookWizard>;
  onSuccess?: (bookId: string) => void;
  onClose: () => void;
}

export const Step5Review = ({ wizard, onSuccess, onClose }: Step5Props) => {
  const { state, previousStep, goToStep } = wizard;
  const createBook = useCreateBookFromTemplate();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!state.template) return;

    try {
      const book = await createBook.mutateAsync({
        template: state.template,
        bookData: state.bookData,
        chapters: state.chapters,
      });

      toast({
        title: "Book created successfully!",
        description: `"${state.bookData.title}" is ready to edit.`,
      });

      onClose();
      if (onSuccess) {
        onSuccess(book.id);
      } else {
        navigate(`/books/${book.slug}`);
      }
    } catch (error) {
      toast({
        title: "Error creating book",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review Your Book</h3>
        <p className="text-muted-foreground">
          Please review all details before creating your book. You can edit any section by clicking "Edit".
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Template & Basic Info</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => goToStep(1)}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Template</p>
              <p className="text-sm text-muted-foreground">{state.template?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Title</p>
              <p className="text-sm text-muted-foreground">{state.bookData.title}</p>
            </div>
            {state.bookData.subtitle && (
              <div>
                <p className="text-sm font-medium">Subtitle</p>
                <p className="text-sm text-muted-foreground">{state.bookData.subtitle}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {state.bookData.description}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Chapters ({state.chapters.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {state.chapters.map((chapter, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{index + 1}. </span>
                  {chapter.title}
                  <span className="text-muted-foreground ml-2">
                    ({chapter.sections.length} sections)
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Publishing Settings</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => goToStep(4)}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{state.bookData.status}</Badge>
              {state.bookData.ready_flag && (
                <Badge variant="default">Ready</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {state.bookData.is_public ? (
                <>
                  <Eye className="h-4 w-4 text-primary" />
                  <span>Public - Anyone can view this book</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <span>Private - Only you can view this book</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>
        <Button 
          onClick={handleCreate} 
          disabled={createBook.isPending}
        >
          {createBook.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Book...
            </>
          ) : (
            'Create Book'
          )}
        </Button>
      </div>
    </div>
  );
};
