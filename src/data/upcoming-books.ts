export interface UpcomingBook {
  slug: string;
  title: string;
  subtitle?: string;
  lead: string;
  cover?: string;
  series_name: string;
  status: "coming_soon";
  expectedDate?: string;
  teaserPoints?: string[];
}

export const UPCOMING_BOOKS: UpcomingBook[] = [
  {
    slug: "tech-for-humanity",
    title: "Tech for Humanity",
    subtitle: "Complete Collection",
    lead: "A comprehensive 15-volume exploration of technology's role in human flourishing across ethics, governance, healthcare, education, and environmental stewardship.",
    cover: "/assets/covers/tech-for-humanity-hub.jpg",
    series_name: "Tech for Humanity",
    status: "coming_soon",
    expectedDate: "2025 Q2",
    teaserPoints: [
      "15 interconnected volumes exploring AI ethics, digital rights, and regenerative systems",
      "Community-driven insights from diverse perspectives and domains",
      "Practical frameworks for aligning technology with human values"
    ]
  },
  {
    slug: "thinking-engine",
    title: "The Thinking Engine",
    subtitle: "Minds That Shaped Machine Intelligence",
    lead: "Journey through the intellectual lineage of artificial intelligence, from ancient philosophers to modern AI pioneers who transformed how machines think.",
    cover: "/assets/covers/thinking-engine-hub.jpg",
    series_name: "The Thinking Engine",
    status: "coming_soon",
    expectedDate: "2025 Q2",
    teaserPoints: [
      "Explore 4500+ thinkers who influenced AI development",
      "Connect historical ideas to modern machine learning breakthroughs",
      "Interactive genealogy of concepts across five technological eras"
    ]
  },
  {
    slug: "entangled-time",
    title: "Entangled Time",
    subtitle: "Navigating Causality in Complex Systems",
    lead: "Rethink time, causality, and decision-making through the lens of quantum mechanics, network theory, and temporal dynamics in AI systems.",
    cover: "/assets/covers/time-tree.jpg",
    series_name: "Entangled Time",
    status: "coming_soon",
    expectedDate: "2025 Q3",
    teaserPoints: [
      "Challenge linear assumptions about cause and effect",
      "Apply temporal frameworks to AI alignment and governance",
      "Bridge quantum theory with organizational decision-making"
    ]
  },
  {
    slug: "quantum-logic-systems",
    title: "Quantum Logic Systems",
    subtitle: "Beyond Binary Thinking",
    lead: "Discover how quantum principles reshape logic, computation, and reasoning systems for next-generation AI architectures.",
    cover: "/assets/covers/quantum-logic-systems.jpg",
    series_name: "Quantum Logic Systems",
    status: "coming_soon",
    expectedDate: "2025 Q3",
    teaserPoints: [
      "Move beyond classical true/false logic frameworks",
      "Explore superposition and entanglement in decision systems",
      "Design AI that handles uncertainty and ambiguity naturally"
    ]
  },
  {
    slug: "regenerative-organization",
    title: "The Regenerative Organization",
    subtitle: "Systems That Sustain and Evolve",
    lead: "Transform organizational design using principles from living systems, creating structures that adapt, learn, and regenerate continuously.",
    cover: "/assets/covers/regenerative-organization.jpg",
    series_name: "The Regenerative Organization",
    status: "coming_soon",
    expectedDate: "2025 Q4",
    teaserPoints: [
      "Apply biological resilience patterns to organizational design",
      "Create self-healing systems that evolve with their environment",
      "Bridge human networks with AI-augmented coordination"
    ]
  }
];
