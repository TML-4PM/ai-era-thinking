import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Download,
  Code,
  Users,
  BarChart,
  Brain,
  Loader2,
  Play,
  Pause,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { THINKERS, Thinker } from "@/data/thinkers";
import { useToast } from "@/hooks/use-toast";

interface ThinkerResult {
  thinker: string;
  lobe: string;
  status: 'processing' | 'completed' | 'failed';
  expansions: any[];
  alignments: any[];
  processingTime: number;
  error?: string;
}

export const AllThinkersExpansion: React.FC = () => {
  const [concurrency, setConcurrency] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ThinkerResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState('calculating...');
  const { toast } = useToast();
  
  const [includeAlignment, setIncludeAlignment] = useState(false);

  const logDebug = (message: string) => {
    if (debugMode) {
      setDebugLogs(prevLogs => [...prevLogs, message]);
    }
  };

  const getDomainsForLobe = (lobe: string): string[] => {
    switch (lobe) {
      case 'Decision/Action':
        return ['risk-assessment', 'strategic-planning'];
      case 'Innovation/Strategy':
        return ['digital-transformation', 'competitive-analysis'];
      case 'Ethics/Governance':
        return ['regulatory-compliance', 'ethical-ai'];
      case 'Perception/Patterning':
        return ['digital-transformation', 'market-strategy'];
      case 'Culture/Behaviour':
        return ['change-management', 'organizational-culture'];
      default:
        return ['strategic-planning', 'change-management'];
    }
  };

  const processThinker = async (thinker: Thinker): Promise<ThinkerResult> => {
    const domains = getDomainsForLobe(thinker.lobe);
    const result: ThinkerResult = {
      thinker: thinker.name,
      lobe: thinker.lobe,
      status: 'processing',
      expansions: [],
      alignments: [],
      processingTime: 0
    };

    const startTime = Date.now();

    try {
      // Expansion
      const { data: expansionData, error: expansionError } = await supabase.functions.invoke('expand-thinker', {
        body: {
          thinkerName: thinker.name,
          thinkerArea: thinker.area,
          coreIdea: thinker.coreIdea,
          aiShift: thinker.aiShift,
          selectedDomains: domains,
          preferredModel: 'gpt-4.1-2025-04-14'
        }
      });

      if (expansionError) {
        throw new Error(`Expansion failed: ${expansionError.message}`);
      }

      result.expansions = expansionData?.results || [];

      // WorkFamilyAI Alignment (if enabled)
      if (includeAlignment) {
        const alignmentPromises = domains.map(async (domain) => {
          try {
            const { data: alignmentData, error: alignmentError } = await supabase.functions.invoke('align-workfamily', {
              body: {
                thinkerName: thinker.name,
                thinkerArea: thinker.area,
                coreIdea: thinker.coreIdea,
                aiShift: thinker.aiShift,
                domain: domain
              }
            });

            if (alignmentError) {
              console.error(`Alignment failed for ${thinker.name} (${domain}):`, alignmentError);
              return null;
            }

            return {
              domain: domain,
              alignments: alignmentData?.alignments || []
            };
          } catch (error) {
            console.error(`Alignment error for ${thinker.name} (${domain}):`, error);
            return null;
          }
        });

        const alignmentResults = await Promise.all(alignmentPromises);
        result.alignments = alignmentResults.filter(Boolean);
      }

      result.status = 'completed';
      result.processingTime = Date.now() - startTime;

    } catch (error) {
      console.error(`Error processing ${thinker.name}:`, error);
      result.status = 'failed';
      result.error = error.message;
      result.processingTime = Date.now() - startTime;
    }

    return result;
  };

  const startBulkProcessing = async () => {
    setIsRunning(true);
    setResults([]);
    setCompletedCount(0);
    setTotalCount(THINKERS.length);
    setProgress(0);
    setStartTime(Date.now());
    setEstimatedTimeRemaining('calculating...');

    const initialResults = THINKERS.map(thinker => ({
      thinker: thinker.name,
      lobe: thinker.lobe,
      status: 'processing',
      expansions: [],
      alignments: [],
      processingTime: 0
    } as ThinkerResult));
    setResults(initialResults);

    const startTime = Date.now();
    let completed = 0;

    const processNext = async (index: number) => {
      if (!isRunning || index >= THINKERS.length) {
        return;
      }

      const thinker = THINKERS[index];
      logDebug(`Starting processing for ${thinker.name} at index ${index}`);

      const result = await processThinker(thinker);
      logDebug(`Finished processing for ${thinker.name} with status ${result.status}`);

      setResults(prevResults => {
        const newResults = [...prevResults];
        newResults[index] = result;
        return newResults;
      });

      completed++;
      setCompletedCount(completed);
      const newProgress = (completed / THINKERS.length) * 100;
      setProgress(newProgress);

      // Estimate time remaining
      const elapsedTime = Date.now() - startTime;
      const averageTimePerThinker = elapsedTime / completed;
      const remainingThinkers = THINKERS.length - completed;
      const estimatedMsRemaining = averageTimePerThinker * remainingThinkers;
      const estimatedSeconds = Math.round(estimatedMsRemaining / 1000);
      const minutes = Math.floor(estimatedSeconds / 60);
      const seconds = estimatedSeconds % 60;
      setEstimatedTimeRemaining(`${minutes}m ${seconds}s`);

      // Recursive call
      processNext(index + concurrency);
    };

    // Start concurrent processing
    for (let i = 0; i < concurrency; i++) {
      processNext(i);
    }
  };

  const exportResults = () => {
    const exportData = results.map(result => ({
      thinker: result.thinker,
      lobe: result.lobe,
      status: result.status,
      processing_time_ms: result.processingTime,
      expansions: result.expansions,
      ...(includeAlignment && { alignments: result.alignments }),
      error: result.error || null
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkers-bulk-expansion-${includeAlignment ? 'with-alignment-' : ''}${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-brand" />
          Bulk Thinker Expansion & Alignment
        </h3>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Automatically expand all {THINKERS.length} thinkers across domains using GPT-4.1, with optional WorkFamilyAI Neural Ennead alignment
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Processing Controls</CardTitle>
          <CardDescription>
            Configure and run bulk expansion across all thinkers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Concurrency</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">1</span>
                <Slider
                  value={[concurrency]}
                  onValueChange={(value) => setConcurrency(value[0])}
                  max={3}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">3</span>
                <span className="text-sm font-medium min-w-[3ch]">{concurrency}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
              <label htmlFor="debug-mode" className="text-sm font-medium">
                Debug Mode
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="include-alignment"
              checked={includeAlignment}
              onCheckedChange={setIncludeAlignment}
            />
            <label htmlFor="include-alignment" className="text-sm font-medium">
              Include WorkFamilyAI Neural Ennead Alignment
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={startBulkProcessing}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Start Bulk Processing
            </Button>
            
            {isRunning && (
              <Button
                onClick={() => setIsRunning(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </Button>
            )}
            
            {results.length > 0 && (
              <Button
                onClick={exportResults}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Results ({results.length})
              </Button>
            )}
          </div>

          {/* Progress */}
          {(progress > 0 || isRunning) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {completedCount}/{totalCount} thinkers</span>
                <span>{Math.round(progress)}% • ETA: {estimatedTimeRemaining}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
            <CardDescription>
              {results.filter(r => r.status === 'completed').length} completed, {' '}
              {results.filter(r => r.status === 'failed').length} failed, {' '}
              {results.filter(r => r.status === 'processing').length} in progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={result.thinker} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {result.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {result.status === 'failed' && <XCircle className="w-4 h-4 text-destructive" />}
                      {result.status === 'processing' && <Loader2 className="w-4 h-4 text-brand animate-spin" />}
                    </div>
                    <div>
                      <span className="font-medium">{result.thinker}</span>
                      <div className="text-sm text-muted-foreground">
                        {result.lobe} • {result.expansions.length} expansions
                        {includeAlignment && result.alignments && (
                          <span> • {result.alignments.length} alignments</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {result.processingTime > 0 && `${(result.processingTime / 1000).toFixed(1)}s`}
                    {result.error && <div className="text-destructive text-xs">{result.error}</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Output */}
      {debugMode && debugLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
            <CardDescription>
              Detailed output for troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-64 overflow-y-auto text-xs">
              {debugLogs.map((log, index) => (
                <div key={index} className="font-mono">{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AllThinkersExpansion;
