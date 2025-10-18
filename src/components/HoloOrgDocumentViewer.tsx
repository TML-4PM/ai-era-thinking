import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StorageFile {
  name: string;
  id: string;
  updated_at: string | null;
  created_at: string;
  last_accessed_at: string | null;
  metadata: Record<string, any> | null;
}

const HoloOrgDocumentViewer = () => {
  const { data: files, isLoading, error } = useQuery({
    queryKey: ['holo-org-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from('core-holoorg-documents')
        .list();

      if (error) throw error;
      return data;
    }
  });

  const getFileUrl = (fileName: string) => {
    const { data } = supabase
      .storage
      .from('core-holoorg-documents')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Error loading Holo-Org documents: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!files || files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No documents available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-foreground">WorkFamilyAI Documentation</h3>
        <p className="text-sm text-muted-foreground">
          Core Holo-Org documentation and WorkFamilyAI implementation guides
        </p>
      </div>

      <div className="grid gap-4">
        {files.map((file) => {
          const url = getFileUrl(file.name);
          const isPDF = file.name.toLowerCase().endsWith('.pdf');

          return (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle className="text-base mb-1">{file.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {formatFileSize(file.metadata?.size)} • 
                        Updated {formatDate(file.updated_at || file.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {isPDF ? 'Open PDF' : 'View'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = file.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HoloOrgDocumentViewer;
