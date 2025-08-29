
import { supabase } from "@/integrations/supabase/client";
import { EXPANDED_THINKERS, type ExpandedThinker } from "@/data/expanded-thinkers";
import { THINKERS, type Thinker } from "@/data/thinkers";
import { UserThinker } from "@/types/UserThinker";

export interface ThinkerProfile {
  id: string;
  thinker_name: string;
  area: string;
  core_idea: string;
  ai_shift: string;
  lobe: string;
  cross_era_relevance?: any;
  usage_prompts?: any;
  practical_applications?: any;
  related_thinkers?: string[];
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface ThinkerTeam {
  id: string;
  thinker_name: string;
  domain: string;
  team_size: number;
  industries: string[];
  overlap_cap: number;
  selection_strategy: string;
  model_used: string;
  constraints: any;
  created_at: string;
  updated_at: string;
}

export interface EnhancedThinker extends Thinker {
  hasDeepProfile: boolean;
  hasTeam: boolean;
  expandedData?: ExpandedThinker;
  profileData?: ThinkerProfile;
  teamData?: ThinkerTeam;
  isUserCreated?: boolean;
  userThinkerData?: UserThinker;
}

export class ThinkerService {
  
  /**
   * Get all thinkers with their enhancement status (including user-created)
   */
  async getAllEnhancedThinkers(): Promise<EnhancedThinker[]> {
    // Get all profiles and teams in parallel
    const [profilesResult, teamsResult] = await Promise.all([
      supabase.from('thinker_profiles').select('*'),
      supabase.from('thinker_alignment_teams').select('*')
    ]);

    const profiles = profilesResult.data || [];
    const teams = teamsResult.data || [];

    // Create lookup maps
    const profileMap = new Map(profiles.map(p => [p.thinker_name, p]));
    const teamMap = new Map(teams.map(t => [t.thinker_name, t]));

    // Enhance each built-in thinker
    const enhancedBuiltInThinkers = THINKERS.map(thinker => {
      const expandedData = EXPANDED_THINKERS.find(et => et.name === thinker.name);
      const profileData = profileMap.get(thinker.name);
      const teamData = teamMap.get(thinker.name);

      return {
        ...thinker,
        hasDeepProfile: !!profileData || !!expandedData,
        hasTeam: !!teamData || !!expandedData?.hardCodedTeam,
        expandedData,
        profileData,
        teamData,
        isUserCreated: false
      };
    });

    return enhancedBuiltInThinkers;
  }

  /**
   * Get a specific enhanced thinker by name (built-in or user-created)
   */
  async getEnhancedThinker(nameOrId: string, isUserCreated = false): Promise<EnhancedThinker | null> {
    if (isUserCreated) {
      // Handle user-created thinker
      const { data: userThinker } = await supabase
        .from('user_thinkers')
        .select('*')
        .eq('id', nameOrId)
        .single();

      if (!userThinker) return null;

      // Convert UserThinker to EnhancedThinker format
      return {
        name: userThinker.name,
        area: userThinker.area,
        coreIdea: userThinker.core_idea,
        aiShift: userThinker.ai_shift,
        lobe: userThinker.lobe as any,
        hasDeepProfile: true, // User thinkers always have deep profiles
        hasTeam: false, // Teams not supported for user thinkers yet
        isUserCreated: true,
        userThinkerData: userThinker
      };
    }

    // Handle built-in thinker
    const baseThinker = THINKERS.find(t => t.name === nameOrId);
    if (!baseThinker) return null;

    const [profileResult, teamResult] = await Promise.all([
      supabase.from('thinker_profiles').select('*').eq('thinker_name', nameOrId).maybeSingle(),
      supabase.from('thinker_alignment_teams').select('*').eq('thinker_name', nameOrId).maybeSingle()
    ]);

    const expandedData = EXPANDED_THINKERS.find(et => et.name === nameOrId);
    const profileData = profileResult.data;
    const teamData = teamResult.data;

    return {
      ...baseThinker,
      hasDeepProfile: !!profileData || !!expandedData,
      hasTeam: !!teamData || !!expandedData?.hardCodedTeam,
      expandedData,
      profileData,
      teamData,
      isUserCreated: false
    };
  }

  /**
   * Trigger profile generation for a thinker
   */
  async generateProfile(thinkerName: string, industries?: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const thinker = THINKERS.find(t => t.name === thinkerName);
      if (!thinker) {
        return { success: false, error: 'Thinker not found' };
      }

      const { data, error } = await supabase.functions.invoke('build-thinker-profile', {
        body: {
          thinker_name: thinker.name,
          thinker_area: thinker.area,
          core_idea: thinker.coreIdea,
          ai_shift: thinker.aiShift,
          lobe: thinker.lobe,
          industries: industries || []
        }
      });

      if (error) {
        console.error('Profile generation error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Profile generation failed:', err);
      return { success: false, error: 'Profile generation failed' };
    }
  }

  /**
   * Trigger team generation for a thinker
   */
  async generateTeam(thinkerName: string, industries?: string[], teamSize?: number): Promise<{ success: boolean; error?: string }> {
    try {
      const thinker = THINKERS.find(t => t.name === thinkerName);
      if (!thinker) {
        return { success: false, error: 'Thinker not found' };
      }

      const { data, error } = await supabase.functions.invoke('build-thinker-team', {
        body: {
          thinker_name: thinker.name,
          thinker_area: thinker.area,
          core_idea: thinker.coreIdea,
          ai_shift: thinker.aiShift,
          lobe: thinker.lobe,
          domain: thinker.area,
          industries: industries || [],
          team_size: teamSize || 7
        }
      });

      if (error) {
        console.error('Team generation error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Team generation failed:', err);
      return { success: false, error: 'Team generation failed' };
    }
  }

  /**
   * Get coverage statistics
   */
  async getCoverageStats(): Promise<{
    total: number;
    withProfiles: number;
    withTeams: number;
    withBoth: number;
    coverage: number;
  }> {
    const enhanced = await this.getAllEnhancedThinkers();
    const total = enhanced.length;
    const withProfiles = enhanced.filter(t => t.hasDeepProfile).length;
    const withTeams = enhanced.filter(t => t.hasTeam).length;
    const withBoth = enhanced.filter(t => t.hasDeepProfile && t.hasTeam).length;
    const coverage = (withBoth / total) * 100;

    return {
      total,
      withProfiles,
      withTeams,
      withBoth,
      coverage
    };
  }
}

export const thinkerService = new ThinkerService();
