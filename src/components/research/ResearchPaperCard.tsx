import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Calendar } from 'lucide-react';
import { ResearchPaper } from '@/types/research';

interface ResearchPaperCardProps {
  paper: ResearchPaper;
  showBookLinks?: boolean;
}

export function ResearchPaperCard({ paper, showBookLinks = false }: ResearchPaperCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 w-full">
            {/* Title */}
            <h4 className="font-semibold text-sm sm:text-base mb-2 leading-tight line-clamp-2">
              {paper.title}
            </h4>

            {/* Authors and Year */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground mb-2">
              <span className="truncate max-w-full">
                {paper.authors?.join(', ') || 'Unknown authors'}
              </span>
              {paper.year && (
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">•</span>
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>{paper.year}</span>
                </div>
              )}
            </div>

            {/* Abstract */}
            {paper.abstract && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {paper.abstract}
              </p>
            )}

            {/* Tags */}
            {paper.tags && paper.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {paper.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
                {paper.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{paper.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Book Links */}
            {showBookLinks && paper.book_exemplar_ids && paper.book_exemplar_ids.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1 shrink-0" />
                <span className="truncate">
                  Applied in {paper.book_exemplar_ids.length} book{paper.book_exemplar_ids.length > 1 ? 's' : ''}
                </span>
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col flex-row gap-2 shrink-0 w-full sm:w-auto">
            {paper.url && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 sm:w-8 flex-1 sm:flex-none p-0 sm:p-0"
                asChild
              >
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View paper"
                  className="flex items-center justify-center gap-1.5 sm:gap-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="sm:hidden text-xs">View Paper</span>
                </a>
              </Button>
            )}
            
            {paper.doi && !paper.url && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 sm:w-8 flex-1 sm:flex-none p-0 sm:p-0"
                asChild
              >
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View DOI"
                  className="flex items-center justify-center gap-1.5 sm:gap-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="sm:hidden text-xs">View DOI</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
