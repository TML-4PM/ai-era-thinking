export interface Book {
  id?: string | number;
  slug: string;
  title: string;
  subtitle?: string;
  lead: string;
  cover?: string;
  chapters?: BookChapter[];
  series_name?: string;
  status?: string;
  progress?: number;
  collection?: string;
  owner?: string;
  due_date?: string;
  draft_url?: string;
  ready_flag?: boolean;
}

export interface BookChapter {
  id?: string | number;
  title: string;
  sections?: string[];
  progress: number;
  chapter_order?: number;
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    T4H_BOOKS?: Book[];
    findBookBySlug?: (slug: string) => Book | undefined;
  }
}