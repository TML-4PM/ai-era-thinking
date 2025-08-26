import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Loader, 
  ExternalLink, 
  ChevronDown, 
  AlertCircle, 
  CheckCircle, 
  Copy, 
  RefreshCw, 
  Zap, 
  Clock,
  Layers,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ExpandedThinker } from '@/data/expanded-thinkers';

interface FrameworkExpansionProps {
  thinker: ExpandedThinker;
}

const BUSINESS_DOMAINS = [
  'Healthcare & Medical Services',
  'Financial Services & Banking',
  'Manufacturing & Supply Chain',
  'Education & Training',
  'Retail & E-commerce',
  'Government & Public Sector',
  'Energy & Utilities',
  'Transportation & Logistics',
  'Media & Entertainment',
  'Legal & Professional Services',
  'Real Estate & Construction',
  'Agriculture & Food Systems'
] as const;

const DOMAIN_PRESETS = {
  'Decision Making': ['Healthcare & Medical Services', 'Financial Services & Banking', 'Government & Public Sector'],
  'Innovation & Strategy': ['Manufacturing & Supply Chain', 'Energy & Utilities', 'Transportation & Logistics'],
  'Ethics & Governance': ['Government & Public Sector', 'Legal & Professional Services', 'Healthcare & Medical Services'],
  'Human Systems': ['Education & Training', 'Media & Entertainment', 'Retail & E-commerce']
};

interface ExpansionResult {
  domain: string;
  relevance: string;
  keyInsights: string[];
  practicalApplications: string[];
  implementationSteps: string[];
  challenges: string[];
  metrics: string[];
}

