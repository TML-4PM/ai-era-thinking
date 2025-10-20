import { BookTemplate } from "@/types/book-templates";

export const DEFAULT_TEMPLATES: BookTemplate[] = [
  {
    id: 'public-health-research',
    name: 'Public Health Research',
    description: 'Comprehensive research atlas for public health topics with data visualization and case studies',
    icon: 'Activity',
    template_config: {
      structure: 'research-atlas',
      features: ['data-visualization', 'case-studies', 'policy-tools', 'resource-library']
    },
    tab_config: [
      { path: '', label: 'Overview', icon: 'Home' },
      { path: 'chapters', label: 'Atlas Sections', icon: 'BookOpen' },
      { path: 'data', label: 'Data & Indicators', icon: 'BarChart' },
      { path: 'case-studies', label: 'Case Studies', icon: 'FileText' },
      { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
    ],
    default_chapters: [
      { title: 'Introduction: Research Framework', sections: ['Context', 'Methodology', 'Scope'], order: 1 },
      { title: 'Data & Indicators', sections: ['Metrics', 'Data Sources', 'Visualization'], order: 2 },
      { title: 'Risk Factors & Vulnerabilities', sections: ['Individual', 'Community', 'Systemic'], order: 3 },
      { title: 'Protective Factors & Strengths', sections: ['Personal', 'Social', 'Structural'], order: 4 },
      { title: 'Intervention Strategies', sections: ['Prevention', 'Treatment', 'Recovery'], order: 5 },
      { title: 'Case Studies', sections: ['Regional', 'National', 'International'], order: 6 },
      { title: 'Policy Recommendations', sections: ['Evidence', 'Implementation', 'Monitoring'], order: 7 },
      { title: 'Resource Library', sections: ['Tools', 'Research', 'Organizations'], order: 8 }
    ],
    collection: 'Research Volumes',
    suggested_series: 'Public Health Research',
    features: ['Data visualization', 'Case studies', 'Policy tools', 'Resource library'],
    best_for: ['Public health researchers', 'Policy makers', 'Healthcare professionals', 'Research institutions'],
    example_books: ['Drug Resilience Atlas'],
    is_active: true,
    is_featured: true,
    usage_count: 0
  },
  {
    id: 'narrative-fiction',
    name: 'Narrative Fiction',
    description: 'Character-driven stories with story arcs, character profiles, and vignettes',
    icon: 'Users',
    template_config: {
      structure: 'narrative',
      features: ['character-profiles', 'story-arcs', 'vignettes', 'character-matrix']
    },
    tab_config: [
      { path: '', label: 'Overview', icon: 'Home' },
      { path: 'chapters', label: 'Story Arcs', icon: 'BookOpen' },
      { path: 'characters', label: 'Characters', icon: 'Users' },
      { path: 'matrix', label: 'Story Matrix', icon: 'Grid' }
    ],
    default_chapters: [
      { title: 'Setting the Stage', sections: ['World Building', 'Context', 'Themes'], order: 1 },
      { title: 'Character Introductions', sections: ['Protagonists', 'Supporting Cast', 'Antagonists'], order: 2 },
      { title: 'Rising Action', sections: ['Conflicts', 'Challenges', 'Development'], order: 3 },
      { title: 'Climax', sections: ['Turning Point', 'Revelations', 'Confrontations'], order: 4 },
      { title: 'Resolution', sections: ['Outcomes', 'Growth', 'Closure'], order: 5 }
    ],
    collection: 'Fiction',
    features: ['Character development', 'Story arcs', 'Vignettes', 'Character interactions'],
    best_for: ['Fiction writers', 'Storytellers', 'Creative writers', 'Narrative designers'],
    example_books: ['GCBAT Vignettes'],
    is_active: true,
    is_featured: true,
    usage_count: 0
  },
  {
    id: 'framework-methodology',
    name: 'Framework & Methodology',
    description: 'Structured framework with exemplars, thinkers, and systematic approaches',
    icon: 'GitBranch',
    template_config: {
      structure: 'framework',
      features: ['exemplars', 'thinkers', 'frameworks', 'master-browser']
    },
    tab_config: [
      { path: '', label: 'Overview', icon: 'Home' },
      { path: 'chapters', label: 'Framework', icon: 'BookOpen' },
      { path: 'exemplars', label: 'Exemplars', icon: 'Star' },
      { path: 'thinkers', label: 'Thinkers', icon: 'Brain' },
      { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
    ],
    default_chapters: [
      { title: 'Introduction to Framework', sections: ['Overview', 'Purpose', 'Methodology'], order: 1 },
      { title: 'Core Concepts', sections: ['Foundations', 'Principles', 'Models'], order: 2 },
      { title: 'Implementation Guide', sections: ['Phase 1', 'Phase 2', 'Phase 3'], order: 3 },
      { title: 'Exemplars & Case Studies', sections: ['Theory', 'Practice', 'Results'], order: 4 },
      { title: 'Advanced Applications', sections: ['Extensions', 'Integrations', 'Future Directions'], order: 5 }
    ],
    collection: 'Frameworks',
    features: ['Structured approach', 'Exemplar library', 'Thinker profiles', 'Implementation guides'],
    best_for: ['Consultants', 'Educators', 'Researchers', 'Framework developers'],
    example_books: ['The Thinking Engine'],
    is_active: true,
    is_featured: true,
    usage_count: 0
  },
  {
    id: 'research-volume',
    name: 'Academic Research',
    description: 'Academic research with literature review, methodology, and findings',
    icon: 'GraduationCap',
    template_config: {
      structure: 'academic',
      features: ['literature-review', 'methodology', 'findings', 'leaders-live']
    },
    tab_config: [
      { path: '', label: 'Overview', icon: 'Home' },
      { path: 'chapters', label: 'Research', icon: 'BookOpen' },
      { path: 'leaders', label: 'Leaders Live', icon: 'Video' },
      { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
    ],
    default_chapters: [
      { title: 'Literature Review', sections: ['Background', 'Previous Research', 'Gaps'], order: 1 },
      { title: 'Research Methodology', sections: ['Approach', 'Methods', 'Data Collection'], order: 2 },
      { title: 'Findings & Analysis', sections: ['Results', 'Analysis', 'Discussion'], order: 3 },
      { title: 'Conclusions', sections: ['Summary', 'Implications', 'Future Research'], order: 4 }
    ],
    collection: 'Research Volumes',
    features: ['Academic structure', 'Literature review', 'Methodology section', 'Leaders Live integration'],
    best_for: ['Academics', 'Researchers', 'PhD candidates', 'Research institutions'],
    example_books: ['Tech for Humanity'],
    is_active: true,
    is_featured: false,
    usage_count: 0
  },
  {
    id: 'standalone-book',
    name: 'Standalone Book',
    description: 'Self-contained book with executive team focus and alignment tools',
    icon: 'Book',
    template_config: {
      structure: 'standalone',
      features: ['executive-team', 'alignment-tools', 'add-guru', 'workfamily']
    },
    tab_config: [
      { path: '', label: 'Overview', icon: 'Home' },
      { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
      { path: 'team', label: 'Executive Team', icon: 'Users' },
      { path: 'tools', label: 'Alignment Tools', icon: 'Wrench' },
      { path: 'guru', label: 'Add a Guru', icon: 'UserPlus' }
    ],
    default_chapters: [
      { title: 'Introduction', sections: ['Context', 'Purpose', 'Overview'], order: 1 },
      { title: 'Core Concepts', sections: ['Foundations', 'Key Ideas', 'Framework'], order: 2 },
      { title: 'Practical Application', sections: ['Implementation', 'Examples', 'Best Practices'], order: 3 },
      { title: 'Conclusion', sections: ['Summary', 'Next Steps', 'Resources'], order: 4 }
    ],
    collection: 'Standalone',
    features: ['Executive team chat', 'Alignment tools', 'Add a Guru', 'WorkFamily integration'],
    best_for: ['Business leaders', 'Executives', 'Organizations', 'Team leads'],
    example_books: ['WorkFamilyAI'],
    is_active: true,
    is_featured: false,
    usage_count: 0
  },
  {
    id: 'blank-canvas',
    name: 'Blank Canvas',
    description: 'Start from scratch with complete freedom to design your book structure',
    icon: 'Palette',
    template_config: {
      structure: 'custom',
      features: ['fully-customizable', 'flexible-tabs', 'custom-chapters']
    },
    tab_config: [
      { path: '', label: 'Overview', icon: 'Home' },
      { path: 'chapters', label: 'Chapters', icon: 'BookOpen' }
    ],
    default_chapters: [
      { title: 'Chapter 1', sections: ['Section 1'], order: 1 }
    ],
    collection: 'Custom',
    features: ['Complete customization', 'No constraints', 'Define your own structure', 'Add unlimited tabs'],
    best_for: ['Experienced authors', 'Unique projects', 'Experimental formats', 'Custom needs'],
    example_books: [],
    is_active: true,
    is_featured: false,
    usage_count: 0
  }
];
