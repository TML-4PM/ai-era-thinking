import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentModel } from '@/types/content';
import { useMaster4500Section } from '@/hooks/useMaster4500';
import { Master4500ExemplarCard } from './Master4500ExemplarCard';

interface ContentLoaderProps {
  children?: (content: ContentModel) => React.ReactNode;
  bookSlug: string;
  contentFile?: string;
  renderContent?: (content: ContentModel) => React.ReactNode;
  className?: string;
}

export function ContentLoader({ 
  children, 
  bookSlug, 
  contentFile,
  renderContent,
  className = ""
}: ContentLoaderProps) {
  // Special handling for "The Thinking Engine" - use database instead of JSON
  const sectionSlug = contentFile?.replace('.json', '');
  const isThinkingEngine = bookSlug === 'thinking-engine';
  
  const { 
    data: dbContent, 
    isLoading: isLoadingDb, 
    error: dbError 
  } = useMaster4500Section(sectionSlug || '');
  
  const { data: jsonContent, isLoading: isLoadingJson, error: jsonError } = useQuery({
    queryKey: ['content', bookSlug, contentFile],
    queryFn: async (): Promise<ContentModel | null> => {
      if (!contentFile) return null;
      
      const response = await fetch(`/books/content/${contentFile}`);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as ContentModel;
    },
    enabled: !!contentFile && !isThinkingEngine,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = isThinkingEngine ? isLoadingDb : isLoadingJson;
  const error = isThinkingEngine ? dbError : jsonError;

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">
          Failed to load content: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  // Handle "The Thinking Engine" database content
  if (isThinkingEngine && dbContent) {
    return (
      <div className={className}>
        {dbContent.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dbContent.map((exemplar) => (
              <Master4500ExemplarCard
                key={exemplar.id}
                exemplar={exemplar}
                bookSlug={bookSlug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No exemplars found for this section</p>
          </div>
        )}
      </div>
    );
  }

  // Handle empty database content for "The Thinking Engine"
  if (isThinkingEngine && !dbContent) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">No exemplars found for this section</p>
      </div>
    );
  }

  if (!jsonContent) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">No content file specified</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {children ? children(jsonContent) : renderContent?.(jsonContent)}
    </div>
  );
}