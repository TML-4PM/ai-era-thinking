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