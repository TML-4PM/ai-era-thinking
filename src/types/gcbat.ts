export interface GCBATCharacter {
  id: string;
  name: string;
  slug: string;
  role: string;
  background?: string;
  character_arc?: string;
  appearance?: string;
  voice_style?: string;
  relationships?: Record<string, string>;
  gcbat_unit_alignment?: string;
  portrait_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GCBATCharacterAppearance {
  id: string;
  story_chapter_id: string;
  character_id: string;
  appearance_type: 'protagonist' | 'supporting' | 'cameo';
  narrative_role?: string;
  created_at?: string;
  character?: GCBATCharacter;
}

export interface GCBATStoryArc {
  number: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  storyCount: number;
  chapterRange: [number, number];
}

export const GCBAT_ARCS: GCBATStoryArc[] = [
  {
    number: 1,
    name: "Infrastructure Collapse",
    description: "Neural networks fail, revealing our cognitive dependencies on BCI systems",
    storyCount: 7,
    chapterRange: [11, 17]
  },
  {
    number: 2,
    name: "Cognitive & Social Disruption",
    description: "Brain-Computer Interfaces reshape how we think, connect, and form relationships",
    storyCount: 6,
    chapterRange: [18, 24]
  },
  {
    number: 3,
    name: "Rights & Agency Erosion",
    description: "Cognitive privacy, neural consent, and mental autonomy under siege",
    storyCount: 6,
    chapterRange: [25, 31]
  },
  {
    number: 4,
    name: "Environmental & Physical Systems",
    description: "Neural implants' impact on our bodies, brains, and biological integrity",
    storyCount: 6,
    chapterRange: [32, 38]
  },
  {
    number: 5,
    name: "Governance Crisis & Resolution",
    description: "Who controls the human mind? Building BCI governance that protects humanity",
    storyCount: 7,
    chapterRange: [39, 46]
  }
];
