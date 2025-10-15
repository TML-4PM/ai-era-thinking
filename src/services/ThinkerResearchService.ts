import { supabase } from "@/integrations/supabase/client";
import { ResearchPaper } from "@/types/research";

export interface ThinkerResearchStats {
  paperCount: number;
  citationCount: number;
  h_index: number;
  coAuthors: string[];
  researchAreas: string[];
}

export interface SyncResult {
  success: boolean;
  papersLinked: number;
  error?: string;
}

export interface DiscoveryResult {
  success: boolean;
  papersFound: number;
  papersLinked: number;
  error?: string;
}

export class ThinkerResearchService {
  /**
   * Generate name variations for fuzzy matching
   * Handles: "Daniel Kahneman" → ["Daniel Kahneman", "Kahneman, D.", "D. Kahneman", "Kahneman"]
   */
  private static generateNameVariations(name: string): string[] {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return [name]; // Single name, no variations
    }

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const firstInitial = firstName.charAt(0);

    const variations = [
      name, // "Daniel Kahneman"
      `${lastName}, ${firstInitial}.`, // "Kahneman, D."
      `${firstInitial}. ${lastName}`, // "D. Kahneman"
      lastName, // "Kahneman"
      `${lastName}, ${firstName}`, // "Kahneman, Daniel"
    ];

    // Add middle names/initials if present
    if (parts.length > 2) {
      const middleInitials = parts.slice(1, -1).map(p => p.charAt(0)).join('. ');
      variations.push(`${lastName}, ${firstInitial}. ${middleInitials}.`);
      variations.push(`${firstInitial}. ${middleInitials}. ${lastName}`);
    }

