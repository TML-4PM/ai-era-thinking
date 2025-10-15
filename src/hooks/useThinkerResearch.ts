import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThinkerResearchService } from '@/services/ThinkerResearchService';
import { useToast } from '@/hooks/use-toast';

/**
 * Get all research papers by a thinker
 */
export function useThinkerResearch(thinkerName?: string) {
  return useQuery({
    queryKey: ['thinker-research', thinkerName],
    queryFn: async () => {
      if (!thinkerName) return [];
      return await ThinkerResearchService.getThinkerResearch(thinkerName);
    },
    enabled: !!thinkerName,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get research statistics for a thinker
 */
export function useThinkerResearchStats(thinkerName?: string) {
  return useQuery({
    queryKey: ['thinker-research-stats', thinkerName],
    queryFn: async () => {
      if (!thinkerName) return null;
      return await ThinkerResearchService.getThinkerResearchStats(thinkerName);
    },
    enabled: !!thinkerName,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Auto-discover and sync research for a thinker
 */
export function useAutoSyncThinkerResearch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (thinkerName: string) => {
      return await ThinkerResearchService.autoDiscoverResearch(thinkerName);
    },
    onSuccess: (result, thinkerName) => {
      queryClient.invalidateQueries({ queryKey: ['thinker-research', thinkerName] });
      queryClient.invalidateQueries({ queryKey: ['thinker-research-stats', thinkerName] });

      if (result.success && result.papersFound > 0) {
        toast({
          title: "Research discovered",
          description: `Found and linked ${result.papersLinked} research papers`,
        });
      } else if (result.success && result.papersFound === 0) {
        toast({
          title: "No research found",
          description: "No research papers were found for this thinker",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Discovery failed",
        description: error instanceof Error ? error.message : "Failed to discover research",
        variant: "destructive",
      });
    },
  });
}

/**
 * Manually sync thinker profile to research papers
 */
export function useSyncThinkerResearch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (thinkerName: string) => {
      return await ThinkerResearchService.syncThinkerProfile(thinkerName);
    },
    onSuccess: (result, thinkerName) => {
      queryClient.invalidateQueries({ queryKey: ['thinker-research', thinkerName] });
      queryClient.invalidateQueries({ queryKey: ['thinker-research-stats', thinkerName] });

      if (result.success) {
        toast({
          title: "Sync complete",
          description: `Synced ${result.papersLinked} research papers`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "Failed to sync research",
        variant: "destructive",
      });
    },
  });
}

/**
 * Get related researchers based on co-authorship
 */
export function useRelatedResearchers(thinkerName?: string) {
  return useQuery({
    queryKey: ['related-researchers', thinkerName],
    queryFn: async () => {
      if (!thinkerName) return [];
      return await ThinkerResearchService.getRelatedResearchers(thinkerName);
    },
    enabled: !!thinkerName,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Manually link a thinker to a research paper
 */
export function useLinkThinkerResearch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { thinkerName: string; paperId: string }) => {
      await ThinkerResearchService.linkThinkerToPaper(params.thinkerName, params.paperId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['thinker-research', variables.thinkerName] });
      queryClient.invalidateQueries({ queryKey: ['thinker-research-stats', variables.thinkerName] });
      
      toast({
        title: "Paper linked",
        description: "Successfully linked research paper to thinker",
      });
    },
    onError: (error) => {
      toast({
        title: "Link failed",
        description: error instanceof Error ? error.message : "Failed to link paper",
        variant: "destructive",
      });
    },
  });
}
