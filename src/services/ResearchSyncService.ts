import { supabase } from "@/integrations/supabase/client";
import { ResearchPaper, BookResearchLink } from "@/types/research";
import { Master4500Record } from "@/hooks/useMaster4500";

// Tag mapping system for intelligent auto-discovery
export const TAG_MAPPING: Record<string, string[]> = {
  // Behavioral & Cognitive
  "behavioral-economics": ["decision-making", "cognitive-bias", "heuristics", "prospect-theory", "nudge"],
  "cognitive-psychology": ["memory", "attention", "perception", "learning", "reasoning"],
  "neuroscience": ["brain", "neural", "cognition", "neuroplasticity", "fmri"],
  
  // AI & Technology
  "ai-ethics": ["fairness", "transparency", "accountability", "bias", "ai-governance"],
  "machine-learning": ["neural-networks", "deep-learning", "algorithms", "training", "ml"],
  "bci-research": ["brain-computer-interface", "neural-signals", "neuralink", "brain-machine"],
  "quantum-logic": ["quantum-computing", "quantum-systems", "logic-systems", "qubits"],
  "agentic-ai": ["autonomous-agents", "multi-agent", "agent-systems", "ai-agents"],
  
  // Systems & Complexity
  "systems-thinking": ["complexity", "emergence", "feedback-loops", "systems-theory", "cybernetics"],
  "network-theory": ["graphs", "networks", "connectivity", "topology", "social-networks"],
  "game-theory": ["strategic-thinking", "nash-equilibrium", "cooperation", "competition"],
  
  // Organization & Leadership
  "leadership": ["organizational-behavior", "management-theory", "leadership-development"],
  "innovation": ["creativity", "change-management", "disruption", "innovation-theory"],
  "organizational-culture": ["culture", "values", "employee-engagement", "workplace"],
  
  // Philosophy & Logic
  "philosophy-of-mind": ["consciousness", "qualia", "mental-states", "phenomenology"],
  "epistemology": ["knowledge", "belief", "justification", "truth"],
  "logic": ["formal-logic", "reasoning", "arguments", "proof-theory"],
  
  // Specific Thinkers (for direct matching)
  "kahneman": ["kahneman", "thinking-fast-slow", "prospect-theory", "cognitive-bias"],
  "simon": ["herbert-simon", "bounded-rationality", "satisficing", "decision-making"],
  "minsky": ["marvin-minsky", "society-of-mind", "frames", "ai-pioneer"],
};

