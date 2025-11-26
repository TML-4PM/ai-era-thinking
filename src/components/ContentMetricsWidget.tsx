import { useState } from 'react';
import { useContentMetrics } from '@/hooks/useContentMetrics';
import { FileText, TrendingUp, Clock, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function ContentMetricsWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, loading, error, lastUpdated, refetch } = useContentMetrics();

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return 'Never';
    const minutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (minutes === 0) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed State */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform relative"
          size="icon"
        >
          <FileText className="h-6 w-6" />
          {data && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground">
              {data.queue.ready}
            </Badge>
          )}
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
        </Button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <Card className="w-80 bg-card border-border shadow-2xl animate-slide-in-right">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-subtle">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Content Metrics</h3>
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                className="h-8 w-8"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {loading && !data && (
              <div className="text-center py-8 text-muted-foreground">
                Loading metrics...
              </div>
            )}

            {error && (
              <div className="text-center py-4 text-destructive text-sm">
                {error}
              </div>
            )}

            {data && (
              <>
                {/* Content Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Content</span>
                    <span className="text-2xl font-bold text-card-foreground pulse-glow">
                      {data.overview.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ready to Publish</span>
                    <Badge variant="secondary" className="text-lg font-semibold">
                      {data.queue.ready}
                    </Badge>
                  </div>
                </div>

                {/* Top Topics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-card-foreground">Top Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.topics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-gradient-subtle border-primary/20"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sentiment */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-card-foreground">Sentiment</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${data.sentiment.positive}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {data.sentiment.positive}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-400 transition-all duration-300"
                          style={{ width: `${data.sentiment.neutral}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {data.sentiment.neutral}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 transition-all duration-300"
                          style={{ width: `${data.sentiment.negative}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {data.sentiment.negative}%
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Updated: {getTimeSinceUpdate()}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
