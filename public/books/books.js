// 15-book catalogue for Tech for Humanity
window.T4H_BOOKS = [
  {
    id: 1,
    title: "WorkFamilyAI",
    subtitle: "Tech for Humanity",
    slug: "workfamilyai",
    lead: "Practical AI systems for work, home, and community.",
    cover: "/assets/covers/workfamilyai.jpg",
    chapters: [
      { title: "Foundations", sections: ["Principles", "Safety", "Agent Roles"], progress: 65 },
      { title: "Household Agents", sections: ["Scheduling", "Care", "Finance"], progress: 40 },
      { title: "Org Agents", sections: ["PMO", "Ops", "Compliance"], progress: 55 }
    ]
  },
  {
    id: 2,
    title: "Sovereign Systems",
    subtitle: "Tech for Humanity",
    slug: "sovereign-systems",
    lead: "Open, interoperable, citizen-first digital infrastructure.",
    cover: "/assets/covers/sovereign-systems.jpg",
    chapters: [
      { title: "Civic Stack", sections: ["Identity", "Data Commons", "GovOps"], progress: 35 },
      { title: "Markets", sections: ["Payments", "Auditability", "Standards"], progress: 20 },
      { title: "Resilience", sections: ["Continuity", "Security", "Localism"], progress: 25 }
    ]
  },
  {
    id: 3,
    title: "The Time Tree",
    subtitle: "Tech for Humanity",
    slug: "the-time-tree",
    lead: "Time-aware planning across families, teams, and cities.",
    cover: "/assets/covers/time-tree.jpg",
    chapters: [
      { title: "Time Graph", sections: ["Nodes", "Edges", "Calendars"], progress: 50 },
      { title: "Predictions", sections: ["Signals", "Trajectories", "Risk"], progress: 30 },
      { title: "Execution", sections: ["Rituals", "Cadence", "Feedback"], progress: 15 }
    ]
  },
  // Stub the remaining 12. Replace titles/slugs later.
  { id: 4,  title: "Book 4",  subtitle: "Tech for Humanity", slug: "book-4",  lead: "Emerging technologies for sustainable development", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 5,  title: "Book 5",  subtitle: "Tech for Humanity", slug: "book-5",  lead: "Digital ethics and responsible innovation", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 6,  title: "Book 6",  subtitle: "Tech for Humanity", slug: "book-6",  lead: "Community-driven technology solutions", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 7,  title: "Book 7",  subtitle: "Tech for Humanity", slug: "book-7",  lead: "Inclusive design for accessible technology", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 8,  title: "Book 8",  subtitle: "Tech for Humanity", slug: "book-8",  lead: "Climate technology and environmental impact", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 9,  title: "Book 9",  subtitle: "Tech for Humanity", slug: "book-9",  lead: "Healthcare innovation and digital wellness", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 10, title: "Book 10", subtitle: "Tech for Humanity", slug: "book-10", lead: "Education technology and lifelong learning", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 11, title: "Book 11", subtitle: "Tech for Humanity", slug: "book-11", lead: "Financial inclusion and economic empowerment", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 12, title: "Book 12", subtitle: "Tech for Humanity", slug: "book-12", lead: "Privacy, security, and digital rights", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 13, title: "Book 13", subtitle: "Tech for Humanity", slug: "book-13", lead: "Global collaboration and technology governance", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 14, title: "Book 14", subtitle: "Tech for Humanity", slug: "book-14", lead: "Future of work and human-AI collaboration", cover: "/assets/covers/placeholder.jpg", chapters: [] },
  { id: 15, title: "Book 15", subtitle: "Tech for Humanity", slug: "book-15", lead: "Building resilient technological ecosystems", cover: "/assets/covers/placeholder.jpg", chapters: [] },
];

// Helper function
window.findBookBySlug = (slug) => 
  window.T4H_BOOKS.find(b => b.slug === slug);