    return [...new Set(variations)]; // Remove duplicates
  }

  /**
   * Get all research papers authored by a thinker
   */
  static async getThinkerResearch(thinkerName: string): Promise<ResearchPaper[]> {
    try {
      console.log('🔍 Fetching research for thinker:', thinkerName);
      
      const nameVariations = this.generateNameVariations(thinkerName);
      console.log('📝 Name variations:', nameVariations);

      // Query research_papers where authors array contains any name variation
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .or(
          nameVariations
            .map(variant => `authors.cs.{${variant}}`) // case-sensitive contains
            .join(',')
        );

      if (error) throw error;

      console.log(`✅ Found ${data?.length || 0} papers for ${thinkerName}`);
      return (data || []) as ResearchPaper[];
    } catch (error) {
      console.error('❌ Error fetching thinker research:', error);
      return [];
    }
  }

  /**
   * Get research statistics for a thinker
   */
  static async getThinkerResearchStats(thinkerName: string): Promise<ThinkerResearchStats> {
    try {
      const papers = await this.getThinkerResearch(thinkerName);
      
      // Extract co-authors
      const coAuthors = new Set<string>();
      papers.forEach(paper => {
        paper.authors?.forEach(author => {
          if (author.toLowerCase() !== thinkerName.toLowerCase()) {
            coAuthors.add(author);
          }
        });
      });

      // Extract research areas from tags
      const researchAreas = new Set<string>();
      papers.forEach(paper => {
        paper.tags?.forEach(tag => researchAreas.add(tag));
      });

      return {
        paperCount: papers.length,
        citationCount: 0, // TODO: Calculate from citation data
        h_index: 0, // TODO: Calculate h-index
        coAuthors: Array.from(coAuthors).slice(0, 10),
        researchAreas: Array.from(researchAreas).slice(0, 10),
      };
    } catch (error) {
      console.error('Error calculating research stats:', error);
      return {
        paperCount: 0,
        citationCount: 0,
        h_index: 0,
        coAuthors: [],
        researchAreas: [],
      };
    }
  }

  /**
   * Sync thinker profile to research papers (bidirectional)
   */
  static async syncThinkerProfile(thinkerName: string): Promise<SyncResult> {
    try {
      console.log('🔄 Syncing thinker profile:', thinkerName);

      // Get all papers by this thinker
      const papers = await this.getThinkerResearch(thinkerName);
      
      if (papers.length === 0) {
        console.log('ℹ️ No papers found for', thinkerName);
        return { success: true, papersLinked: 0 };
      }

      const paperIds = papers.map(p => p.id);

      // Update thinker_profiles table
      const { error: profileError } = await supabase
        .from('thinker_profiles')
        .update({
          research_paper_ids: paperIds,
          publication_count: papers.length,
          last_research_sync: new Date().toISOString(),
        })
        .eq('thinker_name', thinkerName);

      if (profileError) {
        console.error('❌ Error updating thinker profile:', profileError);
        throw profileError;
      }

      // Update each paper's book_exemplar_ids (find related exemplars)
      for (const paper of papers) {
        // Find exemplars that mention this thinker
        const { data: exemplars } = await supabase
          .from('master_4500')
          .select('id')
          .or(`title.ilike.%${thinkerName}%,description.ilike.%${thinkerName}%,related_thinkers.cs.{${thinkerName}}`);

        if (exemplars && exemplars.length > 0) {
          const exemplarIds = exemplars.map(e => e.id);
          
          await supabase
            .from('research_papers')
            .update({
              book_exemplar_ids: exemplarIds,
              last_book_sync: new Date().toISOString(),
            })
            .eq('id', paper.id);
        }
      }

      console.log(`✅ Synced ${papers.length} papers for ${thinkerName}`);
      return { success: true, papersLinked: papers.length };
    } catch (error) {
      console.error('❌ Error syncing thinker profile:', error);
      return {
        success: false,
        papersLinked: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Auto-discover research papers when a new thinker is added
   */
  static async autoDiscoverResearch(thinkerName: string): Promise<DiscoveryResult> {
    try {
      console.log('🔍 Auto-discovering research for:', thinkerName);

      // First, search for papers
      const papers = await this.getThinkerResearch(thinkerName);
      
      if (papers.length === 0) {
        console.log('ℹ️ No papers found during auto-discovery');
        return { success: true, papersFound: 0, papersLinked: 0 };
      }

      console.log(`📚 Found ${papers.length} papers, syncing...`);

      // Then sync them to the thinker profile
      const syncResult = await this.syncThinkerProfile(thinkerName);

      return {
        success: syncResult.success,
        papersFound: papers.length,
        papersLinked: syncResult.papersLinked,
        error: syncResult.error,
      };
    } catch (error) {
      console.error('❌ Error in auto-discovery:', error);
      return {
        success: false,
        papersFound: 0,
        papersLinked: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Enrich thinker profile with research metadata
   */
  static async enrichThinkerWithResearch(thinkerName: string): Promise<void> {
    try {
      const stats = await this.getThinkerResearchStats(thinkerName);
      
      // Update thinker profile metadata with research info
      const { error } = await supabase
        .from('thinker_profiles')
        .update({
          metadata: {
            research_stats: JSON.parse(JSON.stringify(stats)) as any,
            enriched_at: new Date().toISOString(),
          } as any,
        })
        .eq('thinker_name', thinkerName);

      if (error) throw error;
      console.log(`✅ Enriched ${thinkerName} with research metadata`);
    } catch (error) {
      console.error('Error enriching thinker with research:', error);
    }
  }

  /**
   * Link a thinker to a research paper manually
   */
  static async linkThinkerToPaper(
    thinkerName: string,
    paperId: string
  ): Promise<void> {
    try {
      // Get current research_paper_ids
      const { data: profile } = await supabase
        .from('thinker_profiles')
        .select('research_paper_ids')
        .eq('thinker_name', thinkerName)
        .single();

      const currentIds = profile?.research_paper_ids || [];
      
      if (!currentIds.includes(paperId)) {
        // Add the paper ID
        await supabase
          .from('thinker_profiles')
          .update({
            research_paper_ids: [...currentIds, paperId],
            publication_count: currentIds.length + 1,
            last_research_sync: new Date().toISOString(),
          })
          .eq('thinker_name', thinkerName);

        console.log(`✅ Linked ${paperId} to ${thinkerName}`);
      }
    } catch (error) {
      console.error('Error linking thinker to paper:', error);
      throw error;
    }
  }

  /**
   * Get related thinkers based on co-authorship
   */
  static async getRelatedResearchers(thinkerName: string): Promise<string[]> {
    try {
      const papers = await this.getThinkerResearch(thinkerName);
      const coAuthors = new Set<string>();

      papers.forEach(paper => {
        paper.authors?.forEach(author => {
          const authorLower = author.toLowerCase();
          const thinkerLower = thinkerName.toLowerCase();
          
          if (authorLower !== thinkerLower && !authorLower.includes(thinkerLower)) {
            coAuthors.add(author);
          }
        });
      });

      return Array.from(coAuthors);
    } catch (error) {
      console.error('Error getting related researchers:', error);
      return [];
    }
  }
}

export const thinkerResearchService = new ThinkerResearchService();
