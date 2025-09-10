import { Badge } from '@/components/ui/badge';
import { Users, GitBranch } from 'lucide-react';

interface RelatedLinksProps {
  thinkers: string[];
  frameworks: string[];
}

export function RelatedLinks({ thinkers, frameworks }: RelatedLinksProps) {
  if (thinkers.length === 0 && frameworks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t border-muted">
      {thinkers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Related Thinkers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {thinkers.map((thinker) => (
              <Badge key={thinker} variant="secondary" className="text-xs">
                {thinker}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {frameworks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Related Frameworks</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((framework) => (
              <Badge key={framework} variant="outline" className="text-xs">
                {framework}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}