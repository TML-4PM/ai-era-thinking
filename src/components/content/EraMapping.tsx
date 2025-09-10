import { EraMapping as EraMapType } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EraMappingProps {
  eraMapping: EraMapType;
  exemplarName: string;
}

const ERA_CONFIG = {
  onPrem: { label: 'On-Premise Era', color: 'bg-slate-100 text-slate-800' },
  cloudNative: { label: 'Cloud-Native Era', color: 'bg-blue-100 text-blue-800' },
  genAI: { label: 'Generative AI Era', color: 'bg-purple-100 text-purple-800' },
  agenticAI: { label: 'Agentic AI Era', color: 'bg-green-100 text-green-800' },
  bci: { label: 'Brain-Computer Interface Era', color: 'bg-rose-100 text-rose-800' }
} as const;

export function EraMapping({ eraMapping, exemplarName }: EraMappingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Era Evolution: {exemplarName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(Object.keys(eraMapping) as Array<keyof EraMapType>).map((era) => (
          <div key={era} className="space-y-2">
            <Badge className={ERA_CONFIG[era].color}>
              {ERA_CONFIG[era].label}
            </Badge>
            <p className="text-sm text-muted-foreground pl-2 border-l-2 border-muted">
              {eraMapping[era]}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}