import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useAutoSyncExemplar } from "@/hooks/useResearchLinks";
import { ResearchSyncService } from "@/services/ResearchSyncService";
import { useToast } from "@/hooks/use-toast";

interface ResearchAutoSyncProps {
  exemplarId: string;
  exemplarTitle: string;
  onSyncComplete?: () => void;
}

export const ResearchAutoSync: React.FC<ResearchAutoSyncProps> = ({
  exemplarId,
  exemplarTitle,
  onSyncComplete,
}) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [papersFound, setPapersFound] = useState(0);
  const { toast } = useToast();
  
  const syncMutation = useAutoSyncExemplar();

  const handleAutoSync = async () => {
    setSyncStatus('syncing');
    
    try {
      const result = await ResearchSyncService.syncExemplarToResearch(exemplarId);
      
      if (result.success) {
        setPapersFound(result.papersLinked);
        setSyncStatus('success');
        
        toast({
          title: "Research discovered",
          description: `Found and linked ${result.papersLinked} relevant paper${result.papersLinked !== 1 ? 's' : ''}`,
        });
        
        onSyncComplete?.();
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setSyncStatus('idle');
        }, 5000);
      } else {
        setSyncStatus('error');
        toast({
          title: "Discovery failed",
          description: "Unable to discover research papers. Please try again.",
          variant: "destructive",
        });
        
        // Reset error after 5 seconds
        setTimeout(() => {
          setSyncStatus('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('Auto-sync error:', error);
      setSyncStatus('error');
      
      toast({
        title: "Connection error",
        description: "Failed to connect to research database. Check your connection.",
        variant: "destructive",
      });
      
      // Reset error after 5 seconds
      setTimeout(() => {
        setSyncStatus('idle');
      }, 5000);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Auto-Discover Research
        </CardTitle>
        <CardDescription>
          Automatically find and link relevant research papers for "{exemplarTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            onClick={handleAutoSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2 w-full sm:w-auto"
            size="default"
          >
            {syncStatus === 'syncing' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Discovering papers...</span>
                <span className="sm:hidden">Discovering...</span>
              </>
            ) : syncStatus === 'success' ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Synced Successfully
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Discover Research
              </>
            )}
          </Button>

          {syncStatus === 'success' && papersFound > 0 && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Found {papersFound} paper{papersFound !== 1 ? 's' : ''}
            </Badge>
          )}

          {syncStatus === 'success' && papersFound === 0 && (
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
              <Info className="h-3 w-3 mr-1" />
              No papers found
            </Badge>
          )}

          {syncStatus === 'error' && (
            <Badge variant="secondary" className="bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20">
              <AlertCircle className="h-3 w-3 mr-1" />
              Discovery failed
            </Badge>
          )}
        </div>

        <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
          <p className="text-xs font-medium flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            How Auto-Discovery Works
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 pl-5">
            <li>• Intelligent tag matching using TAG_MAPPING</li>
            <li>• Automatic relevance scoring (1-10 scale)</li>
            <li>• Bidirectional sync with research database</li>
            <li>• Real-time updates across platforms</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
