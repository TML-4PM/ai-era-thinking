
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
  XCircle,
  Target,
  Factory
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
  teamMembers: any[];
  processingTime: number;
  profileStored?: boolean;
  error?: string;
}

const INDUSTRY_OPTIONS = [
  'Government & Public Sector',
  'Financial Services',
  'Healthcare',
  'Technology',
  'Manufacturing',
  'Education',
  'Retail',
  'Energy & Utilities',
  'Transportation',
  'Media & Entertainment'
];

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
  
  const [includeExpansion, setIncludeExpansion] = useState(true);
  const [includeAlignment, setIncludeAlignment] = useState(false);
  const [includeMemberAlignment, setIncludeMemberAlignment] = useState(false);
  const [includeTeamBuilding, setIncludeTeamBuilding] = useState(false);
  const [includeProfiles, setIncludeProfiles] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [batchUsageTracker, setBatchUsageTracker] = useState<Map<string, number>>(new Map());

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
      teamMembers: [],
      processingTime: 0
    };

    const startTime = Date.now();

    try {
      // 1. Expansion (if enabled)
      if (includeExpansion) {
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
      }

      // 2. WorkFamilyAI Alignment (if enabled)
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

      // 3. Member Alignment (top-2 agents if enabled)
      if (includeMemberAlignment) {
        for (const domain of domains.slice(0, 1)) { // Just use first domain to avoid duplicates
          try {
            const { data: memberAlignmentData, error: memberAlignmentError } = await supabase.functions.invoke('align-workfamily-members', {
              body: {
                thinkerName: thinker.name,
                thinkerArea: thinker.area,
                coreIdea: thinker.coreIdea,
                aiShift: thinker.aiShift,
                domain: domain
              }
            });

            if (memberAlignmentError) {
              console.error(`Member alignment failed for ${thinker.name} (${domain}):`, memberAlignmentError);
            }
          } catch (error) {
            console.error(`Member alignment error for ${thinker.name}:`, error);
          }
        }
      }

      // 4. Team Building (9-member teams if enabled) with batch-aware reuse cap
      if (includeTeamBuilding) {
        try {
          // Calculate excluded members based on batch reuse cap
          const totalTeamsBuilt = results.filter(r => r.teamMembers && r.teamMembers.length > 0).length;
          const excludedMembers: string[] = [];
          
          for (const [memberCode, usageCount] of batchUsageTracker.entries()) {
            if (usageCount >= Math.ceil(totalTeamsBuilt * 0.25)) {
              excludedMembers.push(memberCode);
            }
          }

          const { data: teamData, error: teamError } = await supabase.functions.invoke('build-thinker-team', {
            body: {
              thinkerName: thinker.name,
              thinkerArea: thinker.area,
              coreIdea: thinker.coreIdea,
              aiShift: thinker.aiShift,
              domain: 'strategic-planning',
              industries: selectedIndustries,
              teamSize: 9,
              excludeMemberCodes: excludedMembers
            }
          });

          if (teamError) {
            console.error(`Team building failed for ${thinker.name}:`, teamError);
          } else {
            const teamMembers = teamData?.team?.thinker_alignment_team_members || [];
            result.teamMembers = teamMembers;
            
            // Update batch usage tracker
            teamMembers.forEach((member: any) => {
              const currentCount = batchUsageTracker.get(member.member_code) || 0;
              batchUsageTracker.set(member.member_code, currentCount + 1);
            });
          }
        } catch (error) {
          console.error(`Team building error for ${thinker.name}:`, error);
        }
      }

      // 5. Deep Profile Building (if enabled)
      if (includeProfiles) {
        try {
          const { data: profileData, error: profileError } = await supabase.functions.invoke('build-thinker-profile', {
            body: {
              thinkerName: thinker.name,
              thinkerArea: thinker.area,
              coreIdea: thinker.coreIdea,
              aiShift: thinker.aiShift,
              lobe: thinker.lobe,
              industries: selectedIndustries
            }
          });

          if (profileError) {
            console.error(`Profile building failed for ${thinker.name}:`, profileError);
          } else if (profileData?.success) {
            result.profileStored = true;
            logDebug(`Profile stored for ${thinker.name}`);
          }
        } catch (error) {
          console.error(`Profile building error for ${thinker.name}:`, error);
        }
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
      teamMembers: [],
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
      ...(includeTeamBuilding && { team_members: result.teamMembers }),
      error: result.error || null
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkers-bulk-processing-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries(prev => [...prev, industry]);
    } else {
      setSelectedIndustries(prev => prev.filter(i => i !== industry));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-brand" />
          Bulk Thinker Processing & Team Assembly
        </h3>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Automatically process all {THINKERS.length} thinkers with expansion, alignment, team building, and profile storage
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Processing Controls</CardTitle>
          <CardDescription>
            Configure what to process for each thinker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Processing Options */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Processing Options</h4>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-expansion"
                  checked={includeExpansion}
                  onCheckedChange={setIncludeExpansion}
                />
                <label htmlFor="include-expansion" className="text-sm font-medium">
                  Domain Expansion (GPT-4.1)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include-alignment"
                  checked={includeAlignment}
                  onCheckedChange={setIncludeAlignment}
                />
                <label htmlFor="include-alignment" className="text-sm font-medium">
                  WorkFamily Alignment (Legacy)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include-member-alignment"
                  checked={includeMemberAlignment}
                  onCheckedChange={setIncludeMemberAlignment}
                />
                <label htmlFor="include-member-alignment" className="text-sm font-medium text-primary">
                  Top-2 Member Alignments
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include-team-building"
                  checked={includeTeamBuilding}
                  onCheckedChange={setIncludeTeamBuilding}
                />
                <label htmlFor="include-team-building" className="text-sm font-medium text-primary">
                  Build Teams (9) - Batch-Aware Reuse Cap
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include-profiles"
                  checked={includeProfiles}
                  onCheckedChange={setIncludeProfiles}
                />
                <label htmlFor="include-profiles" className="text-sm font-medium">
                  Store Deep Profiles
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">System Settings</h4>
              
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
          </div>

          {/* Industry Context for Team Building */}
          {includeTeamBuilding && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4" />
                <span className="text-sm font-medium">Industry Context (For Team Building)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRY_OPTIONS.map(industry => (
                  <div key={industry} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`industry-${industry}`}
                      checked={selectedIndustries.includes(industry)}
                      onChange={(e) => handleIndustryChange(industry, e.target.checked)}
                      className="rounded"
                    />
                    <label
                      htmlFor={`industry-${industry}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {industry}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={startBulkProcessing}
              disabled={isRunning || (!includeExpansion && !includeAlignment && !includeMemberAlignment && !includeTeamBuilding && !includeProfiles)}
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
                        {includeTeamBuilding && result.teamMembers && (
                          <span> • {result.teamMembers.length} team members</span>
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
