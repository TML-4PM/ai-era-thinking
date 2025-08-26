import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Users,
  Brain,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { THINKERS, type Thinker } from '@/data/thinkers';

// Domain mapping based on lobe
const LOBE_TO_DOMAINS = {
  'Decision/Action': ['Healthcare & Medical Services', 'Financial Services & Banking', 'Government & Public Sector'],
  'Innovation/Strategy': ['Manufacturing & Supply Chain', 'Energy & Utilities', 'Transportation & Logistics'],
  'Ethics/Governance': ['Government & Public Sector', 'Legal & Professional Services', 'Healthcare & Medical Services'],
  'Perception/Patterning': ['Manufacturing & Supply Chain', 'Energy & Utilities', 'Transportation & Logistics'],
  'Culture/Behaviour': ['Education & Training', 'Media & Entertainment', 'Retail & E-commerce']
};

interface ThinkerResult {
  thinker: Thinker;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  expansions?: any[];
  error?: string;
  processingTime?: number;
  model?: string;
}

interface BulkProgress {
  current: number;
  total: number;
  completed: number;
  failed: number;
  startTime: number;
  estimatedTimeRemaining?: number;
}

export const AllThinkersExpansion: React.FC = () => {
  const [results, setResults] = useState<ThinkerResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [concurrency, setConcurrency] = useState(2);
  const [debugMode, setDebugMode] = useState(false);
  const [progress, setProgress] = useState<BulkProgress | null>(null);
  const { toast } = useToast();

  // Initialize results array
  const initializeRun = () => {
    const initialResults: ThinkerResult[] = THINKERS.map(thinker => ({
      thinker,
      status: 'pending'
    }));
    setResults(initialResults);
    setProgress({
      current: 0,
      total: THINKERS.length,
      completed: 0,
      failed: 0,
      startTime: Date.now()
    });
  };

  // Process a single thinker
  const processThinker = async (thinkerResult: ThinkerResult): Promise<ThinkerResult> => {
    const { thinker } = thinkerResult;
    const startTime = Date.now();
    
    // Get domains based on lobe
    const selectedDomains = LOBE_TO_DOMAINS[thinker.lobe] || LOBE_TO_DOMAINS['Innovation/Strategy'];
    
    if (debugMode) {
      console.log(`🚀 Processing ${thinker.name} with domains:`, selectedDomains);
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('expand-thinker', {
        body: {
          thinkerName: thinker.name,
          thinkerArea: thinker.area,
          coreIdea: thinker.coreIdea,
          aiShift: thinker.aiShift,
          selectedDomains,
          preferredModel: 'gpt-4.1-2025-04-14'
        }
      });

      if (error) {
        if (debugMode) {
          console.error(`❌ ${thinker.name} failed:`, error);
        }
        return {
          ...thinkerResult,
          status: 'failed',
          error: error.message,
          processingTime: Date.now() - startTime
        };
      }

      if (data?.error) {
        return {
          ...thinkerResult,
          status: 'failed',
          error: data.details || data.error,
          processingTime: Date.now() - startTime
        };
      }

      if (debugMode) {
        console.log(`✅ ${thinker.name} completed:`, data.expansions?.length, 'expansions');
      }

      return {
        ...thinkerResult,
        status: 'completed',
        expansions: data.expansions || [],
        processingTime: Date.now() - startTime,
        model: data.metadata?.batchResults?.[0]?.model || 'gpt-4.1-2025-04-14'
      };

    } catch (error) {
      if (debugMode) {
        console.error(`💥 ${thinker.name} crashed:`, error);
      }
      return {
        ...thinkerResult,
        status: 'failed',
        error: error.message || 'Network error',
        processingTime: Date.now() - startTime
      };
    }
  };

  // Update progress and results
  const updateThinkerResult = (index: number, updatedResult: ThinkerResult) => {
    setResults(prev => {
      const newResults = [...prev];
      newResults[index] = updatedResult;
      return newResults;
    });
    
    setProgress(prev => {
      if (!prev) return null;
      
      const completed = updatedResult.status === 'completed' ? prev.completed + 1 : prev.completed;
      const failed = updatedResult.status === 'failed' ? prev.failed + 1 : prev.failed;
      const current = completed + failed;
      
      // Estimate time remaining
      const elapsed = Date.now() - prev.startTime;
      const rate = current > 0 ? elapsed / current : 0;
      const remaining = prev.total - current;
      const estimatedTimeRemaining = remaining > 0 ? rate * remaining : 0;
      
      return {
        ...prev,
        current,
        completed,
        failed,
        estimatedTimeRemaining
      };
    });
  };

  // Main processing loop with concurrency control
  const runBulkExpansion = async () => {
    setIsRunning(true);
    setIsPaused(false);
    initializeRun();
    
    toast({
      title: "🚀 Bulk Expansion Started",
      description: `Processing all ${THINKERS.length} thinkers with concurrency ${concurrency}`
    });
    
    const processingQueue = [...THINKERS];
    const activePromises = new Map<number, Promise<void>>();
    let currentIndex = 0;
    
    while (currentIndex < THINKERS.length && isRunning) {
      // Check if paused
      while (isPaused && isRunning) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!isRunning) break;
      
      // Start new tasks up to concurrency limit
      while (activePromises.size < concurrency && currentIndex < THINKERS.length) {
        const index = currentIndex;
        const thinkerResult = results[index] || { thinker: THINKERS[index], status: 'pending' as const };
        
        // Mark as processing
        setResults(prev => {
          const newResults = [...prev];
          newResults[index] = { ...thinkerResult, status: 'processing' };
          return newResults;
        });
        
        // Start processing
        const promise = processThinker(thinkerResult).then(result => {
          updateThinkerResult(index, result);
          activePromises.delete(index);
        });
        
        activePromises.set(index, promise);
        currentIndex++;
      }
      
      // Wait for at least one task to complete
      if (activePromises.size > 0) {
        await Promise.race(activePromises.values());
      }
    }
    
    // Wait for all remaining tasks to complete
    await Promise.all(activePromises.values());
    
    setIsRunning(false);
    setIsPaused(false);
    
    // Final toast
    const finalResults = results.filter(r => r.status === 'completed' || r.status === 'failed');
    const completedCount = finalResults.filter(r => r.status === 'completed').length;
    const failedCount = finalResults.filter(r => r.status === 'failed').length;
    
    toast({
      title: "🎉 Bulk Expansion Complete",
      description: `${completedCount} succeeded, ${failedCount} failed out of ${THINKERS.length} thinkers`
    });
  };

  const pauseRun = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "▶️ Resumed" : "⏸️ Paused",
      description: isPaused ? "Bulk expansion resumed" : "Bulk expansion paused"
    });
  };

  const stopRun = () => {
    setIsRunning(false);
    setIsPaused(false);
    toast({
      title: "🛑 Stopped",
      description: "Bulk expansion stopped"
    });
  };

  const resetRun = () => {
    setResults([]);
    setProgress(null);
    setIsRunning(false);
    setIsPaused(false);
    toast({
      title: "🔄 Reset",
      description: "Ready to start new bulk expansion"
    });
  };

  // Export all results
  const handleExport = (format: 'json' | 'csv') => {
    const completedResults = results.filter(r => r.status === 'completed' && r.expansions?.length);
    
    if (completedResults.length === 0) {
      toast({
        title: "No Data",
        description: "No completed results to export",
        variant: "destructive"
      });
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      const exportData = {
        generatedAt: new Date().toISOString(),
        totalThinkers: THINKERS.length,
        completedThinkers: completedResults.length,
        results: completedResults.map(result => ({
          thinker: result.thinker.name,
          area: result.thinker.area,
          lobe: result.thinker.lobe,
          processingTime: result.processingTime,
          model: result.model,
          expansions: result.expansions
        }))
      };
      
      content = JSON.stringify(exportData, null, 2);
      filename = `all_thinkers_expansion_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      // CSV format - flatten all expansions
      const headers = ['Thinker', 'Area', 'Lobe', 'Domain', 'Relevance', 'Key Insights', 'Applications', 'Implementation', 'Challenges', 'Metrics'];
      const rows: string[][] = [];
      
      completedResults.forEach(result => {
        result.expansions?.forEach(expansion => {
          rows.push([
            result.thinker.name,
            result.thinker.area,
            result.thinker.lobe,
            expansion.domain,
            expansion.relevance,
            expansion.keyInsights?.join('; ') || '',
            expansion.practicalApplications?.join('; ') || '',
            expansion.implementationSteps?.join('; ') || '',
            expansion.challenges?.join('; ') || '',
            expansion.metrics?.join('; ') || ''
          ]);
        });
      });
      
      content = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      filename = `all_thinkers_expansion_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${completedResults.length} thinker results exported as ${format.toUpperCase()}`
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">All Thinkers Expansion</h2>
          <p className="text-muted-foreground">
            Generate framework expansions for all {THINKERS.length} thinkers using GPT-4.x
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Bulk Processing Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label>Concurrency (1-3 parallel requests)</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConcurrency(Math.max(1, concurrency - 1))}
                  disabled={isRunning || concurrency <= 1}
                >
                  -
                </Button>
                <Badge variant="secondary" className="px-3">
                  {concurrency}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConcurrency(Math.min(3, concurrency + 1))}
                  disabled={isRunning || concurrency >= 3}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={setDebugMode}
                disabled={isRunning}
              />
              <Label htmlFor="debug-mode">Debug Mode</Label>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={runBulkExpansion} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Bulk Expansion
              </Button>
            ) : (
              <Button onClick={pauseRun} variant="outline" className="flex items-center gap-2">
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            
            {isRunning && (
              <Button onClick={stopRun} variant="destructive" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Stop
              </Button>
            )}
            
            {!isRunning && results.length > 0 && (
              <Button onClick={resetRun} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Progress
              </span>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary">{progress.current}/{progress.total}</Badge>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {progress.completed}
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {progress.failed}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={(progress.current / progress.total) * 100} className="h-2" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {progress.current > 0 && progress.estimatedTimeRemaining 
                  ? `ETA: ${formatTime(progress.estimatedTimeRemaining)}`
                  : 'Calculating...'
                }
              </span>
              <span>
                Elapsed: {formatTime(Date.now() - progress.startTime)}
              </span>
            </div>
            
            {isPaused && (
              <Alert>
                <Pause className="w-4 h-4" />
                <AlertDescription>
                  Processing is paused. Click Resume to continue.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Results ({results.filter(r => r.status === 'completed').length}/{results.length})
              </CardTitle>
              
              {results.some(r => r.status === 'completed') && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport('json')}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    JSON
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport('csv')}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    CSV
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={result.thinker.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {result.status === 'pending' && <Clock className="w-4 h-4 text-muted-foreground" />}
                        {result.status === 'processing' && <Loader className="w-4 h-4 animate-spin text-primary" />}
                        {result.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {result.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-600" />}
                        
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="font-medium">{result.thinker.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {result.thinker.area} • {result.thinker.lobe}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      {result.status === 'completed' && (
                        <>
                          <Badge variant="secondary">
                            {result.expansions?.length || 0} expansions
                          </Badge>
                          {result.processingTime && (
                            <span className="text-muted-foreground">
                              {formatTime(result.processingTime)}
                            </span>
                          )}
                        </>
                      )}
                      
                      {result.status === 'failed' && result.error && (
                        <span className="text-red-600 text-xs max-w-48 truncate" title={result.error}>
                          {result.error}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};