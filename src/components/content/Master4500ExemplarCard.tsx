import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Master4500Record } from '@/hooks/useMaster4500';
import { EraMapping } from './EraMapping';
import { RelatedLinks } from './RelatedLinks';
import { ContributionForm } from './ContributionForm';
import type { EraMapping as EraMapType } from '@/types/content';

interface Master4500ExemplarCardProps {
  exemplar: Master4500Record;
  bookSlug: string;
}

export function Master4500ExemplarCard({ exemplar, bookSlug }: Master4500ExemplarCardProps) {
  const [showEraMapping, setShowEraMapping] = useState(false);
  const [showCaseStudies, setShowCaseStudies] = useState(false);
  const [showImplementation, setShowImplementation] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-300';
      case 'seeded': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'scaffold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Convert database record to EraMapping format
  const eraMapping: EraMapType = {
    onPrem: exemplar.era_on_prem || '',
    cloudNative: exemplar.era_cloud_native || '',
    genAI: exemplar.era_gen_ai || '',
    agenticAI: exemplar.era_agentic_ai || '',
    bci: exemplar.era_bci || ''
  };

  const hasEraMapping = Object.values(eraMapping).some(value => value.trim().length > 0);
  const hasCaseStudies = exemplar.case_studies && exemplar.case_studies.length > 0;
  const hasImplementationPhases = exemplar.implementation_phase1 || exemplar.implementation_phase2 || exemplar.implementation_phase3;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{exemplar.title}</CardTitle>
          <Badge variant="outline">{exemplar.exemplar_type}</Badge>
        </div>
        
        {/* Progress and Status */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{exemplar.progress}%</span>
            </div>
            <Progress value={exemplar.progress} className="h-2" />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(exemplar.status)}>
              {exemplar.status}
            </Badge>
          </div>
          
          {exemplar.description && (
            <p className="text-sm text-muted-foreground mt-2">{exemplar.description}</p>
          )}
          
          {exemplar.notes && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{exemplar.notes}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Framework */}
        {exemplar.core_framework && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Core Framework</h4>
            <p className="text-sm text-muted-foreground">{exemplar.core_framework}</p>
          </div>
        )}

        {/* Era Evolution Toggle */}
        {hasEraMapping && (
          <Collapsible open={showEraMapping} onOpenChange={setShowEraMapping}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                View Era Evolution
                {showEraMapping ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <EraMapping eraMapping={eraMapping} exemplarName={exemplar.title} />
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Implementation Phases */}
        {hasImplementationPhases && (
          <Collapsible open={showImplementation} onOpenChange={setShowImplementation}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                Implementation Timeline
                {showImplementation ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3">
              {exemplar.implementation_phase1 && (
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">Phase 1</Badge>
                  <p className="text-sm text-muted-foreground pl-2 border-l-2 border-muted">
                    {exemplar.implementation_phase1}
                  </p>
                </div>
              )}
              {exemplar.implementation_phase2 && (
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">Phase 2</Badge>
                  <p className="text-sm text-muted-foreground pl-2 border-l-2 border-muted">
                    {exemplar.implementation_phase2}
                  </p>
                </div>
              )}
              {exemplar.implementation_phase3 && (
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">Phase 3</Badge>
                  <p className="text-sm text-muted-foreground pl-2 border-l-2 border-muted">
                    {exemplar.implementation_phase3}
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Case Studies */}
        {hasCaseStudies && (
          <Collapsible open={showCaseStudies} onOpenChange={setShowCaseStudies}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                Case Studies ({exemplar.case_studies?.length || 0})
                {showCaseStudies ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <ul className="space-y-2">
                {exemplar.case_studies?.map((caseStudy, index) => (
                  <li key={index} className="text-sm text-muted-foreground pl-2 border-l-2 border-muted">
                    {caseStudy}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Related Content */}
        <RelatedLinks 
          thinkers={exemplar.related_thinkers || []}
          frameworks={exemplar.related_frameworks || []}
        />

        {/* Per-Exemplar Contribution */}
        <div className="border-t pt-4">
          <ContributionForm 
            bookSlug={bookSlug}
            exemplarKey={exemplar.title}
          />
        </div>
      </CardContent>
    </Card>
  );
}