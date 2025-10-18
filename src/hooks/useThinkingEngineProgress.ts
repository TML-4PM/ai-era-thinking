import { useQuery } from '@tanstack/react-query';
import { getChapterStats, getBookStats } from '@/services/ThinkingEngineService';

/**
 * Hook to get progress statistics for a specific chapter
 */
export function useChapterProgress(sectionSlug: string) {
  return useQuery({
    queryKey: ['thinking-engine-chapter-progress', sectionSlug],
    queryFn: () => getChapterStats(sectionSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get overall book progress statistics
 */
export function useBookProgress() {
  return useQuery({
    queryKey: ['thinking-engine-book-progress'],
    queryFn: () => getBookStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}