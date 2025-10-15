import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAutoSyncExemplar } from "@/hooks/useResearchLinks";
import { ResearchSyncService } from "@/services/ResearchSyncService";

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
  
  const syncMutation = useAutoSyncExemplar();

  const handleAutoSync = async () => {
    setSyncStatus('syncing');
    
    try {
      const result = await ResearchSyncService.syncExemplarToResearch(exemplarId);
      
      if (result.success) {
        setPapersFound(result.papersLinked);
        setSyncStatus('success');
        onSyncComplete?.();
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setSyncStatus('idle');
        }, 3000);
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Auto-sync error:', error);
      setSyncStatus('error');
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
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAutoSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2"
          >
            {syncStatus === 'syncing' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Discovering...
              </>
            ) : syncStatus === 'success' ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Synced
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Discover Research
              </>
            )}
          </Button>

          {syncStatus === 'success' && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
              Found {papersFound} paper{papersFound !== 1 ? 's' : ''}
            </Badge>
          )}

          {syncStatus === 'error' && (
            <Badge variant="secondary" className="bg-red-500/10 text-red-700 dark:text-red-300">
              <AlertCircle className="h-3 w-3 mr-1" />
              Sync failed
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>✨ Intelligent tag matching using TAG_MAPPING</p>
          <p>🔗 Automatic relevance scoring (1-10)</p>
          <p>📚 Links research papers to both platforms</p>
          <p>⚡ Real-time bidirectional sync</p>
        </div>
      </CardContent>
    </Card>
  );
};
