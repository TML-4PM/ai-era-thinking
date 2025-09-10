import { useState } from 'react';
import { Exemplar } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { EraMapping } from './EraMapping';
import { RelatedLinks } from './RelatedLinks';

interface ExemplarCardProps {
  exemplar: Exemplar;
}

export function ExemplarCard({ exemplar }: ExemplarCardProps) {
  const [showEraMapping, setShowEraMapping] = useState(false);
  const [showCaseStudies, setShowCaseStudies] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-300';
      case 'seeded': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'scaffold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{exemplar.name}</CardTitle>
          <Badge variant="outline">{exemplar.type}</Badge>
        </div>
        
        {/* Progress and Status */}
        <div className="space-y-2">
          {exemplar.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{exemplar.progress}%</span>
              </div>
              <Progress value={exemplar.progress} className="h-2" />
            </div>
          )}
          
          {exemplar.status && (
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(exemplar.status)}>
                {exemplar.status}
              </Badge>
            </div>
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
        {/* Era Evolution Toggle */}
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
            <EraMapping eraMapping={exemplar.eraMapping} exemplarName={exemplar.name} />
          </CollapsibleContent>
        </Collapsible>

        {/* Case Studies */}
        {exemplar.caseStudies.length > 0 && (
          <Collapsible open={showCaseStudies} onOpenChange={setShowCaseStudies}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                Case Studies ({exemplar.caseStudies.length})
                {showCaseStudies ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <ul className="space-y-2">
                {exemplar.caseStudies.map((caseStudy, index) => (
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
          thinkers={exemplar.relatedThinkers}
          frameworks={exemplar.relatedFrameworks}
        />
      </CardContent>
    </Card>
  );
}