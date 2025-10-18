import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ALL_ERAS, ERA_CONFIGS, getChapterIcon, type EraName } from '@/lib/era-mapping-utils';
import { useBooks } from '@/hooks/useBooks';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ThinkingEngineNavigatorProps {
  selectedEra?: EraName | null;
  onEraSelect?: (era: EraName | null) => void;
}

export function ThinkingEngineNavigator({ selectedEra, onEraSelect }: ThinkingEngineNavigatorProps) {
  const { data: books } = useBooks();
  const book = books?.find(b => b.slug === 'thinking-engine');

  if (!book) return null;

  const chapters = book.chapters || [];

  return (
    <div className="space-y-6">
      {/* Era Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Era</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedEra === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => onEraSelect?.(null)}
            >
              All Eras
            </Button>
            {ALL_ERAS.map(era => {
              const config = ERA_CONFIGS[era];
              return (
                <Button
                  key={era}
                  variant={selectedEra === era ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onEraSelect?.(era)}
                  className={selectedEra === era ? config.bgColor : ''}
                >
                  {config.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chapter Timeline */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter, index) => {
          const iconName = getChapterIcon(chapter.title);
          const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.BookOpen;
          
          return (
            <Link 
              key={chapter.chapter_order} 
              to={`/books/thinking-engine/sections/${chapter.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Chapter {chapter.chapter_order}</span>
                      </div>
                      <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{chapter.progress}%</span>
                    </div>
                    <Progress value={chapter.progress} className="h-2" />
                  </div>

                  {/* Era Coverage - Placeholder for now */}
                  <div>
                    <span className="text-xs text-muted-foreground mb-2 block">Era Coverage</span>
                    <div className="flex flex-wrap gap-1">
                      {ALL_ERAS.map(era => {
                        const config = ERA_CONFIGS[era];
                        // For now, show all eras. This will be dynamic when we fetch from master_4500
                        return (
                          <Badge 
                            key={era}
                            variant="outline"
                            className={`text-xs ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                          >
                            {config.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  {chapter.sections && chapter.sections.length > 0 && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chapter.sections[0]}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}