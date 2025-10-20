import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookTemplates } from "@/hooks/useBookTemplates";
import { BookTemplate } from "@/types/book-templates";
import { Check, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";

interface Step1Props {
  wizard: ReturnType<typeof import("@/hooks/useBookWizard").useBookWizard>;
}

export const Step1TemplateSelection = ({ wizard }: Step1Props) => {
  const { data: templates, isLoading } = useBookTemplates();
  const { state, setTemplate, nextStep } = wizard;

  const handleSelectTemplate = (template: BookTemplate) => {
    setTemplate(template);
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Book Template</h3>
        <p className="text-muted-foreground">
          Select a template that best fits your book's structure and purpose. You can customize everything later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates?.map((template) => {
          const IconComponent = Icons[template.icon as keyof typeof Icons] as any;
          const isSelected = state.templateId === template.id;
          
          return (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg relative ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start gap-3">
                  {IconComponent && (
                    <div className="mt-1 p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {template.name}
                      {template.is_featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Best for:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.best_for.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {template.example_books.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Examples:</p>
                    <p className="text-xs text-muted-foreground">
                      {template.example_books.join(', ')}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium mb-1">Features:</p>
                  <p className="text-xs text-muted-foreground">
                    {template.features.slice(0, 2).join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={nextStep} disabled={!state.template}>
          Continue to Basic Info
        </Button>
      </div>
    </div>
  );
};
