import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Database, FileJson, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EXPANDED_THINKERS } from "@/data/expanded-thinkers";

export default function GPTExport() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [exported, setExported] = useState<{ [key: string]: boolean }>({});

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportMaster4500 = async () => {
    setLoading(prev => ({ ...prev, master: true }));
    try {
      const { data, error } = await supabase.functions.invoke('export-gpt-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      downloadJSON(data, '07-master-4500-records.json');
      setExported(prev => ({ ...prev, master: true }));
      
      toast({
        title: "Export Complete",
        description: `Exported ${data.record_count} records from Master 4500`,
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, master: false }));
    }
  };

  const exportExpandedThinkers = () => {
    setLoading(prev => ({ ...prev, expanded: true }));
    
    const exportData = {
      name: "Expanded Thinkers - Phase 2 Export",
      version: "1.0",
      description: `Detailed profiles of ${EXPANDED_THINKERS.length} key thinkers with deep insights, cross-era relevance, and practical applications`,
      export_date: new Date().toISOString(),
      estimated_tokens: EXPANDED_THINKERS.length * 600,
      thinker_count: EXPANDED_THINKERS.length,
      thinkers: EXPANDED_THINKERS.map(thinker => ({
        id: thinker.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: thinker.name,
        exemplar_type: "thinker",
        area: thinker.area,
        summary: thinker.coreIdea,
        biography: thinker.bio,
        lobe: thinker.lobe,
        key_ideas: [thinker.coreIdea],
        deep_insight: thinker.aiShift,
        core_framework: thinker.coreFramework,
        related_thinkers: thinker.relatedThinkers || [],
        related_frameworks: thinker.coreFramework ? [thinker.coreFramework.summary.split(':')[0].trim()] : [],
        cross_era_relevance: thinker.crossEraRelevance,
        usage_prompts: thinker.usagePrompts,
        practical_applications: thinker.practicalApplications,
        hard_coded_team: thinker.hardCodedTeam
      }))
    };

    downloadJSON(exportData, '08-expanded-thinkers.json');
    setExported(prev => ({ ...prev, expanded: true }));
    setLoading(prev => ({ ...prev, expanded: false }));
    
    toast({
      title: "Export Complete",
      description: `Exported ${EXPANDED_THINKERS.length} expanded thinker profiles`,
    });
  };

  const exportStatistics = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const { data, error } = await supabase.functions.invoke('export-gpt-data', {
        method: 'GET',
      });

      if (error) throw error;

      // Now get statistics version
      const statsData = await supabase.functions.invoke('export-gpt-data?type=statistics');
      
      if (statsData.error) throw statsData.error;
      
      downloadJSON(statsData.data, 'export-statistics.json');
      
      toast({
        title: "Statistics Exported",
        description: "Database statistics downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">GPT Import Data Export</h1>
          <p className="text-muted-foreground">
            Export data from The Thinking Engine for GPT custom assistant import (Phase 2: Content Indexing)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Master 4500 Records
              </CardTitle>
              <CardDescription>
                Export all {~2900} exemplar records with metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div>• Thinkers, frameworks, technologies</div>
                <div>• Era mappings & relationships</div>
                <div>• ~200,000 tokens estimated</div>
              </div>
              <Button
                onClick={exportMaster4500}
                disabled={loading.master}
                className="w-full"
              >
                {loading.master ? (
                  "Exporting..."
                ) : exported.master ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Re-export
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Master 4500
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Expanded Thinkers
              </CardTitle>
              <CardDescription>
                {EXPANDED_THINKERS.length} deeply profiled thought leaders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div>• Detailed biographies & insights</div>
                <div>• Cross-era relevance analysis</div>
                <div>• ~50,000 tokens estimated</div>
              </div>
              <Button
                onClick={exportExpandedThinkers}
                disabled={loading.expanded}
                className="w-full"
              >
                {exported.expanded ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Re-export
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Thinkers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Export Statistics
              </CardTitle>
              <CardDescription>
                Overview of database content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div>• Record counts by type</div>
                <div>• Distribution by book/section</div>
                <div>• Summary metrics</div>
              </div>
              <Button
                onClick={exportStatistics}
                disabled={loading.stats}
                variant="outline"
                className="w-full"
              >
                {loading.stats ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Statistics
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Export Progress - Phase 2</CardTitle>
            <CardDescription>Track your GPT import preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">07-master-4500-records.json</span>
                {exported.master ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-sm text-muted-foreground">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">08-expanded-thinkers.json</span>
                {exported.expanded ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-sm text-muted-foreground">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">09-gcbat-vignettes.json</span>
                <span className="text-sm text-muted-foreground">Manual export needed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">10-gcbat-characters.json</span>
                <span className="text-sm text-muted-foreground">Manual export needed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">11-consolidated-book-content.json</span>
                <span className="text-sm text-muted-foreground">Manual consolidation needed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Export the Master 4500 and Expanded Thinkers data above</p>
            <p>2. Manually export GCBAT vignettes and characters from Supabase SQL Editor</p>
            <p>3. Consolidate book content from public/books/content/*.json files</p>
            <p>4. Proceed to Phase 3: Relationship Mapping using the extraction guide</p>
            <p className="text-muted-foreground mt-4">
              See: public/data/gpt-import/IMPLEMENTATION-CHECKLIST.md for detailed instructions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
