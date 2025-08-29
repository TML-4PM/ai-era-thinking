
export interface UserThinker {
  id: string;
  creator_id: string;
  name: string;
  area: string;
  lobe: string;
  core_idea: string;
  ai_shift: string;
  bio?: string;
  image_url?: string;
  visibility: 'public' | 'private' | 'unlisted';
  deep_profile?: {
    summary?: string;
    keyConcepts?: string[];
    whyItMatters?: string;
    aiImplications?: string[];
    recommendedPractices?: string[];
    commonPitfalls?: string[];
    successMetrics?: string[];
  };
  usage_prompts?: string[];
  practical_applications?: string[];
  related_thinkers?: string[];
  cross_era_relevance?: {
    ai_relevance?: string;
    cross_era_relevance?: string;
    implementation_timeline?: {
      phase_1?: string;
      phase_2?: string;
      phase_3?: string;
    };
  };
  metadata?: any;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  thinker_name?: string; // for built-in thinkers
  user_thinker_id?: string; // for user-created thinkers
  created_at: string;
}
