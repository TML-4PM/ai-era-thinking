import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookResearchLink } from '@/types/research';
import { ResearchSyncService } from '@/services/ResearchSyncService';
import { useToast } from '@/hooks/use-toast';

/**
 * Get research links for a specific exemplar
 */
export function useExemplarResearch(exemplarId?: string) {
  return useQuery({
    queryKey: ['exemplar-research', exemplarId],
    queryFn: async () => {
      if (!exemplarId) return [];

      const { data, error } = await supabase
        .from('book_research_links')
        .select(`
          *,
          research_papers (
            id,
            title,
            authors,
            year,
            abstract,
            doi,
            url,
            tags
          )
        `)
        .eq('exemplar_id', exemplarId)
        .order('relevance_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!exemplarId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get research links for a book section
 */
export function useSectionResearch(bookSlug: string, sectionSlug?: string) {
  return useQuery({
    queryKey: ['section-research', bookSlug, sectionSlug],
    queryFn: async () => {
      let query = supabase
        .from('book_research_links')
        .select(`
          *,
          research_papers (
            id,
            title,
            authors,
            year,
            abstract,
            doi,
            url,
            tags
          )
        `)
        .eq('book_slug', bookSlug);

      if (sectionSlug) {
        query = query.eq('section_slug', sectionSlug);
      }

      const { data, error } = await query
        .order('relevance_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Manually link a research paper to an exemplar
 */
export function useLinkResearchPaper() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      exemplarId: string;
      researchPaperId: string;
      bookSlug: string;
      sectionSlug: string;
      linkType: BookResearchLink['link_type'];
      relevanceScore: number;
      contextNote?: string;
    }) => {
      const { data, error } = await supabase
        .from('book_research_links')
        .insert({
          book_slug: params.bookSlug,
          section_slug: params.sectionSlug,
          research_paper_id: params.researchPaperId,
          exemplar_id: params.exemplarId,
          link_type: params.linkType,
          relevance_score: params.relevanceScore,
          context_note: params.contextNote,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exemplar-research', variables.exemplarId] });
      queryClient.invalidateQueries({ queryKey: ['section-research', variables.bookSlug] });
      toast({
        title: "Research linked",
        description: "Successfully linked research paper to exemplar",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to link research",
        variant: "destructive",
      });
    },
  });
}

/**
 * Auto-sync exemplar to discover research papers
 */
export function useAutoSyncExemplar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exemplarId: string) => {
      return await ResearchSyncService.syncExemplarToResearch(exemplarId);
    },
    onSuccess: (result, exemplarId) => {
      queryClient.invalidateQueries({ queryKey: ['exemplar-research', exemplarId] });
      
      if (result.success && result.papersLinked > 0) {
        toast({
          title: "Research discovered",
          description: `Found and linked ${result.papersLinked} relevant research papers`,
        });
      } else if (result.success && result.papersLinked === 0) {
        toast({
          title: "No research found",
          description: "No relevant research papers were found for auto-linking",
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
 * Delete a research link
 */
export function useDeleteResearchLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('book_research_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exemplar-research'] });
      queryClient.invalidateQueries({ queryKey: ['section-research'] });
      toast({
        title: "Link removed",
        description: "Research link has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove link",
        variant: "destructive",
      });
    },
  });
}
