import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";
import { useMaster4500BookProgress } from "./useMaster4500";

// New 33-book catalog structure with 5 main series (A-E)
const DEFAULT_BOOKS: Book[] = [
  // A: Tech for Humanity - Suite Hub
  {
    id: "A",
    title: "Tech for Humanity",
    subtitle: "Complete Collection",
    slug: "tech-for-humanity",
    lead_description: "A comprehensive 15-part exploration of technology's role in human flourishing.",
    cover: "https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Man.png",
    series_name: "Tech for Humanity",
    collection: "Suite Hub",
    status: "suite_hub",
    owner: "Editorial Team",
    ready_flag: true,
    chapters: []
  },

  // B: Entangled Time - Single book with chapters
  {
    id: "B",
    title: "Entangled Time",
    subtitle: "Temporal Intelligence for Complex Systems", 
    slug: "entangled-time",
    lead_description: "A comprehensive guide to time-aware planning across families, teams, and cities.",
    cover: "/assets/covers/time-tree.jpg",
    series_name: "Entangled Time",
    collection: "On the Drawing Board",
    status: "draft",
    owner: "TBA",
    due_date: "2026-01-15", 
    ready_flag: false,
    chapters: [
      { title: "The Time Tree", sections: ["Nodes", "Edges", "Calendars"], progress: 50, chapter_order: 1 },
      { title: "Narrative Vignettes", sections: ["Stories", "Scenarios", "Cases"], progress: 30, chapter_order: 2 },
      { title: "Stakeholder Mapping", sections: ["Actors", "Interests", "Relationships"], progress: 15, chapter_order: 3 },
      { title: "Futures Cone (1–10 years)", sections: ["Trends", "Uncertainties", "Wildcards"], progress: 0, chapter_order: 4 },
      { title: "Signal Spikes and Logs", sections: ["Detection", "Analysis", "Response"], progress: 0, chapter_order: 5 },
      { title: "Consent Through Time", sections: ["Ethics", "Consent", "Governance"], progress: 0, chapter_order: 6 },
      { title: "Dystopian and Alternative Futures", sections: ["Risks", "Alternatives", "Mitigation"], progress: 0, chapter_order: 7 }
    ]
  },

  // B2: Living Stack - Cognitive Reef Architecture
  {
    id: "B2",
    title: "Living Stack",
    subtitle: "A Cognitive Reef Architecture for Signal-Driven Systems",
    slug: "living-stack",
    lead_description: "A 10,000-word thesis documenting the Living Stack ecosystem—where tasks are treated as signals, roles mutate in real-time, and recovery mechanisms ensure continuity across human-machine collaboration.",
    cover: "https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Circle%201.png",
    series_name: "Living Stack",
    collection: "In Development",
    status: "writing",
    owner: "TBA",
    due_date: "2026-03-01",
    ready_flag: false,
    chapters: [
      { 
        title: "Introduction: The Coordination Problem", 
        sections: ["Task vs Intent", "Nature as Blueprint", "Cognitive Orchestration"], 
        progress: 15, 
        chapter_order: 1 
      },
      { 
        title: "Literature & System Review", 
        sections: ["Biological Analogies", "Cognitive Theory", "Current Systems"], 
        progress: 10, 
        chapter_order: 2 
      },
      { 
        title: "Conceptual Foundation", 
        sections: ["Cognitive Reef Model", "Key Principles", "Natural Mappings"], 
        progress: 20, 
        chapter_order: 3 
      },
      { 
        title: "Existing Components", 
        sections: ["RATPAK", "NEUROPAK", "HoloOrg", "MyNeuralSignal", "ConsentX"], 
        progress: 25, 
        chapter_order: 4 
      },
      { 
        title: "Novel Contributions", 
        sections: ["Task-as-Signal", "Recovery Tokens", "Role Mutation", "Drift Detection"], 
        progress: 5, 
        chapter_order: 5 
      },
      { 
        title: "Integration Architecture", 
        sections: ["Layer Mapping", "Internal Flows", "External Connections"], 
        progress: 0, 
        chapter_order: 6 
      },
      { 
        title: "Monetisable Applications", 
        sections: ["Consulting", "AI Services", "Coaching", "Enterprise", "SaaS", "ROI Metrics"], 
        progress: 0, 
        chapter_order: 7 
      },
      { 
        title: "Partner Ecosystem", 
        sections: ["BCI Hardware", "AI Providers", "UI/UX Partners", "Data Platforms"], 
        progress: 0, 
        chapter_order: 8 
      },
      { 
        title: "Implementation Roadmap", 
        sections: ["Current Build", "MVP Ecosystem", "Phased Rollout", "R&D Goals"], 
        progress: 0, 
        chapter_order: 9 
      },
      { 
        title: "Conclusion", 
        sections: ["Novelty Restatement", "Implications", "Deployment Path"], 
        progress: 0, 
        chapter_order: 10 
      }
    ]
  },

  // C: The Thinking Engine - Single book with 15 chapters
  {
    id: "C",
    title: "The Thinking Engine",
    subtitle: "Cognitive Systems, Decision-Making, and Intelligent Design",
    slug: "thinking-engine",
    lead_description: "A 15-chapter exploration of how humans and machines think, decide, and evolve together.",
    cover: "/assets/covers/thinking-engine-hub.jpg",
    series_name: "The Thinking Engine", 
    collection: "Single Book",
    status: "in_progress",
    owner: "Editorial Team",
    ready_flag: true,
    chapters: [
      { title: "Principles", sections: ["Guiding principles for AI development"], progress: 10, chapter_order: 1 },
      { title: "Institutions", sections: ["Organizations driving AI development"], progress: 5, chapter_order: 2 },
      { title: "Doctrines", sections: ["Philosophical doctrines shaping AI"], progress: 5, chapter_order: 3 },
      { title: "Frameworks", sections: ["100 frameworks for understanding AI"], progress: 20, chapter_order: 4 },
      { title: "Thinkers", sections: ["70 brains that shaped brains"], progress: 85, chapter_order: 5 },
      { title: "Disciplines", sections: ["Academic disciplines in AI research"], progress: 15, chapter_order: 6 },
      { title: "Technologies", sections: ["Core technologies enabling AI"], progress: 25, chapter_order: 7 },
      { title: "Organizations", sections: ["Key organizations in AI ecosystem"], progress: 0, chapter_order: 8 },
      { title: "Cultures", sections: ["Cultural perspectives on AI"], progress: 0, chapter_order: 9 },
      { title: "Roles", sections: ["Human roles in AI-augmented systems"], progress: 30, chapter_order: 10 },
      { title: "Products", sections: ["AI products transforming society"], progress: 0, chapter_order: 11 },
      { title: "Eras", sections: ["Historical eras in AI development"], progress: 40, chapter_order: 12 },
      { title: "Environment", sections: ["Non-human stakeholder perspectives"], progress: 0, chapter_order: 13 },
      { title: "Energy and Forces", sections: ["Underlying drivers in AI"], progress: 0, chapter_order: 14 },
      { title: "Unstructured", sections: ["Wildcards and user-defined items"], progress: 0, chapter_order: 15 }
    ]
  },

  // D: Quantum Logic Systems - Single book with chapters
  {
    id: "D",
    title: "Quantum Logic Systems",
    subtitle: "Quantum Foundations for Biological and Cognitive Systems",
    slug: "quantum-logic-systems",
    lead_description: "Exploring quantum principles in biological systems and their implications for AI and consciousness.",
    cover: "https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20Man.png",
    series_name: "Quantum Logic Systems",
    collection: "In Development",
    status: "writing",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Quantum Foundations", sections: ["Principles", "Mathematics", "Biology"], progress: 0, chapter_order: 1 },
      { title: "Life Sciences Integration", sections: ["Cellular", "Neural", "Systemic"], progress: 0, chapter_order: 2 },
      { title: "Neural & Cognitive Models", sections: ["Consciousness", "Cognition", "Memory"], progress: 0, chapter_order: 3 },
      { title: "Quantum Agents & Signals", sections: ["Agency", "Communication", "Entanglement"], progress: 0, chapter_order: 4 },
      { title: "Biology + Quantum Interactions", sections: ["Photosynthesis", "Navigation", "Coherence"], progress: 0, chapter_order: 5 },
      { title: "Implications for BCI & AI", sections: ["Interfaces", "Intelligence", "Enhancement"], progress: 0, chapter_order: 6 },
      { title: "Futures and Experiments", sections: ["Research", "Applications", "Ethics"], progress: 0, chapter_order: 7 }
    ]
  },

  // E: The Regenerative Organization - Single book with chapters
  {
    id: "E",
    title: "The Regenerative Organization",
    subtitle: "STRIP-MAP-UPDATE Framework for Adaptive Systems",
    slug: "regenerative-organization", 
    lead_description: "A practical framework for building adaptive, regenerative organizational systems.",
    cover: "https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/main%20AHC%20image.jpg",
    series_name: "The Regenerative Organization",
    collection: "On the Drawing Board",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "STRIP – Identify Legacy Patterns", sections: ["Assessment", "Mapping", "Analysis"], progress: 0, chapter_order: 1 },
      { title: "MAP – Systems and Flows", sections: ["Visualization", "Dependencies", "Constraints"], progress: 0, chapter_order: 2 },
      { title: "UPDATE – Adaptive Cycles", sections: ["Iteration", "Feedback", "Evolution"], progress: 0, chapter_order: 3 },
      { title: "Regeneration in Practice", sections: ["Implementation", "Tools", "Metrics"], progress: 0, chapter_order: 4 },
      { title: "Culture and Change Readiness", sections: ["Mindset", "Skills", "Leadership"], progress: 0, chapter_order: 5 },
      { title: "Ecosystem-Level Regeneration", sections: ["Networks", "Partnerships", "Impact"], progress: 0, chapter_order: 6 },
      { title: "Future-Oriented Metrics", sections: ["Indicators", "Dashboards", "Reporting"], progress: 0, chapter_order: 7 }
    ]
  },

  // F: GCBAT Vignettes - Neural Ennead BCI Governance Stories
  {
    id: "F",
    title: "GCBAT Vignettes",
    subtitle: "Neural Ennead: BCI Governance Stories",
    slug: "gcbat-vignettes",
    lead_description: "32 narrative vignettes exploring Brain-Computer Interface governance through 9 characters across 5 story arcs.",
    cover: "/assets/covers/gcbat-vignettes.jpg",
    series_name: "GCBAT Vignettes",
    collection: "Single Volume",
    status: "in_progress",
    owner: "GCBAT Team",
    ready_flag: true,
    chapters: [
      { title: "The Neural Ennead", sections: ["Characters", "Roles", "Relationships"], progress: 100, chapter_order: 0 },
      { title: "Arc 1: Infrastructure Collapse", sections: ["7 Stories", "Chapters 11-17"], progress: 30, chapter_order: 1 },
      { title: "Arc 2: Cognitive & Social Disruption", sections: ["6 Stories", "Chapters 18-24"], progress: 15, chapter_order: 2 },
      { title: "Arc 3: Rights & Agency Erosion", sections: ["6 Stories", "Chapters 25-31"], progress: 10, chapter_order: 3 },
      { title: "Arc 4: Environmental & Physical Systems", sections: ["6 Stories", "Chapters 32-38"], progress: 5, chapter_order: 4 },
      { title: "Arc 5: Governance Crisis & Resolution", sections: ["7 Stories", "Chapters 39-46"], progress: 0, chapter_order: 5 }
    ]
  },

  // F2: The Far Cage
  {
    id: "F2",
    title: "The Far Cage",
    subtitle: "Digital Sovereignty and the Architecture of Control",
    slug: "the-far-cage",
    lead_description: "Exploring digital sovereignty, identity, autonomy, and control in the age of pervasive computation",
    cover: "https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/Colour%20Mobile%20far%20cage.png",
    series_name: "The Far Cage",
    collection: "On the Drawing Board",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  }
];

