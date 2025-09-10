import { useState } from 'react';
import { Exemplar } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { EraMapping } from './EraMapping';
import { RelatedLinks } from './RelatedLinks';

interface ExemplarCardProps {
  exemplar: Exemplar;
}

export function ExemplarCard({ exemplar }: ExemplarCardProps) {
  const [showEraMapping, setShowEraMapping] = useState(false);
  const [showCaseStudies, setShowCaseStudies] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{exemplar.name}</CardTitle>
          <Badge variant="outline">{exemplar.type}</Badge>
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