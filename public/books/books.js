// 33-book catalog with 5 main series (A-E)
window.T4H_BOOKS = [
  // A: Tech for Humanity - Suite Hub + 15 volumes
  { id: "A", title: "Tech for Humanity", subtitle: "Complete Collection", slug: "tech-for-humanity", lead: "A comprehensive 15-volume exploration of technology's role in human flourishing.", cover: "/assets/covers/tech-for-humanity-hub.jpg", series_name: "Tech for Humanity", collection: "Suite Hub", chapters: [] },
  { id: "A1", title: "Ethics & Consent", subtitle: "Tech for Humanity Vol. 1", slug: "tech-for-humanity-ethics-consent", lead: "Foundational principles for ethical technology development and digital rights.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A2", title: "Governance & Policy", subtitle: "Tech for Humanity Vol. 2", slug: "tech-for-humanity-governance-policy", lead: "How institutions adapt to govern emerging technologies effectively.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A3", title: "Education & Knowledge", subtitle: "Tech for Humanity Vol. 3", slug: "tech-for-humanity-education-knowledge", lead: "Transforming education through technology for lifelong learning.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A4", title: "Healthcare & Wellbeing", subtitle: "Tech for Humanity Vol. 4", slug: "tech-for-humanity-healthcare-wellbeing", lead: "Technology's role in healthcare, wellness, and human systems.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A5", title: "Work and Economy", subtitle: "Tech for Humanity Vol. 5", slug: "work-economy", lead: "The future of work and economic systems in a technological age.", cover: "/assets/covers/workfamilyai.jpg", series_name: "Tech for Humanity", chapters: [
    { title: "Foundations", sections: ["Principles", "Safety", "Agent Roles"], progress: 65 },
    { title: "Household Agents", sections: ["Scheduling", "Care", "Finance"], progress: 40 },
    { title: "Org Agents", sections: ["PMO", "Ops", "Compliance"], progress: 55 }
  ]},
  { id: "A6", title: "Law, Policy, and Regulation", subtitle: "Tech for Humanity Vol. 6", slug: "law-policy-regulation", lead: "Legal frameworks and policy approaches for emerging technologies.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A7", title: "Security and Defence", subtitle: "Tech for Humanity Vol. 7", slug: "security-defence", lead: "Technology's role in security, defense, and conflict resolution.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A8", title: "Equity, Inclusion, and Justice", subtitle: "Tech for Humanity Vol. 8", slug: "equity-inclusion-justice", lead: "Using technology to advance equity, inclusion, and social justice.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A9", title: "Climate & Environment", subtitle: "Tech for Humanity Vol. 9", slug: "tech-for-humanity-climate-environment", lead: "Technology solutions for environmental challenges and sustainability.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A10", title: "Culture and Society", subtitle: "Tech for Humanity Vol. 10", slug: "culture-society", lead: "Technology's impact on culture, social structures, and human relationships.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A11", title: "Cities and Infrastructure", subtitle: "Tech for Humanity Vol. 11", slug: "cities-infrastructure", lead: "Smart cities, infrastructure, and urban technology systems.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A12", title: "Business and Industry", subtitle: "Tech for Humanity Vol. 12", slug: "business-industry", lead: "Technology transformation in business and industrial sectors.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A13", title: "Innovation and Foresight", subtitle: "Tech for Humanity Vol. 13", slug: "innovation-foresight", lead: "Innovation systems and strategic foresight for emerging technologies.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A14", title: "Energy and Resources", subtitle: "Tech for Humanity Vol. 14", slug: "energy-resources", lead: "Technology solutions for energy systems and resource management.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },
  { id: "A15", title: "Philosophy and Meaning", subtitle: "Tech for Humanity Vol. 15", slug: "philosophy-meaning", lead: "Philosophical implications of technology and questions of meaning.", cover: "/assets/covers/placeholder.jpg", series_name: "Tech for Humanity", chapters: [] },

  // B: Entangled Time - Single book with 7 chapters
  { id: "B", title: "Entangled Time", subtitle: "Temporal Intelligence for Complex Systems", slug: "entangled-time", lead: "A comprehensive guide to time-aware planning across families, teams, and cities.", cover: "/assets/covers/time-tree.jpg", series_name: "Entangled Time", chapters: [
    { title: "The Time Tree", sections: ["Nodes", "Edges", "Calendars"], progress: 50 },
    { title: "Narrative Vignettes", sections: ["Stories", "Scenarios", "Cases"], progress: 30 },
    { title: "Stakeholder Mapping", sections: ["Actors", "Interests", "Relationships"], progress: 15 },
    { title: "Futures Cone (1–10 years)", sections: ["Trends", "Uncertainties", "Wildcards"], progress: 0 },
    { title: "Signal Spikes and Logs", sections: ["Detection", "Analysis", "Response"], progress: 0 },
    { title: "Consent Through Time", sections: ["Ethics", "Consent", "Governance"], progress: 0 },
    { title: "Dystopian and Alternative Futures", sections: ["Risks", "Alternatives", "Mitigation"], progress: 0 }
  ]},

  // C: The Thinking Engine - Suite Hub + 15 volumes
  { id: "C", title: "The Thinking Engine", subtitle: "Complete Collection", slug: "thinking-engine", lead: "A 15-volume exploration of cognitive systems, decision-making, and intelligent design.", cover: "/assets/covers/thinking-engine-hub.jpg", series_name: "The Thinking Engine", collection: "Suite Hub", chapters: [] },
  { id: "C1", title: "Roles: Humans in the Machine", subtitle: "The Thinking Engine Vol. 1", slug: "roles-humans-in-machine", lead: "How human roles evolve in increasingly automated systems.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C2", title: "Frameworks: Patterns of Action", subtitle: "The Thinking Engine Vol. 2", slug: "frameworks", lead: "Decision-making frameworks and action patterns for complex systems.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C3", title: "Thinkers: Brains That Shaped Brains", subtitle: "The Thinking Engine Vol. 3", slug: "thinkers-brains-shaped-brains", lead: "Influential minds who shaped our understanding of intelligence and decision-making.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C4", title: "Institutions: Guardians & Gatekeepers", subtitle: "The Thinking Engine Vol. 4", slug: "institutions-guardians-gatekeepers", lead: "How institutions shape and are shaped by technological systems.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C5", title: "Technologies: The New Nervous System", subtitle: "The Thinking Engine Vol. 5", slug: "technologies-nervous-system", lead: "How technology functions as society's nervous system.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C6", title: "Doctrines: Strategy Under Signal", subtitle: "The Thinking Engine Vol. 6", slug: "doctrines-strategy-signal", lead: "Strategic doctrines for operating in high-signal environments.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C7", title: "Disciplines: Fields Under Pressure", subtitle: "The Thinking Engine Vol. 7", slug: "disciplines-fields-pressure", lead: "How academic and professional disciplines adapt to technological pressure.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C8", title: "Cultures: Ways of Working", subtitle: "The Thinking Engine Vol. 8", slug: "cultures-ways-working", lead: "Organizational cultures and their relationship to technological adoption.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C9", title: "Products: Tangible Anchors", subtitle: "The Thinking Engine Vol. 9", slug: "products-tangible-anchors", lead: "How products serve as anchors for abstract technological concepts.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C10", title: "Eras: Time as Canvas", subtitle: "The Thinking Engine Vol. 10", slug: "eras-time-canvas", lead: "Historical eras and temporal patterns in technological development.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C11", title: "Principles: Guardrails & Values", subtitle: "The Thinking Engine Vol. 11", slug: "principles-guardrails-values", lead: "Core principles and values that guide technological development.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C12", title: "Organizations: Winners & Losers", subtitle: "The Thinking Engine Vol. 12", slug: "organizations-winners-losers", lead: "Organizational dynamics in technological transformation.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C13", title: "Environment: Non-human Stakeholders", subtitle: "The Thinking Engine Vol. 13", slug: "environment-nonhuman-stakeholders", lead: "The role of non-human stakeholders in technological systems.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C14", title: "Energy & Forces: Invisible Drivers", subtitle: "The Thinking Engine Vol. 14", slug: "energy-forces-invisible-drivers", lead: "Invisible forces and energy systems that drive technological change.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },
  { id: "C15", title: "Unstructured: Wildcards", subtitle: "The Thinking Engine Vol. 15", slug: "unstructured-wildcards", lead: "Unstructured elements and wildcard scenarios in complex systems.", cover: "/assets/covers/placeholder.jpg", series_name: "The Thinking Engine", chapters: [] },

  // D: Quantum Logic Systems - Single book with 7 chapters
  { id: "D", title: "Quantum Logic Systems / Quantum Life Sciences", subtitle: "Quantum Foundations for Biological and Cognitive Systems", slug: "quantum-logic-systems", lead: "Exploring quantum principles in biological systems and their implications for AI and consciousness.", cover: "/assets/covers/placeholder.jpg", series_name: "Quantum Logic Systems", chapters: [
    { title: "Quantum Foundations", sections: ["Principles", "Mathematics", "Biology"], progress: 0 },
    { title: "Life Sciences Integration", sections: ["Cellular", "Neural", "Systemic"], progress: 0 },
    { title: "Neural & Cognitive Models", sections: ["Consciousness", "Cognition", "Memory"], progress: 0 },
    { title: "Quantum Agents & Signals", sections: ["Agency", "Communication", "Entanglement"], progress: 0 },
    { title: "Biology + Quantum Interactions", sections: ["Photosynthesis", "Navigation", "Coherence"], progress: 0 },
    { title: "Implications for BCI & AI", sections: ["Interfaces", "Intelligence", "Enhancement"], progress: 0 },
    { title: "Futures and Experiments", sections: ["Research", "Applications", "Ethics"], progress: 0 }
  ]},

  // E: The Regenerative Organization - Single book with 7 chapters  
  { id: "E", title: "The Regenerative Organization", subtitle: "STRIP-MAP-UPDATE Framework for Adaptive Systems", slug: "regenerative-organization", lead: "A practical framework for building adaptive, regenerative organizational systems.", cover: "/assets/covers/regenerative-organization.jpg", series_name: "The Regenerative Organization", chapters: [
    { title: "STRIP – Identify Legacy Patterns", sections: ["Assessment", "Mapping", "Analysis"], progress: 0 },
    { title: "MAP – Systems and Flows", sections: ["Visualization", "Dependencies", "Constraints"], progress: 0 },
    { title: "UPDATE – Adaptive Cycles", sections: ["Iteration", "Feedback", "Evolution"], progress: 0 },
    { title: "Regeneration in Practice", sections: ["Implementation", "Tools", "Metrics"], progress: 0 },
    { title: "Culture and Change Readiness", sections: ["Mindset", "Skills", "Leadership"], progress: 0 },
    { title: "Ecosystem-Level Regeneration", sections: ["Networks", "Partnerships", "Impact"], progress: 0 },
    { title: "Future-Oriented Metrics", sections: ["Indicators", "Dashboards", "Reporting"], progress: 0 }
  ]}
];

// Helper function
window.findBookBySlug = (slug) => 
  window.T4H_BOOKS.find(b => b.slug === slug);