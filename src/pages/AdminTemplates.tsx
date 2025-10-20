import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { seedBookTemplates, clearAllTemplates } from "@/lib/seed-templates";
import { useBookTemplates } from "@/hooks/useBookTemplates";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Trash2, Star } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminTemplates() {
  const { toast } = useToast();
  const { data: templates, isLoading, refetch } = useBookTemplates();
  const [isSeeding, setIsSeeding] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleSeedTemplates = async () => {
    setIsSeeding(true);
    try {
      const result = await seedBookTemplates();
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to seed templates",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearTemplates = async () => {
    try {
      const result = await clearAllTemplates();
      if (result.success) {
        toast({
          title: "Templates cleared",
          description: "All templates have been removed",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to clear templates",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
    setShowClearDialog(false);
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Book Templates Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage book templates for the self-service book creation system
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(true)}
              disabled={isSeeding || !templates || templates.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              onClick={handleSeedTemplates}
              disabled={isSeeding}
            >
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Seed Templates
                </>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Template Status</CardTitle>
            <CardDescription>
              {templates ? `${templates.length} templates available` : 'Loading templates...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : templates && templates.length > 0 ? (
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {template.name}
                            {template.is_featured && (
                              <Star className="h-4 w-4 fill-primary text-primary" />
                            )}
                          </CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Collection</p>
                          <p className="text-muted-foreground">{template.collection}</p>
                        </div>
                        <div>
                          <p className="font-medium">Usage Count</p>
                          <p className="text-muted-foreground">{template.usage_count}</p>
                        </div>
                        <div>
                          <p className="font-medium">Default Chapters</p>
                          <p className="text-muted-foreground">
                            {template.default_chapters.length} chapters
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Tabs</p>
                          <p className="text-muted-foreground">
                            {template.tab_config.length} tabs
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No templates found</p>
                <Button onClick={handleSeedTemplates} disabled={isSeeding}>
                  {isSeeding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Seed Default Templates
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all book templates. This action cannot be undone.
              You will need to re-seed the templates after clearing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearTemplates}>
              Delete All Templates
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
