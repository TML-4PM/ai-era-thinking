export interface BookResearchLink {
  id: string;
  book_slug: string;
  section_slug?: string;
  research_paper_id: string;
  exemplar_id?: string;
  link_type: 'citation' | 'reference' | 'deep_dive' | 'related' | 'background';
  context_note?: string;
  relevance_score: number;
  created_at: string;
  updated_at: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors?: string[];
  year?: number;
  abstract?: string;
  doi?: string;
  url?: string;
  tags?: string[];
  book_exemplar_ids?: string[];
  book_sections?: string[];
  practical_applications?: string;
  last_book_sync?: string;
  created_at: string;
  updated_at: string;
}
