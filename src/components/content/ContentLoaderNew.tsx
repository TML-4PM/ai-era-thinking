import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentModel } from '@/types/content';
import { useMaster4500Section } from '@/hooks/useMaster4500';
import { Master4500ExemplarCard } from './Master4500ExemplarCard';
import { ExemplarCard } from './ExemplarCard';

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
    enabled: !!contentFile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // For thinking-engine: use DB if available, otherwise fallback to JSON
  // For other books: use JSON only
  const shouldUseDb = isThinkingEngine && dbContent && dbContent.length > 0;
  const shouldFallbackToJson = isThinkingEngine && (!dbContent || dbContent.length === 0) && contentFile;
  
  const isLoading = isThinkingEngine ? isLoadingDb : isLoadingJson;
  const error = (shouldUseDb || !shouldFallbackToJson) && isThinkingEngine ? dbError : jsonError;

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
  if (shouldUseDb) {
    return (
      <div className={className}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dbContent.map((exemplar) => (
            <Master4500ExemplarCard
              key={exemplar.id}
              exemplar={exemplar}
              bookSlug={bookSlug}
            />
          ))}
        </div>
      </div>
    );
  }

  // Handle fallback to JSON for "The Thinking Engine" when DB is empty
  if (shouldFallbackToJson && jsonContent) {
    const exemplars = jsonContent.clusters?.flatMap(cluster => cluster.exemplars) || [];
    
    return (
      <div className={className}>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            📚 Displaying content from JSON files (database content not available)
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exemplars.map((exemplar, index) => (
            <ExemplarCard 
              key={index} 
              exemplar={exemplar} 
              bookSlug={bookSlug}
              showContributionForm={false}
            />
          ))}
        </div>
      </div>
    );
  }

  // Handle empty content for "The Thinking Engine"
  if (isThinkingEngine && (!dbContent || dbContent.length === 0) && !jsonContent) {
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