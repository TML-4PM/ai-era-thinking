import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp } from 'lucide-react';
import type { Thinker } from '@/data/thinkers';
import type { ExpandedThinker } from '@/data/expanded-thinkers';
import { getExpandedThinker } from '@/data/expanded-thinkers';
import { getCompositeScore, type TopicArea } from '@/lib/scoring';

interface TopThinkersPanelProps {
  thinkers: Thinker[];
  currentTopic?: TopicArea;
  currentEra?: string;
  onThinkerSelect: (name: string) => void;
}

export const TopThinkersPanel: React.FC<TopThinkersPanelProps> = ({
  thinkers,
  currentTopic,
  currentEra,
  onThinkerSelect
}) => {
  // Score and sort thinkers
  const scoredThinkers = thinkers
    .map(thinker => {
      const expanded = getExpandedThinker(thinker.name);
      const score = getCompositeScore(thinker, expanded, {
        topic: currentTopic,
        era: currentEra
      });
      
      return { thinker, expanded, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-50';
    if (score >= 3) return 'text-blue-600 bg-blue-50';
    if (score >= 2) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getRelevanceText = () => {
    if (currentTopic && currentEra) {
      return `${currentTopic} in ${currentEra}`;
    } else if (currentTopic) {
      return currentTopic;
    } else if (currentEra) {
      return currentEra;
    }
    return 'Overall Relevance';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Top Thinkers
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ranked by relevance to: <strong>{getRelevanceText()}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {scoredThinkers.map(({ thinker, expanded, score }, index) => (
          <div
            key={thinker.name}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-muted-foreground">
                  #{index + 1}
                </span>
                <h4 className="font-medium truncate">{thinker.name}</h4>
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-0.5 ${getScoreColor(score)}`}
                >
                  {score.toFixed(1)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {thinker.area} • {thinker.lobe}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {thinker.coreIdea}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-3">
              {expanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onThinkerSelect(thinker.name)}
                  className="text-xs px-2 py-1 h-auto"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Explore
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {scoredThinkers.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No thinkers match the current filters
          </p>
        )}
      </CardContent>
    </Card>
  );
};