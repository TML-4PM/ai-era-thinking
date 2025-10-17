import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Users, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Sparkles,
  Database,
  Zap,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { thinkerService, type EnhancedThinker } from "@/services/ThinkerService";
import { AllThinkersGrid } from "@/components/AllThinkersGrid";
import { useToast } from "@/hooks/use-toast";

export const AdminExpandPage: React.FC = () => {
  const [enhancedThinkers, setEnhancedThinkers] = useState<EnhancedThinker[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [progress, setProgress] = useState(0);
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [coverageStats, setCoverageStats] = useState({
    total: 0,
    withProfiles: 0,
    withTeams: 0,
    withBoth: 0,
    withExpansions: 0,
    coverage: 0
  });
  const [auditResults, setAuditResults] = useState<any>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const { toast } = useToast();
  
  // Use refs for synchronous loop guards
  const generationCancelRef = useRef(false);
  const expansionCancelRef = useRef(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [thinkers, stats] = await Promise.all([
        thinkerService.getAllEnhancedThinkers(),
        thinkerService.getCoverageStats()
      ]);
      setEnhancedThinkers(thinkers);
      setCoverageStats(stats);
    } catch (error) {
      console.error('Error loading enhanced thinkers:', error);
    }
  };

  const addToLog = (message: string) => {
    setGenerationLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const generateAllProfiles = async () => {
    const thinkersWithoutProfiles = enhancedThinkers.filter(t => !t.hasDeepProfile);
    if (thinkersWithoutProfiles.length === 0) {
      toast({
        title: "All Complete",
        description: "All thinkers already have deep profiles",
      });
      return;
    }

    setIsGenerating(true);
    generationCancelRef.current = false;
    setCurrentBatch(0);
    setTotalBatches(thinkersWithoutProfiles.length);
    setProgress(0);
    setGenerationLog([]);
    
    addToLog(`Starting profile generation for ${thinkersWithoutProfiles.length} thinkers`);

    const CHUNK_SIZE = 3; // Process 3 at a time for concurrency
    let completed = 0;

    for (let i = 0; i < thinkersWithoutProfiles.length; i += CHUNK_SIZE) {
      if (generationCancelRef.current) break; // Stop if cancelled
      
      const chunk = thinkersWithoutProfiles.slice(i, i + CHUNK_SIZE);
      
      // Process chunk in parallel
      const chunkPromises = chunk.map(async (thinker) => {
        addToLog(`Generating profile for ${thinker.name}...`);
        
        try {
          const result = await thinkerService.generateProfile(thinker.name);
          if (result.success) {
            addToLog(`✓ Profile generated for ${thinker.name}`);
            return { success: true, thinker: thinker.name };
          } else {
            addToLog(`✗ Failed to generate profile for ${thinker.name}: ${result.error}`);
            return { success: false, thinker: thinker.name, error: result.error };
          }
        } catch (error) {
          addToLog(`✗ Error generating profile for ${thinker.name}: ${error}`);
          return { success: false, thinker: thinker.name, error: String(error) };
        }
      });

      // Wait for chunk to complete
      const chunkResults = await Promise.all(chunkPromises);
      completed += chunkResults.length;
      
      setCurrentBatch(completed);
      setProgress((completed / thinkersWithoutProfiles.length) * 100);
      
      // Small delay between chunks to prevent overwhelming
      if (i + CHUNK_SIZE < thinkersWithoutProfiles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsGenerating(false);
    addToLog(`Profile generation completed. ${completed} out of ${thinkersWithoutProfiles.length} profiles processed.`);
    
    // Reload data
    await loadData();
    
    toast({
      title: "Batch Generation Complete",
      description: `Processed ${completed} profiles`,
    });
  };

  const generateAllTeams = async () => {
    const thinkersWithoutTeams = enhancedThinkers.filter(t => !t.hasTeam);
    if (thinkersWithoutTeams.length === 0) {
      toast({
        title: "All Complete",
        description: "All thinkers already have dream teams",
      });
      return;
    }

    setIsGenerating(true);
    generationCancelRef.current = false;
    setCurrentBatch(0);
    setTotalBatches(thinkersWithoutTeams.length);
    setProgress(0);
    setGenerationLog([]);
    
    addToLog(`Starting team generation for ${thinkersWithoutTeams.length} thinkers`);

    const CHUNK_SIZE = 3; // Process 3 at a time for concurrency
    let completed = 0;

    for (let i = 0; i < thinkersWithoutTeams.length; i += CHUNK_SIZE) {
      if (generationCancelRef.current) break; // Stop if cancelled
      
      const chunk = thinkersWithoutTeams.slice(i, i + CHUNK_SIZE);
      
      // Process chunk in parallel
      const chunkPromises = chunk.map(async (thinker) => {
        addToLog(`Assembling team for ${thinker.name}...`);
        
        try {
          const result = await thinkerService.generateTeam(thinker.name);
          if (result.success) {
            addToLog(`✓ Team assembled for ${thinker.name}`);
            return { success: true, thinker: thinker.name };
          } else {
            addToLog(`✗ Failed to assemble team for ${thinker.name}: ${result.error}`);
            return { success: false, thinker: thinker.name, error: result.error };
          }
        } catch (error) {
          addToLog(`✗ Error assembling team for ${thinker.name}: ${error}`);
          return { success: false, thinker: thinker.name, error: String(error) };
        }
      });

      // Wait for chunk to complete
      const chunkResults = await Promise.all(chunkPromises);
      completed += chunkResults.length;
      
      setCurrentBatch(completed);
      setProgress((completed / thinkersWithoutTeams.length) * 100);
      
      // Small delay between chunks to prevent overwhelming
      if (i + CHUNK_SIZE < thinkersWithoutTeams.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    setIsGenerating(false);
    addToLog(`Team generation completed. ${completed} out of ${thinkersWithoutTeams.length} teams processed.`);
    
    // Reload data
    await loadData();
    
    toast({
      title: "Batch Generation Complete",
      description: `Processed ${completed} teams`,
    });
  };

  const stopGeneration = () => {
    setIsGenerating(false);
    generationCancelRef.current = true;
    expansionCancelRef.current = true;
    addToLog("Generation stopped by user");
  };

  const generateAllExpansions = async () => {
    const thinkersWithProfiles = enhancedThinkers.filter(t => t.hasDeepProfile);
    if (thinkersWithProfiles.length === 0) {
      toast({
        title: "No Profiles Found",
        description: "Generate profiles first before creating expansions",
        variant: "destructive"
      });
      return;
    }

    setIsExpanding(true);
    expansionCancelRef.current = false;
    setGenerationLog([]);
    addToLog(`Starting framework expansions for ${thinkersWithProfiles.length} thinkers`);

    const CHUNK_SIZE = 2; // Lower concurrency for expansions
    let completed = 0;

    for (let i = 0; i < thinkersWithProfiles.length; i += CHUNK_SIZE) {
      if (expansionCancelRef.current) break;
      
      const chunk = thinkersWithProfiles.slice(i, i + CHUNK_SIZE);
      
      const chunkPromises = chunk.map(async (thinker) => {
        addToLog(`Generating expansions for ${thinker.name}...`);
        
        try {
          const result = await thinkerService.generateFrameworkExpansions(thinker.name);
          if (result.success) {
            addToLog(`✓ Expansions generated for ${thinker.name}`);
            return { success: true, thinker: thinker.name };
          } else {
            addToLog(`✗ Failed expansions for ${thinker.name}: ${result.error}`);
            return { success: false, thinker: thinker.name, error: result.error };
          }
        } catch (error) {
          addToLog(`✗ Error expanding ${thinker.name}: ${error}`);
          return { success: false, thinker: thinker.name, error: String(error) };
        }
      });

      await Promise.all(chunkPromises);
      completed += chunk.length;
      
      if (i + CHUNK_SIZE < thinkersWithProfiles.length) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setIsExpanding(false);
    addToLog(`Framework expansion completed. ${completed} thinkers processed.`);
    await loadData();
    
    toast({
      title: "Expansion Complete",
      description: `Generated framework expansions for ${completed} thinkers`,
    });
  };

  const runIntegrityCheck = async () => {
    setIsAuditing(true);
    addToLog("Running integrity check...");

    try {
      const results = await thinkerService.runIntegrityCheck();
      setAuditResults(results);
      
      addToLog(`Integrity check complete:`);
      addToLog(`  Missing profiles: ${results.missingProfiles.length}`);
      addToLog(`  Missing teams: ${results.missingTeams.length}`);
      addToLog(`  Incomplete profiles: ${results.incompleteProfiles.length}`);
      addToLog(`  Total gaps: ${results.totalGaps}`);

      toast({
        title: "Integrity Check Complete",
        description: `Found ${results.totalGaps} gaps across all thinkers`,
        variant: results.totalGaps > 0 ? "destructive" : "default"
      });
    } catch (error) {
      addToLog(`✗ Integrity check failed: ${error}`);
      toast({
        title: "Check Failed",
        description: String(error),
        variant: "destructive"
      });
    }

    setIsAuditing(false);
  };

  const fixAllGaps = async () => {
    if (!auditResults) return;

    setIsGenerating(true);
    addToLog("Starting gap remediation...");

    try {
      // Fix missing profiles
      if (auditResults.missingProfiles.length > 0) {
        addToLog(`Retrying ${auditResults.missingProfiles.length} missing profiles...`);
        const profileResults = await thinkerService.autoRetry(auditResults.missingProfiles, 'profile');
        const profileSuccesses = profileResults.results.filter(r => r.success).length;
        addToLog(`✓ Fixed ${profileSuccesses}/${auditResults.missingProfiles.length} missing profiles`);
      }

      // Fix missing teams
      if (auditResults.missingTeams.length > 0) {
        addToLog(`Retrying ${auditResults.missingTeams.length} missing teams...`);
        const teamResults = await thinkerService.autoRetry(auditResults.missingTeams, 'team');
        const teamSuccesses = teamResults.results.filter(r => r.success).length;
        addToLog(`✓ Fixed ${teamSuccesses}/${auditResults.missingTeams.length} missing teams`);
      }

      // Fix incomplete profiles
      if (auditResults.incompleteProfiles.length > 0) {
        addToLog(`Retrying ${auditResults.incompleteProfiles.length} incomplete profiles...`);
        const incompleteResults = await thinkerService.autoRetry(auditResults.incompleteProfiles, 'profile');
        const incompleteSuccesses = incompleteResults.results.filter(r => r.success).length;
        addToLog(`✓ Fixed ${incompleteSuccesses}/${auditResults.incompleteProfiles.length} incomplete profiles`);
      }

      addToLog("Gap remediation completed");
      await loadData();
      setAuditResults(null);

      toast({
        title: "Gaps Fixed",
        description: "All identified gaps have been addressed",
      });
    } catch (error) {
      addToLog(`✗ Gap remediation failed: ${error}`);
      toast({
        title: "Fix Failed",
        description: String(error),
        variant: "destructive"
      });
    }

    setIsGenerating(false);
  };

  const seedNeuralEnneadMembers = async () => {
    try {
      addToLog("Starting Neural Ennead member seeding...");
      toast({
        title: "Seeding Data",
        description: "Initializing Neural Ennead members (this may take a moment)...",
      });

      const { data, error } = await supabase.functions.invoke('seed-neural-ennead-members');
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        addToLog(`✓ Successfully seeded ${data.total_members} Neural Ennead members`);
        toast({
          title: "Data Seeded Successfully",
          description: `Initialized ${data.total_members} Neural Ennead members`,
        });
      } else {
        throw new Error(data.error || 'Failed to seed data');
      }
    } catch (error) {
      console.error('Error seeding Neural Ennead members:', error);
      addToLog(`✗ Failed to seed Neural Ennead members: ${error.message}`);
      toast({
        title: "Seeding Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const completeAllThinkers = async () => {
    setIsGenerating(true);
    setGenerationLog([]);
    addToLog("🚀 Starting Complete All Thinkers workflow...");
    
    try {
      // Step 1: Seed Neural Ennead Members
      addToLog("Phase 1: Seeding Neural Ennead members...");
      await seedNeuralEnneadMembers();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Generate All Profiles
      addToLog("Phase 2: Generating all profiles...");
      await generateAllProfiles();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Generate All Teams
      addToLog("Phase 3: Assembling all teams...");
      setIsGenerating(true); // Keep generating true for teams
      await generateAllTeams();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Generate All Expansions
      addToLog("Phase 4: Generating framework expansions...");
      setIsExpanding(true);
      await generateAllExpansions();
      setIsExpanding(false);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Run Integrity Check and Fix Gaps
      addToLog("Phase 5: Running integrity check and fixing gaps...");
      await runIntegrityCheck();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (auditResults && auditResults.totalGaps > 0) {
        addToLog("Phase 6: Fixing identified gaps...");
        await fixAllGaps();
      }
      
      addToLog("🎉 Complete All Thinkers workflow finished successfully!");
      toast({
        title: "Complete Workflow Finished",
        description: "All profiles, teams, and expansions have been generated successfully",
      });
      
    } catch (error) {
      addToLog(`✗ Complete workflow failed: ${error}`);
      toast({
        title: "Workflow Failed",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setIsExpanding(false);
      setIsAuditing(false);
      await loadData();
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin - Expand Thinkers</title>
        <meta name="description" content="Admin interface for expanding thinker profiles" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Thinker Expansion Admin
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage and generate deep profiles and teams for all thinkers
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview & Controls</TabsTrigger>
          <TabsTrigger value="batch">Batch Generation</TabsTrigger>
          <TabsTrigger value="browse">Browse All Thinkers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Coverage Stats */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Coverage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{coverageStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Thinkers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{coverageStats.withProfiles}</div>
                  <div className="text-sm text-muted-foreground">With Deep Profiles</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((coverageStats.withProfiles / coverageStats.total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{coverageStats.withTeams}</div>
                  <div className="text-sm text-muted-foreground">With Dream Teams</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((coverageStats.withTeams / coverageStats.total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{coverageStats.withBoth}</div>
                  <div className="text-sm text-muted-foreground">Fully Enhanced</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((coverageStats.withBoth / coverageStats.total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{coverageStats.coverage.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Overall Coverage</div>
                  <div className="mt-2">
                    <Progress value={coverageStats.coverage} className="h-2" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">{coverageStats.withExpansions}</div>
                  <div className="text-sm text-muted-foreground">With Expansions</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {coverageStats.total > 0 ? ((coverageStats.withExpansions / coverageStats.total) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* One-Click Complete */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Zap className="w-5 h-5" />
                Complete All Thinkers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                One-click to seed data, generate all profiles, teams, expansions, and fix any gaps.
              </p>
              <Button 
                onClick={completeAllThinkers}
                disabled={isGenerating || isExpanding || isAuditing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              >
                {isGenerating || isExpanding || isAuditing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Complete All Thinkers
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Profile Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  {coverageStats.total - coverageStats.withProfiles}
                </div>
                <div className="text-sm text-muted-foreground">
                  Thinkers need deep profiles
                </div>
                <Button 
                  onClick={generateAllProfiles}
                  disabled={isGenerating || isExpanding || (coverageStats.total - coverageStats.withProfiles) === 0}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate All Profiles
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Team Assembly
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  {coverageStats.total - coverageStats.withTeams}
                </div>
                <div className="text-sm text-muted-foreground">
                  Thinkers need dream teams
                </div>
                <Button 
                  onClick={generateAllTeams}
                  disabled={isGenerating || isExpanding || (coverageStats.total - coverageStats.withTeams) === 0}
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Assemble All Teams
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  Framework Expansions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  {coverageStats.total - coverageStats.withExpansions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Need expansions
                </div>
                <Button 
                  onClick={generateAllExpansions}
                  disabled={isExpanding || isGenerating}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate All Expansions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  System Integrity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  {auditResults ? auditResults.totalGaps : '?'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {auditResults ? 'Total gaps found' : 'Run audit check'}
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={runIntegrityCheck}
                    disabled={isAuditing || isGenerating}
                    variant="outline"
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isAuditing ? 'Checking...' : 'Integrity Check'}
                  </Button>
                  {auditResults && auditResults.totalGaps > 0 && (
                    <Button 
                      onClick={fixAllGaps}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Fix All Gaps
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          {/* Seed Neural Ennead Members Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ensure Neural Ennead members are seeded before generating teams. This is required for proper team assembly.
                </p>
                <Button 
                  onClick={seedNeuralEnneadMembers}
                  disabled={isGenerating || isExpanding}
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Seed Neural Ennead Members
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generation Progress */}
          {(isGenerating || isExpanding) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 animate-pulse text-blue-600" />
                    Generation in Progress
                  </div>
                  <Button 
                    onClick={isExpanding ? () => setIsExpanding(false) : stopGeneration} 
                    variant="destructive" 
                    size="sm"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentBatch} of {totalBatches}</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-center text-sm text-muted-foreground">
                  {isExpanding ? 'Generating framework expansions...' : `${progress.toFixed(1)}% Complete (Concurrency: ${isExpanding ? 2 : 3})`}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Generation Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                {generationLog.length === 0 ? (
                  <div className="text-muted-foreground">No generation activity yet...</div>
                ) : (
                  generationLog.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Batch Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Profile Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate deep profiles for all thinkers that don't have them yet. 
                  This process uses AI to create comprehensive frameworks, cross-era analysis, and practical applications.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {coverageStats.total - coverageStats.withProfiles} remaining
                  </Badge>
                  {coverageStats.total - coverageStats.withProfiles === 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                <Button 
                  onClick={generateAllProfiles}
                  disabled={isGenerating || (coverageStats.total - coverageStats.withProfiles) === 0}
                  className="w-full"
                >
                  {isGenerating ? (
                    <Clock className="w-4 h-4 mr-2 animate-pulse" />
                  ) : (
                    <Brain className="w-4 h-4 mr-2" />
                  )}
                  Generate Missing Profiles
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Batch Team Assembly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Assemble dream teams for all thinkers that don't have them yet. 
                  This process creates specialized teams of agents aligned with each thinker's methodology.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {coverageStats.total - coverageStats.withTeams} remaining
                  </Badge>
                  {coverageStats.total - coverageStats.withTeams === 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                <Button 
                  onClick={generateAllTeams}
                  disabled={isGenerating || (coverageStats.total - coverageStats.withTeams) === 0}
                  className="w-full"
                >
                  {isGenerating ? (
                    <Clock className="w-4 h-4 mr-2 animate-pulse" />
                  ) : (
                    <Users className="w-4 h-4 mr-2" />
                  )}
                  Assemble Missing Teams
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="browse">
          <AllThinkersGrid />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default AdminExpandPage;