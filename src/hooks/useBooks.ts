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
    lead: "A comprehensive 15-part exploration of technology's role in human flourishing.",
    cover: "/assets/covers/tech-for-humanity-hub.jpg",
    series_name: "Tech for Humanity",
    collection: "Suite Hub",
    status: "suite_hub",
    owner: "Editorial Team",
    ready_flag: true,
    chapters: []
  },
  
  // A1-A15: Tech for Humanity Volumes
  {
    id: "A1",
    title: "Ethics & Consent",
    subtitle: "Tech for Humanity Part 1",
    slug: "tech-for-humanity-ethics-consent",
    lead: "Foundational principles for ethical technology development and digital rights.",
    cover: "/assets/covers/tech-for-humanity-ethics-consent.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Digital Rights Framework", sections: ["Privacy", "Access", "Agency"], progress: 0, chapter_order: 1 },
      { title: "Ethical AI Principles", sections: ["Fairness", "Transparency", "Accountability"], progress: 0, chapter_order: 2 }
    ]
  },
  {
    id: "A2",
    title: "Governance & Policy", 
    subtitle: "Tech for Humanity Part 2",
    slug: "tech-for-humanity-governance-policy",
    lead: "How institutions adapt to govern emerging technologies effectively.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA", 
    ready_flag: false,
    chapters: []
  },
  {
    id: "A3",
    title: "Education & Knowledge",
    subtitle: "Tech for Humanity Part 3", 
    slug: "tech-for-humanity-education-knowledge",
    lead: "Transforming education through technology for lifelong learning.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A4",
    title: "Healthcare & Wellbeing",
    subtitle: "Tech for Humanity Part 4",
    slug: "tech-for-humanity-healthcare-wellbeing",
    lead: "Technology's role in healthcare, wellness, and human systems.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series", 
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A5",
    title: "Work and Economy",
    subtitle: "Tech for Humanity Part 5",
    slug: "workfamilyai",
    lead: "The future of work and economic systems in a technological age.",
    cover: "/assets/covers/workfamilyai.jpg",
    series_name: "Tech for Humanity", 
    collection: "A Series",
    status: "in_progress",
    owner: "Daniel Carterman",
    due_date: "2025-11-01",
    draft_url: "/drafts/workfamilyai-v0.1.pdf",
    ready_flag: true,
    chapters: [
      { title: "Foundations", sections: ["Principles", "Safety", "Agent Roles"], progress: 65, chapter_order: 1 },
      { title: "Household Agents", sections: ["Scheduling", "Care", "Finance"], progress: 40, chapter_order: 2 },
      { title: "Org Agents", sections: ["PMO", "Ops", "Compliance"], progress: 55, chapter_order: 3 }
    ]
  },
  {
    id: "A6",
    title: "Law, Policy, and Regulation", 
    subtitle: "Tech for Humanity Part 6",
    slug: "law-policy-regulation",
    lead: "Legal frameworks and policy approaches for emerging technologies.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft", 
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A7", 
    title: "Security and Defence",
    subtitle: "Tech for Humanity Part 7",
    slug: "security-defence",
    lead: "Technology's role in security, defense, and conflict resolution.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false, 
    chapters: []
  },
  {
    id: "A8",
    title: "Equity, Inclusion, and Justice",
    subtitle: "Tech for Humanity Part 8", 
    slug: "equity-inclusion-justice",
    lead: "Using technology to advance equity, inclusion, and social justice.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A9",
    title: "Climate & Environment",
    subtitle: "Tech for Humanity Part 9",
    slug: "tech-for-humanity-climate-environment",
    lead: "Technology solutions for environmental challenges and sustainability.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA", 
    ready_flag: false,
    chapters: []
  },
  {
    id: "A10",
    title: "Culture and Society",
    subtitle: "Tech for Humanity Part 10",
    slug: "culture-society",
    lead: "Technology's impact on culture, social structures, and human relationships.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A11", 
    title: "Cities and Infrastructure",
    subtitle: "Tech for Humanity Part 11",
    slug: "cities-infrastructure",
    lead: "Smart cities, infrastructure, and urban technology systems.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity", 
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A12",
    title: "Business and Industry", 
    subtitle: "Tech for Humanity Part 12",
    slug: "business-industry",
    lead: "Technology transformation in business and industrial sectors.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A13",
    title: "Innovation and Foresight",
    subtitle: "Tech for Humanity Part 13",
    slug: "innovation-foresight",
    lead: "Innovation systems and strategic foresight for emerging technologies.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series", 
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },
  {
    id: "A14",
    title: "Energy and Resources",
    subtitle: "Tech for Humanity Part 14",
    slug: "energy-resources",
    lead: "Technology solutions for energy systems and resource management.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA", 
    ready_flag: false,
    chapters: []
  },
  {
    id: "A15",
    title: "Philosophy and Meaning",
    subtitle: "Tech for Humanity Part 15",
    slug: "philosophy-meaning",
    lead: "Philosophical implications of technology and questions of meaning.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Tech for Humanity",
    collection: "A Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: []
  },

  // B: Entangled Time - Single book with chapters
  {
    id: "B",
    title: "Entangled Time",
    subtitle: "Temporal Intelligence for Complex Systems", 
    slug: "entangled-time",
    lead: "A comprehensive guide to time-aware planning across families, teams, and cities.",
    cover: "/assets/covers/time-tree.jpg",
    series_name: "Entangled Time",
    collection: "Single Book",
    status: "in_progress",
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
    lead: "A 10,000-word thesis documenting the Living Stack ecosystem—where tasks are treated as signals, roles mutate in real-time, and recovery mechanisms ensure continuity across human-machine collaboration.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "Living Stack",
    collection: "Single Book",
    status: "draft",
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

  // C: The Thinking Engine - Suite Hub 
  {
    id: "C",
    title: "The Thinking Engine",
    subtitle: "Complete Collection",
    slug: "thinking-engine",
    lead: "A 15-part exploration of cognitive systems, decision-making, and intelligent design.",
    cover: "/assets/covers/thinking-engine-hub.jpg",
    series_name: "The Thinking Engine", 
    collection: "Suite Hub",
    status: "suite_hub",
    owner: "Editorial Team",
    ready_flag: true,
    chapters: []
  },

  // C1-C15: The Thinking Engine Volumes (Reordered per 15-Book Series PDF)
  {
    id: "C1",
    title: "Roles: Humans in the Machine",
    subtitle: "The Thinking Engine Part 1",
    slug: "roles-humans-in-machine",
    lead: "How human roles evolve in increasingly automated systems.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA", 
    ready_flag: false,
    chapters: [
      { title: "Leaders", sections: ["CEO", "CIO", "CTO", "CFO"], progress: 0, chapter_order: 1 },
      { title: "Strategists", sections: ["Enterprise Architect", "Portfolio Manager", "Innovation Lead"], progress: 0, chapter_order: 2 },
      { title: "Planners", sections: ["Project Manager", "Product Owner", "Scrum Master"], progress: 0, chapter_order: 3 },
      { title: "Analysts", sections: ["Business Analyst", "Data Analyst", "Change Analyst"], progress: 0, chapter_order: 4 },
      { title: "Builders", sections: ["Developers", "Engineers", "Cloud Architects"], progress: 0, chapter_order: 5 },
      { title: "Guardians", sections: ["CISO", "Auditor", "Risk Manager"], progress: 0, chapter_order: 6 },
      { title: "Operators", sections: ["Service Desk", "SRE", "Ops Manager"], progress: 0, chapter_order: 7 },
      { title: "People & Culture", sections: ["HR", "L&D", "Coaches"], progress: 0, chapter_order: 8 },
      { title: "Market-facing", sections: ["Sales", "Marketing", "CX", "Support"], progress: 0, chapter_order: 9 },
      { title: "Civic & Citizen Roles", sections: ["Policymakers", "Regulators", "Patients"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C2",
    title: "Frameworks: Patterns of Action", 
    subtitle: "The Thinking Engine Part 2",
    slug: "frameworks",
    lead: "Decision-making frameworks and action patterns for complex systems.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Decision Loops", sections: ["OODA", "Cynefin", "S-Curve"], progress: 0, chapter_order: 1 },
      { title: "Change & Adoption", sections: ["Kotter", "ADKAR", "Diffusion"], progress: 0, chapter_order: 2 },
      { title: "Service & Ops", sections: ["ITIL", "SIAM", "COBIT"], progress: 0, chapter_order: 3 },
      { title: "Architecture & Governance", sections: ["TOGAF", "IT4IT", "ISO 38500"], progress: 0, chapter_order: 4 },
      { title: "Quality & Improvement", sections: ["Lean", "Six Sigma", "TQM"], progress: 0, chapter_order: 5 },
      { title: "Strategy Tools", sections: ["Porter", "BCG", "Ansoff"], progress: 0, chapter_order: 6 },
      { title: "Innovation Lenses", sections: ["Blue Ocean", "Disruption", "Horizon"], progress: 0, chapter_order: 7 },
      { title: "Ethics & Accountability", sections: ["Belmont", "FAT ML", "OECD AI"], progress: 0, chapter_order: 8 },
      { title: "Systems & Ecology", sections: ["Panarchy", "Resilience", "Viable Systems"], progress: 0, chapter_order: 9 },
      { title: "Learning & Adaptation", sections: ["Learning Health System", "Continuous Learning"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C3",
    title: "Thinkers: Brains That Shaped Brains",
    subtitle: "The Thinking Engine Part 3",
    slug: "thinkers-brains-that-shaped-brains",
    lead: "Influential minds who shaped our understanding of intelligence and decision-making.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Behavioural Economics", sections: ["Kahneman", "Tversky", "Thaler", "Sunstein"], progress: 0, chapter_order: 1 },
      { title: "Complexity & Risk", sections: ["Taleb", "Holland", "Bar-Yam"], progress: 0, chapter_order: 2 },
      { title: "Cybernetics & Systems", sections: ["Wiener", "Ashby", "Beer"], progress: 0, chapter_order: 3 },
      { title: "Feminist & Posthuman", sections: ["Haraway", "Braidotti", "Butler"], progress: 0, chapter_order: 4 },
      { title: "Commons & Governance", sections: ["Ostrom", "Rawls", "Sen"], progress: 0, chapter_order: 5 },
      { title: "Ecology & Environment", sections: ["Meadows", "Bateson", "Lovelock"], progress: 0, chapter_order: 6 },
      { title: "Philosophy of Tech", sections: ["Heidegger", "Latour", "Foucault"], progress: 0, chapter_order: 7 },
      { title: "Optimists", sections: ["Kurzweil", "Musk", "Tegmark"], progress: 0, chapter_order: 8 },
      { title: "Skeptics", sections: ["Zuboff", "Carr", "Lanier"], progress: 0, chapter_order: 9 },
      { title: "Bridge Builders", sections: ["Modern", "Interdisciplinary", "Voices"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C4",
    title: "Institutions: Guardians & Gatekeepers",
    subtitle: "The Thinking Engine Part 4",
    slug: "institutions-guardians-gatekeepers",
    lead: "How institutions shape and are shaped by technological systems.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft", 
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Universities", sections: ["Academia", "Research", "Teaching"], progress: 0, chapter_order: 1 },
      { title: "Standards Bodies", sections: ["ISO", "IEEE", "W3C"], progress: 0, chapter_order: 2 },
      { title: "Think Tanks", sections: ["Policy", "Research", "Advocacy"], progress: 0, chapter_order: 3 },
      { title: "Professional Bodies", sections: ["Ethics", "Certification", "Regulation"], progress: 0, chapter_order: 4 },
      { title: "Regulatory Agencies", sections: ["Government", "Oversight", "Enforcement"], progress: 0, chapter_order: 5 },
      { title: "Industry Consortia", sections: ["Collaboration", "Innovation", "Standards"], progress: 0, chapter_order: 6 },
      { title: "NGOs & Advocacy", sections: ["Rights", "Environment", "Ethics"], progress: 0, chapter_order: 7 },
      { title: "Media & Publishing", sections: ["Journalism", "Books", "Communication"], progress: 0, chapter_order: 8 },
      { title: "Foundations", sections: ["Funding", "Research", "Impact"], progress: 0, chapter_order: 9 },
      { title: "International Bodies", sections: ["UN", "EU", "Global"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C5",
    title: "Technologies: The New Nervous System",
    subtitle: "The Thinking Engine Part 5",
    slug: "technologies-nervous-system",
    lead: "How technology functions as society's nervous system.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Cloud & Compute", sections: ["IaaS", "PaaS", "SaaS"], progress: 0, chapter_order: 1 },
      { title: "Data & AI", sections: ["ML", "Neural Nets", "LLMs"], progress: 0, chapter_order: 2 },
      { title: "Connectivity", sections: ["5G", "IoT", "Edge"], progress: 0, chapter_order: 3 },
      { title: "Interfaces", sections: ["VR", "AR", "BCI"], progress: 0, chapter_order: 4 },
      { title: "Blockchain & Crypto", sections: ["Distributed", "Trust", "Tokens"], progress: 0, chapter_order: 5 },
      { title: "Robotics & Automation", sections: ["Physical", "Software", "Hybrid"], progress: 0, chapter_order: 6 },
      { title: "Sensing & Monitoring", sections: ["Sensors", "Analytics", "Alerts"], progress: 0, chapter_order: 7 },
      { title: "Synthetic Biology", sections: ["Gene", "Cell", "Organism"], progress: 0, chapter_order: 8 },
      { title: "Quantum Computing", sections: ["Hardware", "Algorithms", "Applications"], progress: 0, chapter_order: 9 },
      { title: "Nanotechnology", sections: ["Materials", "Medicine", "Manufacturing"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C6",
    title: "Doctrines: Strategy Under Signal",
    subtitle: "The Thinking Engine Part 6",
    slug: "doctrines-strategy-signal",
    lead: "Strategic doctrines for operating in high-signal environments.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine", 
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Wardley Mapping", sections: ["Evolution", "Landscape", "Movement"], progress: 0, chapter_order: 1 },
      { title: "Agile Doctrine", sections: ["Principles", "Practices", "Culture"], progress: 0, chapter_order: 2 },
      { title: "DevOps Philosophy", sections: ["CI/CD", "Culture", "Tools"], progress: 0, chapter_order: 3 },
      { title: "Design Thinking", sections: ["Empathy", "Prototype", "Test"], progress: 0, chapter_order: 4 },
      { title: "Lean Startup", sections: ["Build", "Measure", "Learn"], progress: 0, chapter_order: 5 },
      { title: "Open Source", sections: ["Community", "Licensing", "Governance"], progress: 0, chapter_order: 6 },
      { title: "Privacy by Design", sections: ["Principles", "Implementation", "Compliance"], progress: 0, chapter_order: 7 },
      { title: "Security First", sections: ["Zero Trust", "Defense", "Response"], progress: 0, chapter_order: 8 },
      { title: "Sustainability", sections: ["Green IT", "Circular", "Impact"], progress: 0, chapter_order: 9 },
      { title: "Responsible AI", sections: ["Ethics", "Fairness", "Transparency"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C7",
    title: "Disciplines: Fields Under Pressure",
    subtitle: "The Thinking Engine Part 7",
    slug: "disciplines-fields-pressure",
    lead: "How academic and professional disciplines adapt to technological pressure.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Computer Science", sections: ["Theory", "Systems", "AI"], progress: 0, chapter_order: 1 },
      { title: "Data Science", sections: ["Statistics", "ML", "Visualization"], progress: 0, chapter_order: 2 },
      { title: "Cognitive Science", sections: ["Mind", "Brain", "Behavior"], progress: 0, chapter_order: 3 },
      { title: "Neuroscience", sections: ["Neural", "Cognitive", "Computational"], progress: 0, chapter_order: 4 },
      { title: "Psychology", sections: ["Human Factors", "Behavioral", "Social"], progress: 0, chapter_order: 5 },
      { title: "Sociology", sections: ["Social Networks", "Culture", "Change"], progress: 0, chapter_order: 6 },
      { title: "Economics", sections: ["Behavioral", "Digital", "Platform"], progress: 0, chapter_order: 7 },
      { title: "Ethics & Philosophy", sections: ["Applied", "Tech", "Policy"], progress: 0, chapter_order: 8 },
      { title: "Law", sections: ["Cyber", "IP", "Privacy"], progress: 0, chapter_order: 9 },
      { title: "Systems Thinking", sections: ["Complexity", "Emergence", "Feedback"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C8",
    title: "Cultures: Ways of Working",
    subtitle: "The Thinking Engine Part 8",
    slug: "cultures-ways-working",
    lead: "Organizational cultures and their relationship to technological adoption.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Startup Culture", sections: ["Speed", "Risk", "Innovation"], progress: 0, chapter_order: 1 },
      { title: "Enterprise Culture", sections: ["Scale", "Process", "Stability"], progress: 0, chapter_order: 2 },
      { title: "Academic Culture", sections: ["Rigor", "Peer Review", "Publishing"], progress: 0, chapter_order: 3 },
      { title: "Government Culture", sections: ["Policy", "Public Service", "Accountability"], progress: 0, chapter_order: 4 },
      { title: "Military Culture", sections: ["Command", "Mission", "Discipline"], progress: 0, chapter_order: 5 },
      { title: "Healthcare Culture", sections: ["Care", "Evidence", "Safety"], progress: 0, chapter_order: 6 },
      { title: "Creative Culture", sections: ["Experimentation", "Expression", "Iteration"], progress: 0, chapter_order: 7 },
      { title: "Open Source Culture", sections: ["Collaboration", "Transparency", "Community"], progress: 0, chapter_order: 8 },
      { title: "Indigenous Cultures", sections: ["Traditional", "Holistic", "Collective"], progress: 0, chapter_order: 9 },
      { title: "Emerging Cultures", sections: ["Remote", "Gig", "DAO"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C9", 
    title: "Products: Tangible Anchors",
    subtitle: "The Thinking Engine Part 9",
    slug: "products-tangible-anchors",
    lead: "How products serve as anchors for abstract technological concepts.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "AI Assistants", sections: ["ChatGPT", "Claude", "Gemini"], progress: 0, chapter_order: 1 },
      { title: "Development Tools", sections: ["GitHub", "VS Code", "Docker"], progress: 0, chapter_order: 2 },
      { title: "Collaboration Platforms", sections: ["Slack", "Teams", "Notion"], progress: 0, chapter_order: 3 },
      { title: "Cloud Services", sections: ["AWS", "Azure", "GCP"], progress: 0, chapter_order: 4 },
      { title: "Consumer Devices", sections: ["iPhone", "Wearables", "Smart Home"], progress: 0, chapter_order: 5 },
      { title: "Enterprise Software", sections: ["Salesforce", "SAP", "Oracle"], progress: 0, chapter_order: 6 },
      { title: "Data Platforms", sections: ["Snowflake", "Databricks", "Tableau"], progress: 0, chapter_order: 7 },
      { title: "Security Products", sections: ["Firewalls", "Zero Trust", "SIEM"], progress: 0, chapter_order: 8 },
      { title: "Emerging Tech", sections: ["BCI", "AR/VR", "Quantum"], progress: 0, chapter_order: 9 },
      { title: "Open Source Tools", sections: ["Linux", "Kubernetes", "TensorFlow"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C10",
    title: "Eras: Time as Canvas",
    subtitle: "The Thinking Engine Part 10",
    slug: "eras-time-canvas",
    lead: "Historical eras and temporal patterns in technological development.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series", 
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Pre-Digital Era", sections: ["Analog", "Mechanical", "Industrial"], progress: 0, chapter_order: 1 },
      { title: "Mainframe Era", sections: ["Centralized", "Batch", "Enterprise"], progress: 0, chapter_order: 2 },
      { title: "PC Era", sections: ["Personal", "Desktop", "Productivity"], progress: 0, chapter_order: 3 },
      { title: "Internet Era", sections: ["Connected", "Web", "Email"], progress: 0, chapter_order: 4 },
      { title: "Mobile Era", sections: ["Smartphones", "Apps", "Always On"], progress: 0, chapter_order: 5 },
      { title: "Cloud Era", sections: ["On-Demand", "Scalable", "Services"], progress: 0, chapter_order: 6 },
      { title: "Social Era", sections: ["Networks", "Content", "Influence"], progress: 0, chapter_order: 7 },
      { title: "Data Era", sections: ["Big Data", "Analytics", "Insights"], progress: 0, chapter_order: 8 },
      { title: "AI Era", sections: ["Machine Learning", "Generative", "Autonomous"], progress: 0, chapter_order: 9 },
      { title: "Future Eras", sections: ["Quantum", "BCI", "Singularity"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C11",
    title: "Principles: Guardrails & Values",
    subtitle: "The Thinking Engine Part 11",
    slug: "principles-guardrails-values",
    lead: "Core principles and values that guide technological development.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Human Dignity", sections: ["Respect", "Autonomy", "Rights"], progress: 0, chapter_order: 1 },
      { title: "Fairness & Justice", sections: ["Equity", "Bias", "Access"], progress: 0, chapter_order: 2 },
      { title: "Transparency", sections: ["Explainability", "Accountability", "Openness"], progress: 0, chapter_order: 3 },
      { title: "Privacy", sections: ["Data Protection", "Consent", "Control"], progress: 0, chapter_order: 4 },
      { title: "Safety & Security", sections: ["Risk Management", "Resilience", "Protection"], progress: 0, chapter_order: 5 },
      { title: "Sustainability", sections: ["Environment", "Long-term", "Regenerative"], progress: 0, chapter_order: 6 },
      { title: "Inclusivity", sections: ["Diversity", "Accessibility", "Participation"], progress: 0, chapter_order: 7 },
      { title: "Beneficence", sections: ["Do Good", "Help", "Improve"], progress: 0, chapter_order: 8 },
      { title: "Non-Maleficence", sections: ["Do No Harm", "Minimize Risk", "Prevent"], progress: 0, chapter_order: 9 },
      { title: "Democratic Values", sections: ["Participation", "Representation", "Accountability"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C12", 
    title: "Organizations: Winners & Losers",
    subtitle: "The Thinking Engine Part 12",
    slug: "organizations-winners-losers",
    lead: "Organizational dynamics in technological transformation.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Tech Giants", sections: ["Google", "Microsoft", "Amazon", "Apple"], progress: 0, chapter_order: 1 },
      { title: "AI Labs", sections: ["OpenAI", "Anthropic", "DeepMind"], progress: 0, chapter_order: 2 },
      { title: "Legacy Enterprises", sections: ["Banks", "Telcos", "Manufacturers"], progress: 0, chapter_order: 3 },
      { title: "Unicorn Startups", sections: ["Stripe", "Airbnb", "SpaceX"], progress: 0, chapter_order: 4 },
      { title: "Research Institutions", sections: ["MIT", "Stanford", "CERN"], progress: 0, chapter_order: 5 },
      { title: "Government Agencies", sections: ["DARPA", "NASA", "NIST"], progress: 0, chapter_order: 6 },
      { title: "NGOs & Foundations", sections: ["Gates", "Mozilla", "EFF"], progress: 0, chapter_order: 7 },
      { title: "Failed Companies", sections: ["Kodak", "Blockbuster", "Nokia"], progress: 0, chapter_order: 8 },
      { title: "Emerging Players", sections: ["Web3", "BCI", "Quantum"], progress: 0, chapter_order: 9 },
      { title: "Hidden Champions", sections: ["Bosch", "SAP", "ASML"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C13",
    title: "Environment: Non-human Stakeholders",
    subtitle: "The Thinking Engine Part 13",
    slug: "environment-nonhuman-stakeholders",
    lead: "The role of non-human stakeholders in technological systems.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Biosphere", sections: ["Ecosystems", "Biodiversity", "Climate"], progress: 0, chapter_order: 1 },
      { title: "Animals", sections: ["Wildlife", "Domesticated", "Rights"], progress: 0, chapter_order: 2 },
      { title: "Plants & Forests", sections: ["Carbon Sinks", "Biodiversity", "Resources"], progress: 0, chapter_order: 3 },
      { title: "Water Systems", sections: ["Oceans", "Rivers", "Aquifers"], progress: 0, chapter_order: 4 },
      { title: "Atmosphere", sections: ["Air Quality", "Climate", "Ozone"], progress: 0, chapter_order: 5 },
      { title: "Soil & Land", sections: ["Agriculture", "Degradation", "Restoration"], progress: 0, chapter_order: 6 },
      { title: "Minerals & Resources", sections: ["Extraction", "Depletion", "Recycling"], progress: 0, chapter_order: 7 },
      { title: "Future Generations", sections: ["Intergenerational", "Legacy", "Stewardship"], progress: 0, chapter_order: 8 },
      { title: "AI Agents", sections: ["Autonomy", "Rights", "Coexistence"], progress: 0, chapter_order: 9 },
      { title: "Planetary Boundaries", sections: ["Limits", "Thresholds", "Tipping Points"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C14",
    title: "Energy & Forces: Invisible Drivers", 
    subtitle: "The Thinking Engine Part 14",
    slug: "energy-forces-invisible-drivers",
    lead: "Invisible forces and energy systems that drive technological change.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Capital Flows", sections: ["VC", "Markets", "Investment"], progress: 0, chapter_order: 1 },
      { title: "Power Dynamics", sections: ["Control", "Influence", "Leverage"], progress: 0, chapter_order: 2 },
      { title: "Network Effects", sections: ["Metcalfe", "Winner-take-all", "Lock-in"], progress: 0, chapter_order: 3 },
      { title: "Attention Economy", sections: ["Engagement", "Addiction", "Manipulation"], progress: 0, chapter_order: 4 },
      { title: "Data Gravity", sections: ["Accumulation", "Centralization", "Value"], progress: 0, chapter_order: 5 },
      { title: "Technical Debt", sections: ["Legacy", "Maintenance", "Refactoring"], progress: 0, chapter_order: 6 },
      { title: "Regulatory Pressure", sections: ["Compliance", "Enforcement", "Lobbying"], progress: 0, chapter_order: 7 },
      { title: "Social Movements", sections: ["Activism", "Protest", "Change"], progress: 0, chapter_order: 8 },
      { title: "Cultural Zeitgeist", sections: ["Trends", "Memes", "Narratives"], progress: 0, chapter_order: 9 },
      { title: "Existential Risks", sections: ["AI Safety", "Climate", "Catastrophe"], progress: 0, chapter_order: 10 }
    ]
  },
  {
    id: "C15",
    title: "Unstructured: Wildcards",
    subtitle: "The Thinking Engine Part 15", 
    slug: "unstructured-wildcards",
    lead: "Unstructured elements and wildcard scenarios in complex systems.",
    cover: "/assets/covers/placeholder.jpg",
    series_name: "The Thinking Engine",
    collection: "C Series",
    status: "draft",
    owner: "TBA",
    ready_flag: false,
    chapters: [
      { title: "Black Swans", sections: ["Rare Events", "High Impact", "Unpredictable"], progress: 0, chapter_order: 1 },
      { title: "Emergent Behaviors", sections: ["Complexity", "Surprise", "Adaptation"], progress: 0, chapter_order: 2 },
      { title: "Paradigm Shifts", sections: ["Revolutionary", "Disruptive", "Transformative"], progress: 0, chapter_order: 3 },
      { title: "Serendipity", sections: ["Accidents", "Discovery", "Luck"], progress: 0, chapter_order: 4 },
      { title: "Human Error", sections: ["Mistakes", "Failures", "Learning"], progress: 0, chapter_order: 5 },
      { title: "Unintended Consequences", sections: ["Side Effects", "Ripple Effects", "Cascades"], progress: 0, chapter_order: 6 },
      { title: "Edge Cases", sections: ["Outliers", "Exceptions", "Anomalies"], progress: 0, chapter_order: 7 },
      { title: "Unknown Unknowns", sections: ["Rumsfeld", "Blindspots", "Discovery"], progress: 0, chapter_order: 8 },
      { title: "Hybrid Forms", sections: ["Combinations", "Fusions", "Novel"], progress: 0, chapter_order: 9 },
      { title: "User-Defined", sections: ["Custom", "Personalized", "Wildcard"], progress: 0, chapter_order: 10 }
    ]
  },

  // D: Quantum Logic Systems - Single book with chapters
  {
    id: "D",
    title: "Quantum Logic Systems / Quantum Life Sciences",
    subtitle: "Quantum Foundations for Biological and Cognitive Systems",
    slug: "quantum-logic-systems",
    lead: "Exploring quantum principles in biological systems and their implications for AI and consciousness.",
    cover: "/assets/covers/quantum-logic-systems.jpg",
    series_name: "Quantum Logic Systems",
    collection: "Single Volume",
    status: "concept",
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
    lead: "A practical framework for building adaptive, regenerative organizational systems.",
    cover: "/assets/covers/regenerative-organization.jpg",
    series_name: "The Regenerative Organization",
    collection: "Single Volume",
    status: "concept",
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
    lead: "32 narrative vignettes exploring Brain-Computer Interface governance through 9 characters across 5 story arcs.",
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
              lead: (book.lead_description?.trim() || staticRef?.lead || ""),
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