export class ResearchSyncService {
  /**
   * Link a research paper to relevant book sections automatically
   */
  static async linkPaperToBooks(
    paperId: string,
    tags: string[] = []
  ): Promise<{ success: boolean; linksCreated: number; error?: string }> {
    try {
      console.log('🔗 Auto-linking paper to books:', paperId, 'Tags:', tags);

      // Find relevant exemplars based on tag matching
      const relevantExemplars = await this.findRelevantExemplars(tags);
      
      if (relevantExemplars.length === 0) {
        console.log('ℹ️ No relevant exemplars found for tags:', tags);
        return { success: true, linksCreated: 0 };
      }

      let linksCreated = 0;

      // Create links for each relevant exemplar
      for (const exemplar of relevantExemplars) {
        const relevanceScore = this.calculateRelevanceScore(tags, exemplar);
        
        // Only create link if relevance is above threshold
        if (relevanceScore >= 3) {
          const { error } = await supabase
            .from('book_research_links')
            .insert({
              book_slug: exemplar.book_slug,
              section_slug: exemplar.section_slug,
              research_paper_id: paperId,
              exemplar_id: exemplar.id,
              link_type: this.determineLinkType(relevanceScore),
              relevance_score: relevanceScore,
              context_note: `Auto-discovered based on tags: ${tags.slice(0, 3).join(', ')}`
            });

          if (!error) {
            linksCreated++;
            console.log(`✅ Created link: ${exemplar.title} (score: ${relevanceScore})`);
          }
        }
      }

      // Update the research paper's book_exemplar_ids
      if (linksCreated > 0) {
        const exemplarIds = relevantExemplars
          .filter(e => this.calculateRelevanceScore(tags, e) >= 3)
          .map(e => e.id);

        await supabase
          .from('research_papers')
          .update({
            book_exemplar_ids: exemplarIds,
            last_book_sync: new Date().toISOString()
          })
          .eq('id', paperId);
      }

      console.log(`🎉 Created ${linksCreated} links for paper ${paperId}`);
      return { success: true, linksCreated };
    } catch (error) {
      console.error('❌ Error linking paper to books:', error);
      return { 
        success: false, 
        linksCreated: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Sync an exemplar to find and link relevant research papers
   */
  static async syncExemplarToResearch(
    exemplarId: string
  ): Promise<{ success: boolean; papersLinked: number; error?: string }> {
    try {
      console.log('🔄 Syncing exemplar to research:', exemplarId);

      // Get the exemplar
      const { data: exemplar, error: exemplarError } = await supabase
        .from('master_4500')
        .select('*')
        .eq('id', exemplarId)
        .single();

      if (exemplarError || !exemplar) {
        throw new Error('Exemplar not found');
      }

      // Extract tags from exemplar
      const tags = this.extractTagsFromExemplar(exemplar);
      console.log('📋 Extracted tags:', tags);

      // Find related research papers
      const relatedPapers = await this.findRelatedPapers(tags, 10);
      
      if (relatedPapers.length === 0) {
        console.log('ℹ️ No related papers found for exemplar');
        return { success: true, papersLinked: 0 };
      }

      let papersLinked = 0;
      const paperIds: string[] = [];

      // Create links for each relevant paper
      for (const paper of relatedPapers) {
        const relevanceScore = this.calculatePaperRelevance(tags, paper);
        
        if (relevanceScore >= 3) {
          const { error } = await supabase
            .from('book_research_links')
            .insert({
              book_slug: exemplar.book_slug,
              section_slug: exemplar.section_slug,
              research_paper_id: paper.id,
              exemplar_id: exemplarId,
              link_type: this.determineLinkType(relevanceScore),
              relevance_score: relevanceScore,
              context_note: `Auto-discovered for ${exemplar.title}`
            });

          if (!error) {
            papersLinked++;
            paperIds.push(paper.id);
            console.log(`✅ Linked paper: ${paper.title} (score: ${relevanceScore})`);
          }
        }
      }

      // Update exemplar's research_paper_ids
      if (papersLinked > 0) {
        await supabase
          .from('master_4500')
          .update({
            research_paper_ids: paperIds,
            updated_at: new Date().toISOString()
          })
          .eq('id', exemplarId);
      }

      console.log(`🎉 Linked ${papersLinked} papers to exemplar ${exemplarId}`);
      return { success: true, papersLinked };
    } catch (error) {
      console.error('❌ Error syncing exemplar to research:', error);
      return { 
        success: false, 
        papersLinked: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Find research papers related to given tags
   */
  static async findRelatedPapers(
    tags: string[],
    limit: number = 20
  ): Promise<ResearchPaper[]> {
    try {
      // Expand tags using TAG_MAPPING
      const expandedTags = this.expandTags(tags);
      console.log('🔍 Searching for papers with expanded tags:', expandedTags);

      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .overlaps('tags', expandedTags)
        .limit(limit);

      if (error) throw error;
      return (data || []) as ResearchPaper[];
    } catch (error) {
      console.error('Error finding related papers:', error);
      return [];
    }
  }

  /**
   * Find exemplars relevant to given tags
   */
  private static async findRelevantExemplars(
    tags: string[]
  ): Promise<Master4500Record[]> {
    try {
      // Get all exemplars and filter in memory (more flexible than DB filtering)
      const { data, error } = await supabase
        .from('master_4500')
        .select('*');

      if (error) throw error;

      // Filter exemplars based on content matching
      const relevant = (data || []).filter(exemplar => {
        const exemplarText = [
          exemplar.title,
          exemplar.description,
          exemplar.core_framework,
          ...(exemplar.related_thinkers || [])
        ].join(' ').toLowerCase();

        return tags.some(tag => exemplarText.includes(tag.toLowerCase()));
      });

      return relevant as Master4500Record[];
    } catch (error) {
      console.error('Error finding relevant exemplars:', error);
      return [];
    }
  }

  /**
   * Calculate relevance score between tags and exemplar
   */
  private static calculateRelevanceScore(
    tags: string[],
    exemplar: Master4500Record
  ): number {
    const exemplarText = [
      exemplar.title,
      exemplar.description,
      exemplar.core_framework,
      ...(exemplar.related_thinkers || [])
    ].join(' ').toLowerCase();

    let score = 0;
    const expandedTags = this.expandTags(tags);

    expandedTags.forEach(tag => {
      if (exemplarText.includes(tag.toLowerCase())) {
        score += 2; // Base match
      }
      // Title match is more valuable
      if (exemplar.title.toLowerCase().includes(tag.toLowerCase())) {
        score += 3;
      }
    });

    return Math.min(score, 10);
  }

  /**
   * Calculate relevance score between tags and research paper
   */
  private static calculatePaperRelevance(
    tags: string[],
    paper: ResearchPaper
  ): number {
    let score = 0;
    const expandedTags = this.expandTags(tags);
    const paperTags = paper.tags || [];

    expandedTags.forEach(tag => {
      if (paperTags.some(pt => pt.toLowerCase() === tag.toLowerCase())) {
        score += 3;
      }
      if (paper.title.toLowerCase().includes(tag.toLowerCase())) {
        score += 2;
      }
    });

    return Math.min(score, 10);
  }

  /**
   * Extract tags from exemplar content
   */
  private static extractTagsFromExemplar(exemplar: Master4500Record): string[] {
    const tags: string[] = [];
    const content = [
      exemplar.title,
      exemplar.description,
      exemplar.core_framework,
      exemplar.exemplar_type,
      ...(exemplar.related_thinkers || [])
    ].join(' ').toLowerCase();

    // Extract tags based on TAG_MAPPING
    Object.keys(TAG_MAPPING).forEach(key => {
      if (content.includes(key.toLowerCase())) {
        tags.push(key);
      }
    });

    // Add related thinker names as tags
    if (exemplar.related_thinkers) {
      tags.push(...exemplar.related_thinkers.map(t => t.toLowerCase().replace(/\s+/g, '-')));
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Expand tags using TAG_MAPPING
   */
  private static expandTags(tags: string[]): string[] {
    const expanded = new Set<string>(tags);

    tags.forEach(tag => {
      const mappedTags = TAG_MAPPING[tag.toLowerCase()];
      if (mappedTags) {
        mappedTags.forEach(t => expanded.add(t));
      }
    });

    return Array.from(expanded);
  }

  /**
   * Determine link type based on relevance score
   */
  private static determineLinkType(score: number): BookResearchLink['link_type'] {
    if (score >= 8) return 'deep_dive';
    if (score >= 6) return 'citation';
    if (score >= 4) return 'reference';
    return 'related';
  }

  /**
   * Update research links for a book section
   */
  static async updateResearchLinks(
    bookSlug: string,
    sectionSlug?: string
  ): Promise<{ success: boolean; linksRefreshed: number }> {
    try {
      console.log('🔄 Refreshing research links for:', bookSlug, sectionSlug);

      // Get all exemplars in this section
      let query = supabase
        .from('master_4500')
        .select('*')
        .eq('book_slug', bookSlug);

      if (sectionSlug) {
        query = query.eq('section_slug', sectionSlug);
      }

      const { data: exemplars, error } = await query;

      if (error) throw error;

      let linksRefreshed = 0;

      // Sync each exemplar
      for (const exemplar of exemplars || []) {
        const result = await this.syncExemplarToResearch(exemplar.id);
        if (result.success) {
          linksRefreshed += result.papersLinked;
        }
      }

      console.log(`🎉 Refreshed ${linksRefreshed} links for ${bookSlug}`);
      return { success: true, linksRefreshed };
    } catch (error) {
      console.error('Error updating research links:', error);
      return { success: false, linksRefreshed: 0 };
    }
  }
}
