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

export interface ContentModel {
  id: string;
  title: string;
  description: string;
  clusters: Cluster[];
  userContributions?: UserContribution[];
  references: string[];
}