function safeCover(src?: string): string {
  return src && src.trim().length ? src : "/placeholder.svg";
}

export function useBooks() {
  const { data: thinkingEngineProgress } = useMaster4500BookProgress();

  return useQuery({
    queryKey: ["books-merged", thinkingEngineProgress],
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
        
        // Create staticMap for quick lookups
        const staticMap = new Map(staticBooks.map(b => [b.slug, b]));

        // Add Supabase books first with fallback to static data
        if (supabaseBooks) {
          supabaseBooks.forEach(book => {
            const staticRef = staticMap.get(book.slug);
            const supaCover = (book.cover_url || '').trim();
            const looksPlaceholder = !supaCover || supaCover.includes('placeholder');
            const finalCover = !looksPlaceholder && supaCover ? supaCover : (staticRef?.cover || supaCover);
            
            mergedBooks.push({
              id: book.id,
              slug: book.slug,
              title: book.title,
              subtitle: book.subtitle || staticRef?.subtitle,
              lead_description: (book.lead_description?.trim() || staticRef?.lead_description || ""),
              cover: safeCover(finalCover),
              series_name: book.series_name,
              collection: book.collection,
              status: book.status,
              owner: book.owner,
              due_date: book.due_date,
              draft_url: book.draft_url,
              ready_flag: book.ready_flag,
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
            let updatedBook = {
              ...staticBook,
              cover: safeCover(staticBook.cover)
            };

            // Update "The Thinking Engine" with database-driven progress
            if (staticBook.slug === 'thinking-engine' && thinkingEngineProgress) {
              updatedBook = {
                ...updatedBook,
                progress: thinkingEngineProgress.avgProgress,
                status: thinkingEngineProgress.complete > 0 ? 'in_progress' : 'planning'
              };
            }

            mergedBooks.push(updatedBook);
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