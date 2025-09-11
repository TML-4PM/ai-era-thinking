export interface EraMapping {
  onPrem: string;
  cloudNative: string;
  genAI: string;
  agenticAI: string;
  bci: string;
}

export interface Exemplar {
  name: string;
  type: string;
  eraMapping: EraMapping;
  caseStudies: string[];
  relatedThinkers: string[];
  relatedFrameworks: string[];
  progress?: number; // 0-100
  status?: 'scaffold' | 'seeded' | 'complete';
  notes?: string;
}

export interface Cluster {
  id: string;
  title: string;
  description: string;
  exemplars: Exemplar[];
}

export interface UserContribution {
  id: string;
  author: string;
  submission: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  submission_type: 'general' | 'exemplar' | 'case_study' | 'framework' | 'thinker';
  created_at: string;
}

export interface Section {
  id: string;
  title: string;
  slug?: string;
  status: 'seeded' | 'scaffold';
  lead: string;
  exemplarCount?: number;
  contentFile?: string;
}

export interface ContentModel {
  id?: string;
  title: string;
  description: string;
  clusters?: Cluster[];
  sections?: Section[]; // Hub content uses "sections" instead of "clusters"
  volumes?: Volume[]; // Tech for Humanity hub uses "volumes"
  userContributions?: UserContribution[];
  references?: string[];
}

export interface Volume {
  id: string;
  title: string;
  slug?: string;
  status: 'seeded' | 'scaffold';
  lead: string;
  exemplarCount?: number;
}