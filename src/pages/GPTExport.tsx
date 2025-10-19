import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, FileJson, CheckCircle2, AlertCircle, Loader2, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  getGPTExportFiles, 
  exportExpandedThinkers, 
  consolidateBookContent, 
  downloadJSON,
  calculateCompletionStats,
  type GPTExportFile
} from "@/lib/gpt-export-utils";
import { useToast } from "@/hooks/use-toast";

const GPTExport = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [exported, setExported] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<GPTExportFile[]>([]);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const exportFiles = getGPTExportFiles();
    setFiles(exportFiles);
    const completionStats = calculateCompletionStats(exportFiles);
    setStats(completionStats);
  }, []);

  const exportDatabaseFile = async (exportType: string, filename: string) => {
    const key = filename;
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('export-gpt-data', {
        body: { type: exportType }
      });

      if (error) throw error;

      downloadJSON(data, filename);
      setExported(prev => ({ ...prev, [key]: true }));
      toast({
        title: "Export Complete",
        description: `${filename} has been downloaded`
      });
    } catch (error: any) {
      console.error(`Export error for ${exportType}:`, error);
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const exportExpandedThinkersFile = async () => {
    const key = '08-expanded-thinkers.json';
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const output = exportExpandedThinkers();
      downloadJSON(output, key);
      setExported(prev => ({ ...prev, [key]: true }));
      toast({
        title: "Export Complete",
        description: `Expanded thinkers exported successfully`
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const exportConsolidatedBooks = async () => {
    const key = '11-consolidated-book-content.json';
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const output = await consolidateBookContent();
      downloadJSON(output, key);
      setExported(prev => ({ ...prev, [key]: true }));
      toast({
        title: "Export Complete",
        description: `Consolidated ${output.file_count} book files`
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const exportAllReady = async () => {
    const readyFiles = files.filter(f => f.status === 'ready');
    toast({
      title: "Batch Export",
      description: `Preparing ${readyFiles.length} ready files for download...`
    });
    
    for (const file of readyFiles) {
      try {
        const response = await fetch(`/data/gpt-import/${file.filename}`);
        if (response.ok) {
          const data = await response.json();
          downloadJSON(data, file.filename);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to download ${file.filename}:`, error);
      }
    }
    
    toast({
      title: "Batch Export Complete",
      description: `Downloaded ${readyFiles.length} files`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default" className="bg-green-500">Ready</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'manual':
        return <Badge variant="outline">Manual</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPhaseColor = (phase: number) => {
    switch (phase) {
      case 1: return 'text-blue-600';
      case 2: return 'text-purple-600';
      case 3: return 'text-orange-600';
      case 4: return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">GPT Import Package Export</h1>
          <p className="text-muted-foreground">
            Complete data export system for The Thinking Engine GPT custom assistant
          </p>
        </div>

        {stats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>GPT Import Package Status</CardTitle>
              <CardDescription>
                Complete status of all 18 files across 4 phases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={stats.overall.completionPercent} className="flex-1" />
                    <span className="text-2xl font-bold">{stats.overall.completionPercent}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.overall.ready} of {stats.overall.total} files ready
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ready Tokens</p>
                  <p className="text-2xl font-bold mt-2">{stats.tokens.ready.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.tokens.pending.toLocaleString()} pending
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold mt-2">{stats.tokens.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    tokens when complete
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3 md:grid-cols-4">
                {stats.byPhase.map((phase: any) => (
                  <div key={phase.phase} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${getPhaseColor(phase.phase)}`}>
                        Phase {phase.phase}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {phase.ready}/{phase.total}
                      </span>
                    </div>
                    <Progress value={phase.completionPercent} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 mb-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common export operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={exportAllReady} className="w-full" size="lg">
                <Package className="mr-2 h-4 w-4" />
                Download All Ready Files
              </Button>
              <p className="text-xs text-muted-foreground">
                Downloads all 13 completed files from Phases 1, 3, and 4
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phase 2 Exports</CardTitle>
              <CardDescription>Complete content indexing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2">
                <Button
                  onClick={() => exportDatabaseFile('master_4500', '07-master-4500-records.json')}
                  disabled={loading['07-master-4500-records.json']}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {loading['07-master-4500-records.json'] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : exported['07-master-4500-records.json'] ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Master 4500 Records
                </Button>
                
                <Button
                  onClick={exportExpandedThinkersFile}
                  disabled={loading['08-expanded-thinkers.json']}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {loading['08-expanded-thinkers.json'] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : exported['08-expanded-thinkers.json'] ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Expanded Thinkers
                </Button>

                <Button
                  onClick={() => exportDatabaseFile('vignettes', '09-gcbat-vignettes.json')}
                  disabled={loading['09-gcbat-vignettes.json']}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {loading['09-gcbat-vignettes.json'] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : exported['09-gcbat-vignettes.json'] ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  GCBAT Vignettes
                </Button>

                <Button
                  onClick={() => exportDatabaseFile('characters', '10-gcbat-characters.json')}
                  disabled={loading['10-gcbat-characters.json']}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {loading['10-gcbat-characters.json'] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : exported['10-gcbat-characters.json'] ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  GCBAT Characters
                </Button>

                <Button
                  onClick={exportConsolidatedBooks}
                  disabled={loading['11-consolidated-book-content.json']}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {loading['11-consolidated-book-content.json'] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : exported['11-consolidated-book-content.json'] ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Consolidated Books
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Files by Phase</CardTitle>
            <CardDescription>Complete file list with status and token estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(phase => {
                const phaseFiles = files.filter(f => f.phase === phase);
                const phaseNames = {
                  1: 'Core Taxonomy',
                  2: 'Content Indexing',
                  3: 'Relationship Mapping',
                  4: 'Query Optimization'
                };
                
                return (
                  <div key={phase}>
                    <h3 className={`font-semibold mb-3 ${getPhaseColor(phase)}`}>
                      Phase {phase}: {phaseNames[phase as keyof typeof phaseNames]}
                    </h3>
                    <div className="space-y-2">
                      {phaseFiles.map(file => (
                        <div key={file.filename} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <FileJson className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{file.filename}</span>
                              {getStatusBadge(file.status)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-mono">{file.estimatedTokens.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">tokens</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Import instructions and validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">1. Complete Phase 2 Exports</h4>
                  <p className="text-muted-foreground">
                    Use the Phase 2 Exports panel above to download all 5 content files
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">2. Import to GPT Custom Assistant</h4>
                  <p className="text-muted-foreground mb-2">
                    Upload files in order: Phase 1 → Phase 2 → Phase 3 → Phase 4
                  </p>
                  <p className="text-xs text-muted-foreground">
                    See /public/data/gpt-import/QUICK-START.md for detailed instructions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">3. Test with Sample Queries</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                    <li>"Explain Daniel Kahneman's relevance to AI systems"</li>
                    <li>"How does Systems Thinking evolve across the 5 eras?"</li>
                    <li>"Show me all thinkers related to Decision Science"</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GPTExport;
