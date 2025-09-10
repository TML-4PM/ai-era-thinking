import { Cluster } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExemplarCard } from './ExemplarCard';

interface ClusterListProps {
  clusters: Cluster[];
  bookSlug: string;
}

export function ClusterList({ clusters, bookSlug }: ClusterListProps) {
  return (
    <div className="space-y-8">
      {clusters.map((cluster) => (
        <Card key={cluster.id}>
          <CardHeader>
            <CardTitle className="text-xl">{cluster.title}</CardTitle>
            <p className="text-muted-foreground">{cluster.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {cluster.exemplars.map((exemplar, index) => (
                <ExemplarCard key={index} exemplar={exemplar} bookSlug={bookSlug} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}