import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";

// Default fallback books
const DEFAULT_BOOKS: Book[] = [
  {
    id: 1,
    title: "WorkFamilyAI",
    subtitle: "Tech for Humanity",
    slug: "workfamilyai",
    lead: "Practical AI systems for work, home, and community.",
    cover: "/assets/covers/workfamilyai.jpg",
    series_name: "Tech for Humanity",
    status: "in_progress",
    chapters: [
      { title: "Foundations", sections: ["Principles", "Safety", "Agent Roles"], progress: 65, chapter_order: 1 },
      { title: "Household Agents", sections: ["Scheduling", "Care", "Finance"], progress: 40, chapter_order: 2 },
      { title: "Org Agents", sections: ["PMO", "Ops", "Compliance"], progress: 55, chapter_order: 3 }
    ]
  },
  {
    id: 2,
    title: "Sovereign Systems",
    subtitle: "Tech for Humanity",
    slug: "sovereign-systems",
    lead: "Open, interoperable, citizen-first digital infrastructure.",
    cover: "/assets/covers/sovereign-systems.jpg",
    series_name: "Tech for Humanity",
    status: "in_progress",
    chapters: [
      { title: "Civic Stack", sections: ["Identity", "Data Commons", "GovOps"], progress: 35, chapter_order: 1 },
      { title: "Markets", sections: ["Payments", "Auditability", "Standards"], progress: 20, chapter_order: 2 },
      { title: "Resilience", sections: ["Continuity", "Security", "Localism"], progress: 25, chapter_order: 3 }
    ]
  },
  {
    id: 3,
    title: "The Time Tree",
    subtitle: "Tech for Humanity",
    slug: "the-time-tree",
    lead: "Time-aware planning across families, teams, and cities.",
    cover: "/assets/covers/time-tree.jpg",
    series_name: "Tech for Humanity",
    status: "in_progress",
    chapters: [
      { title: "Time Graph", sections: ["Nodes", "Edges", "Calendars"], progress: 50, chapter_order: 1 },
      { title: "Predictions", sections: ["Signals", "Trajectories", "Risk"], progress: 30, chapter_order: 2 },
      { title: "Execution", sections: ["Rituals", "Cadence", "Feedback"], progress: 15, chapter_order: 3 }
    ]
  },
  // Stubs for books 4-15
  ...Array.from({ length: 12 }, (_, i) => ({
    id: i + 4,
    title: `Book ${i + 4}`,
    subtitle: "Tech for Humanity",
    slug: `book-${i + 4}`,
    lead: `Stub for book ${i + 4}`,
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    status: "draft",
    chapters: []
  }))
];

function safeCover(src?: string): string {
  return src && src.trim().length ? src : "/placeholder.svg";
}

export function useBooks() {
  return useQuery({
    queryKey: ["books-merged"],
    queryFn: async () => {
      // Get books from window.T4H_BOOKS if available
      const staticBooks = typeof window !== "undefined" && Array.isArray(window.T4H_BOOKS) 
        ? window.T4H_BOOKS 
        : DEFAULT_BOOKS;

      // Try to get Supabase books
      try {
        const { data: supabaseBooks } = await supabase
          .from("books")
          .select(`
            *,
            book_chapters(*)
          `)
          .order('created_at', { ascending: false });

        // Merge: Supabase books take priority, static books fill gaps
        const mergedBooks: Book[] = [];
        const usedSlugs = new Set<string>();

        // Add Supabase books first
        if (supabaseBooks) {
          supabaseBooks.forEach(book => {
            mergedBooks.push({
              id: book.id,
              slug: book.slug,
              title: book.title,
              subtitle: book.subtitle,
              lead: book.lead_description || "",
              cover: safeCover(book.cover_url),
              series_name: book.series_name,
              status: book.status,
              chapters: book.book_chapters?.map(ch => ({
                id: ch.id,
                title: ch.title,
                sections: Array.isArray(ch.sections) ? ch.sections as string[] : [],
                progress: ch.progress_percentage || 0,
                chapter_order: ch.chapter_order
              })) || []
            });
            usedSlugs.add(book.slug);
          });
        }

        // Add static books that aren't already represented
        staticBooks.forEach(staticBook => {
          if (!usedSlugs.has(staticBook.slug)) {
            mergedBooks.push({
              ...staticBook,
              cover: safeCover(staticBook.cover)
            });
          }
        });

        return mergedBooks;
      } catch (error) {
        console.warn("Failed to load Supabase books, using static data:", error);
        return staticBooks.map(book => ({
          ...book,
          cover: safeCover(book.cover)
        }));
      }
    }
  });
}

export function useBook(slug: string) {
  const { data: books } = useBooks();
  return books?.find(book => book.slug === slug);
}