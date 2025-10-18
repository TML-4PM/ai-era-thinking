import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllExemplars } from '@/services/ThinkingEngineService';
import { ALL_ERAS, ERA_CONFIGS, groupExemplarsByEra } from '@/lib/era-mapping-utils';
import { ArrowRight, TrendingUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export function EraEvolutionView() {
  const { data: exemplars, isLoading } = useQuery({
    queryKey: ['thinking-engine-all-exemplars'],
    queryFn: getAllExemplars,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-5">
        {ALL_ERAS.map(era => (
          <Card key={era}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const groupedByEra = groupExemplarsByEra(exemplars || []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Era Evolution Timeline</h2>
        <p className="text-muted-foreground">
          See how {exemplars?.length || 0} exemplars transform across five technological eras
        </p>
      </div>

      {/* 5-Column Era Layout */}
      <div className="grid gap-4 md:grid-cols-5 relative">
        {/* Evolution Arrow Overlay */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 via-blue-300 via-purple-300 via-green-300 to-rose-300 dark:from-slate-700 dark:via-blue-700 dark:via-purple-700 dark:via-green-700 dark:to-rose-700 -translate-y-1/2 hidden md:block" />
        
        {ALL_ERAS.map((era, index) => {
          const config = ERA_CONFIGS[era];
          const eraExemplars = groupedByEra[era] || [];
          const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Circle;
          
          return (
            <Card key={era} className={`relative ${config.bgColor} border-2 ${config.borderColor}`}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className={`w-5 h-5 ${config.textColor}`} />
                  <CardTitle className={`text-lg ${config.textColor}`}>
                    {config.label}
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">{config.timeframe}</p>
                <Badge variant="secondary" className="w-fit">
                  {eraExemplars.length} exemplars
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  {config.description}
                </p>
                
                {/* Top Exemplars Preview */}
                <div className="space-y-2">
                  {eraExemplars.slice(0, 5).map(exemplar => (
                    <div 
                      key={exemplar.id}
                      className="text-xs p-2 bg-background/50 rounded border border-border"
                    >
                      <div className="font-medium line-clamp-1">{exemplar.title}</div>
                      <div className="text-muted-foreground line-clamp-1">{exemplar.section_slug}</div>
                    </div>
                  ))}
                  {eraExemplars.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground py-2">
                      +{eraExemplars.length - 5} more
                    </div>
                  )}
                </div>

                {/* Evolution Indicator */}
                {index < ALL_ERAS.length - 1 && (
                  <div className="flex items-center justify-center pt-4">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Evolution Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Evolution Examples</CardTitle>
          <p className="text-sm text-muted-foreground">
            See how specific concepts transform across eras
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exemplars?.slice(0, 3).map(exemplar => {
              const hasEvolution = ALL_ERAS.some(era => {
                const fieldName = `era_${era}`;
                return exemplar[fieldName as keyof typeof exemplar] && 
                       String(exemplar[fieldName as keyof typeof exemplar]).trim() !== '';
              });

              if (!hasEvolution) return null;

              return (
                <div key={exemplar.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{exemplar.title}</h4>
                      <p className="text-sm text-muted-foreground">{exemplar.section_slug}</p>
                    </div>
                    <Badge>{exemplar.status}</Badge>
                  </div>
                  
                  <div className="grid gap-2 md:grid-cols-5">
                    {ALL_ERAS.map(era => {
                      const fieldName = `era_${era}`;
                      const content = exemplar[fieldName as keyof typeof exemplar];
                      const hasContent = content && String(content).trim() !== '';
                      const config = ERA_CONFIGS[era];

                      return (
                        <div key={era} className={`p-2 rounded text-xs ${hasContent ? config.bgColor : 'bg-muted opacity-30'}`}>
                          <div className="font-medium mb-1">{config.label}</div>
                          {hasContent && (
                            <div className="line-clamp-2 text-muted-foreground">
                              {String(content).slice(0, 100)}...
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}