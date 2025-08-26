import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Download, Share2, Loader, ExternalLink } from 'lucide-react';
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
  const { toast } = useToast();

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
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
    const requestStartTime = Date.now();
    
    console.log('=== Framework Expansion Request ===');
    console.log('Thinker:', thinker.name);
    console.log('Selected domains:', selectedDomains);
    console.log('Thinker object full:', thinker);
    console.log('Request payload:', {
      thinkerName: thinker.name,
      thinkerArea: thinker.area,
      coreIdea: thinker.coreIdea,
      aiShift: thinker.aiShift,
      selectedDomains
    });
    
    // Add debug validation
    const debugValidation = {
      hasName: !!thinker.name,
      hasArea: !!thinker.area,
      hasCoreIdea: !!thinker.coreIdea,
      hasAiShift: !!thinker.aiShift,
      hasSelectedDomains: selectedDomains.length > 0
    };
    console.log('Frontend validation check:', debugValidation);
    
    try {
      console.log('About to invoke Supabase function...');
      const { data, error } = await supabase.functions.invoke('expand-thinker', {
        body: {
          thinkerName: thinker.name,
          thinkerArea: thinker.area,
          coreIdea: thinker.coreIdea,
          aiShift: thinker.aiShift,
          selectedDomains
        }
      });

      console.log('Supabase function call completed');
      console.log('Raw Supabase response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Handle different types of errors
        let errorTitle = "Generation Failed";
        let errorDescription = "Failed to expand framework. Please try again.";
        
        if (error.message) {
          if (error.message.includes('OPENAI_API_KEY') || error.message.includes('Configuration Error')) {
            errorTitle = "Configuration Error";
            errorDescription = "OpenAI API key is not properly configured. Please contact support.";
          } else if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
            errorTitle = "Request Timeout";
            errorDescription = "The request took too long to process. Please try with fewer domains.";
          } else if (error.message.includes('rate limit') || error.message.includes('RATE_LIMIT')) {
            errorTitle = "Rate Limit Exceeded";
            errorDescription = "Too many requests. Please wait a moment and try again.";
          } else if (error.message.includes('network') || error.message.includes('NETWORK_ERROR')) {
            errorTitle = "Network Error";
            errorDescription = "Unable to connect to the service. Please check your internet connection.";
          }
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive"
        });
        return;
      }

      // Validate response data structure
      if (!data) {
        console.error('No data received from function');
        toast({
          title: "No Response",
          description: "No data received from the service. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (!data.expansions) {
        console.error('Invalid response structure - missing expansions:', data);
        
        // Handle error responses from the function
        if (data.error) {
          const errorMessage = data.details || data.error;
          console.error('Function returned error:', data);
          
          toast({
            title: data.error,
            description: errorMessage,
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Invalid Response",
          description: "Received unexpected response format. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (!Array.isArray(data.expansions)) {
        console.error('Expansions is not an array:', data.expansions);
        toast({
          title: "Invalid Data Format",
          description: "Received data in unexpected format. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data.expansions.length === 0) {
        console.warn('No expansions generated');
        toast({
          title: "No Results",
          description: "No framework expansions were generated. Please try different domains.",
          variant: "destructive"
        });
        return;
      }

      // Success!
      setResults(data.expansions);
      const requestTime = Date.now() - requestStartTime;
      
      console.log('✓ Framework expansion successful:', {
        expansionCount: data.expansions.length,
        domains: selectedDomains.length,
        processingTime: data.metadata?.processingTimeMs || requestTime,
        expansions: data.expansions
      });
      
      toast({
        title: "Framework Expanded",
        description: `Generated insights for ${selectedDomains.length} business domains in ${Math.round(requestTime / 1000)}s.`
      });
      
    } catch (error) {
      const requestTime = Date.now() - requestStartTime;
      console.error('✗ Expansion request failed:', error);
      console.error('Request details:', {
        thinker: thinker.name,
        domains: selectedDomains,
        processingTime: requestTime
      });
      
      // Determine error type and provide specific guidance
      let errorTitle = "Generation Failed";
      let errorDescription = "An unexpected error occurred. Please try again.";
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
        errorTitle = "Network Error";
        errorDescription = "Unable to connect to the service. Please check your connection and try again.";
      } else if (error.message?.includes('timeout')) {
        errorTitle = "Request Timeout";
        errorDescription = "The request took too long. Try selecting fewer domains or try again later.";
      } else if (error.message?.includes('JSON')) {
        errorTitle = "Response Error";
        errorDescription = "Received invalid response format. This may be a temporary issue - please try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
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
            <Badge variant="secondary">
              {selectedDomains.length} domains selected
            </Badge>
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