export const FrameworkExpansion: React.FC<FrameworkExpansionProps> = ({ thinker }) => {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ExpansionResult[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [lastError, setLastError] = useState<any>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    status: string;
  } | null>(null);
  const { toast } = useToast();

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  // Health check functionality
  const handleHealthCheck = async () => {
    setIsHealthChecking(true);
    const startTime = Date.now();
    
    if (debugMode) {
      console.log('🏥 Starting OpenAI health check...');
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-health');
      
      if (debugMode) {
        console.log('Health check response:', { data, error });
      }
      
      if (error) {
        toast({
          title: "Health Check Failed",
          description: `Unable to verify OpenAI connectivity: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      if (data.ok) {
        const latency = Date.now() - startTime;
        toast({
          title: "✅ OpenAI Connected",
          description: `Model: ${data.model} • Latency: ${latency}ms • Status: Operational`
        });
      } else {
        toast({
          title: "❌ OpenAI Issue",
          description: `${data.error}: ${data.details}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      if (debugMode) {
        console.error('Health check error:', error);
      }
      toast({
        title: "Health Check Failed",
        description: "Unable to perform connectivity test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsHealthChecking(false);
    }
  };

  // Smart retry with fewer domains
  const handleRetryWithFewerDomains = async (maxDomains = 2) => {
    const reducedDomains = selectedDomains.slice(0, maxDomains);
    const originalSelection = [...selectedDomains];
    
    toast({
      title: "Retrying with Fewer Domains",
      description: `Trying with ${reducedDomains.length} domains instead of ${selectedDomains.length}`
    });
    
    // Temporarily reduce selection
    setSelectedDomains(reducedDomains);
    
    try {
      await handleGenerate();
    } finally {
      // Restore original selection
      setSelectedDomains(originalSelection);
    }
  };

  // Copy diagnostics to clipboard
  const copyDiagnostics = async () => {
    if (!lastError) return;
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      thinker: thinker.name,
      selectedDomains,
      error: lastError,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
      toast({
        title: "Diagnostics Copied",
        description: "Error details copied to clipboard for support."
      });
    } catch (error) {
      console.error('Failed to copy diagnostics:', error);
    }
  };

  const handleGenerate = async () => {
    if (selectedDomains.length === 0) {
      toast({
        title: "Select Domains",
        description: "Please select at least one business domain to expand into.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setLastError(null);
    setShowErrorDetails(false);
    setBatchProgress(null);
    
    const requestStartTime = Date.now();
    
    if (debugMode) {
      console.log('=== Framework Expansion Request ===');
      console.log('Thinker:', thinker.name);
      console.log('Selected domains:', selectedDomains);
      console.log('Request payload:', {
        thinkerName: thinker.name,
        thinkerArea: thinker.area,
        coreIdea: thinker.coreIdea,
        aiShift: thinker.aiShift,
        selectedDomains
      });
    }
    
    // Show batch progress for multiple domains
    if (selectedDomains.length > 3) {
      const batchCount = Math.ceil(selectedDomains.length / 3);
      setBatchProgress({
        current: 0,
        total: batchCount,
        status: `Processing ${selectedDomains.length} domains in ${batchCount} batch(es)...`
      });
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('expand-thinker', {
        body: {
          thinkerName: thinker.name,
          thinkerArea: thinker.area,
          coreIdea: thinker.coreIdea,
          aiShift: thinker.aiShift,
          selectedDomains
        }
      });

      if (debugMode) {
        console.log('Supabase response:', { data, error });
      }

      if (error) {
        console.error('Supabase function error:', error);
        setLastError({ type: 'supabase', error, timestamp: new Date().toISOString() });
        
        // Handle different error types
        let errorTitle = "Generation Failed";
        let errorDescription = "Failed to expand framework. Please try again.";
        let showRetryOptions = false;
        
        if (error.message) {
          if (error.message.includes('MISSING_API_KEY') || error.message.includes('INVALID_API_KEY')) {
            errorTitle = "⚙️ Configuration Error";
            errorDescription = "OpenAI API key is not properly configured. Please check Supabase secrets.";
          } else if (error.message.includes('RATE_LIMIT')) {
            errorTitle = "⏱️ Rate Limited";
            errorDescription = "Too many requests. The system will retry automatically.";
            showRetryOptions = true;
          } else if (error.message.includes('TIMEOUT')) {
            errorTitle = "⏰ Request Timeout";
            errorDescription = "Processing took too long. Try with fewer domains.";
            showRetryOptions = true;
          } else if (error.message.includes('NETWORK_ERROR')) {
            errorTitle = "🌐 Network Error";
            errorDescription = "Unable to connect to OpenAI. Check your internet connection.";
          } else if (error.message.includes('JSON_PARSE_ERROR')) {
            errorTitle = "🔧 Processing Error";
            errorDescription = "AI response format issue. This is usually temporary - please retry.";
            showRetryOptions = true;
          }
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
          action: showRetryOptions && selectedDomains.length > 2 ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleRetryWithFewerDomains()}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry (Fewer)
            </Button>
          ) : undefined
        });
        return;
      }

      // Handle function-level errors
      if (data?.error) {
        console.error('Function returned error:', data);
        setLastError({ type: 'function', data, timestamp: new Date().toISOString() });
        
        const errorCode = data.errorCode || 'UNKNOWN';
        const errorTitle = data.error || 'Processing Failed';
        const errorDescription = data.details || 'An error occurred during processing.';
        
        toast({
          title: `🚨 ${errorTitle}`,
          description: errorDescription,
          variant: "destructive",
          action: data.suggestedAction && selectedDomains.length > 1 ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleRetryWithFewerDomains(1)}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry (1 Domain)
            </Button>
          ) : undefined
        });
        return;
      }

      // Validate and display results
      if (!data?.expansions || !Array.isArray(data.expansions)) {
        console.error('Invalid response structure:', data);
        setLastError({ type: 'validation', data, timestamp: new Date().toISOString() });
        toast({
          title: "Invalid Response",
          description: "Received unexpected data format. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data.expansions.length === 0) {
        toast({
          title: "No Results",
          description: "No framework expansions were generated. Try different domains.",
          variant: "destructive"
        });
        return;
      }

      // Success!
      setResults(data.expansions);
      setBatchProgress(null);
      
      const requestTime = Date.now() - requestStartTime;
      const metadata = data.metadata || {};
      
      if (debugMode) {
        console.log('✅ Framework expansion successful:', {
          expansionCount: data.expansions.length,
          processingTime: metadata.processingTimeMs,
          batchResults: metadata.batchResults,
          successRate: metadata.successRate
        });
      }
      
      toast({
        title: "🎉 Framework Expanded",
        description: `Generated ${data.expansions.length} insights in ${Math.round((metadata.processingTimeMs || requestTime) / 1000)}s${metadata.successRate ? ` (${metadata.successRate} success)` : ''}`
      });
      
    } catch (error) {
      const requestTime = Date.now() - requestStartTime;
      console.error('✗ Expansion request failed:', error);
      
      setLastError({ 
        type: 'network', 
        error: error.message, 
        timestamp: new Date().toISOString(),
        processingTime: requestTime
      });
      
      let errorTitle = "🚨 Generation Failed";
      let errorDescription = "An unexpected error occurred.";
      
      if (error.message?.includes('Failed to fetch')) {
        errorTitle = "🌐 Network Error";
        errorDescription = "Unable to connect to the service. Check your connection.";
      } else if (error.message?.includes('timeout')) {
        errorTitle = "⏰ Request Timeout";
        errorDescription = "Request took too long. Try fewer domains.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
        action: selectedDomains.length > 1 ? (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleRetryWithFewerDomains()}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        ) : undefined
      });
    } finally {
      setIsGenerating(false);
      setBatchProgress(null);
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (results.length === 0) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify({
        thinker: thinker.name,
        generated: new Date().toISOString(),
        expansions: results
      }, null, 2);
      filename = `${thinker.name.replace(/\s+/g, '_')}_framework_expansion.json`;
      mimeType = 'application/json';
    } else {
      // CSV format
      const headers = ['Domain', 'Relevance', 'Key Insights', 'Applications', 'Implementation', 'Challenges', 'Metrics'];
      const rows = results.map(result => [
        result.domain,
        result.relevance,
        result.keyInsights.join('; '),
        result.practicalApplications.join('; '),
        result.implementationSteps.join('; '),
        result.challenges.join('; '),
        result.metrics.join('; ')
      ]);
      
      content = [headers, ...rows]
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');
      filename = `${thinker.name.replace(/\s+/g, '_')}_framework_expansion.csv`;
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
      description: `Framework expansion exported as ${format.toUpperCase()}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Domain Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Expand Framework</h3>
          </div>
          
          <div className="flex gap-2">
            {Object.entries(DOMAIN_PRESETS).map(([preset, domains]) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setSelectedDomains(domains)}
                className="text-xs"
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Select business domains to explore how <strong>{thinker.name}'s</strong> framework applies beyond {thinker.area}. Use presets above for curated selections.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {BUSINESS_DOMAINS.map(domain => (
            <div key={domain} className="flex items-center space-x-2">
              <Checkbox
                id={domain}
                checked={selectedDomains.includes(domain)}
                onCheckedChange={() => handleDomainToggle(domain)}
              />
              <label
                htmlFor={domain}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {domain}
              </label>
            </div>
          ))}
        </div>

        {/* Debug Controls & Health Check */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
              <Label htmlFor="debug-mode" className="text-sm text-muted-foreground">
                Debug mode
              </Label>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleHealthCheck}
              disabled={isHealthChecking}
              className="flex items-center gap-2 text-xs"
            >
              {isHealthChecking ? (
                <Loader className="w-3 h-3 animate-spin" />
              ) : (
                <Activity className="w-3 h-3" />
              )}
              Test OpenAI
            </Button>
          </div>
        </div>

        {/* Batch Progress */}
        {batchProgress && (
          <Alert>
            <Layers className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{batchProgress.status}</span>
                <span className="text-xs text-muted-foreground">
                  Batch {batchProgress.current + 1} of {batchProgress.total}
                </span>
              </div>
              <Progress value={((batchProgress.current) / batchProgress.total) * 100} className="h-2" />
            </AlertDescription>
          </Alert>
        )}

        {/* Error Details (Collapsible) */}
        {lastError && (
          <Collapsible open={showErrorDetails} onOpenChange={setShowErrorDetails}>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {lastError.type === 'supabase' ? 'Supabase Error' :
                     lastError.type === 'function' ? 'Processing Error' :
                     lastError.type === 'validation' ? 'Response Error' :
                     'Network Error'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={copyDiagnostics}
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Details
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="text-xs bg-destructive/10 p-2 rounded border">
                    <div className="font-mono">
                      {lastError.type === 'supabase' && (
                        <>
                          <div><strong>Message:</strong> {lastError.error?.message || 'Unknown error'}</div>
                          <div><strong>Timestamp:</strong> {lastError.timestamp}</div>
                        </>
                      )}
                      {lastError.type === 'function' && (
                        <>
                          <div><strong>Error Code:</strong> {lastError.data?.errorCode || 'Unknown'}</div>
                          <div><strong>Details:</strong> {lastError.data?.details || 'No details'}</div>
                          <div><strong>Suggested Action:</strong> {lastError.data?.suggestedAction || 'Try again'}</div>
                        </>
                      )}
                      {lastError.type === 'network' && (
                        <>
                          <div><strong>Error:</strong> {lastError.error}</div>
                          <div><strong>Processing Time:</strong> {lastError.processingTime}ms</div>
                        </>
                      )}
                      {lastError.type === 'validation' && (
                        <>
                          <div><strong>Expected:</strong> Valid expansions array</div>
                          <div><strong>Received:</strong> {typeof lastError.data}</div>
                        </>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </AlertDescription>
            </Alert>
          </Collapsible>
        )}

        <div className="flex items-center gap-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || selectedDomains.length === 0}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate Insights
          </Button>
          
          {selectedDomains.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedDomains.length > 3 && <Layers className="w-3 h-3" />}
              {selectedDomains.length} domain{selectedDomains.length !== 1 ? 's' : ''} selected
              {selectedDomains.length > 3 && (
                <span className="text-xs opacity-70">
                  ({Math.ceil(selectedDomains.length / 3)} batch{Math.ceil(selectedDomains.length / 3) !== 1 ? 'es' : ''})
                </span>
              )}
            </Badge>
          )}
          
          {/* Smart Retry Options */}
          {lastError && selectedDomains.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRetryWithFewerDomains(2)}
                className="flex items-center gap-1 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Retry (2)
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRetryWithFewerDomains(1)}
                className="flex items-center gap-1 text-xs"
              >
                <Zap className="w-3 h-3" />
                Retry (1)
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <>
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Framework Expansions</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {results.map((result, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        {result.domain}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {result.relevance}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Insights</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.keyInsights.map((insight, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Practical Applications</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.practicalApplications.map((app, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary">•</span>
                              {app}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Implementation Steps</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {result.implementationSteps.map((step, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Key Challenges</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {result.challenges.map((challenge, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-orange-500">⚠</span>
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Success Metrics</h4>
                        <div className="flex flex-wrap gap-1">
                          {result.metrics.map((metric, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};