import { BookTabConfig } from "@/lib/book-tab-configs";

export interface ChapterTemplate {
  title: string;
  sections: string[];
  order: number;
  progress?: number;
}

export interface BookTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  template_config: {
    structure: string;
    features: string[];
  };
  tab_config: BookTabConfig[];
  default_chapters: ChapterTemplate[];
  collection: string;
  suggested_series?: string;
  features: string[];
  best_for: string[];
  example_books: string[];
  is_active: boolean;
  is_featured: boolean;
  usage_count: number;
}

export interface BookWizardState {
  currentStep: number;
  templateId: string | null;
  template: BookTemplate | null;
  bookData: {
    title: string;
    subtitle: string;
    description: string;
    series_name?: string;
    collection: string;
    owner?: string;
    cover_url?: string;
    status: 'draft' | 'in_progress' | 'review' | 'published';
    ready_flag: boolean;
    due_date?: string;
    draft_url?: string;
    is_public: boolean;
  };
  chapters: ChapterTemplate[];
  isValid: boolean;
}

export const WIZARD_STEPS = [
  { id: 1, title: 'Template', description: 'Choose a template' },
  { id: 2, title: 'Basic Info', description: 'Book details' },
  { id: 3, title: 'Chapters', description: 'Structure your book' },
  { id: 4, title: 'Publishing', description: 'Set visibility' },
  { id: 5, title: 'Review', description: 'Confirm & create' },
] as const;
