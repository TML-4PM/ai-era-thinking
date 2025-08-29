
import { supabase } from "@/integrations/supabase/client";
import { UserThinker, UserFavorite } from "@/types/UserThinker";

export class UserThinkerService {
  
  /**
   * Create a new user thinker
   */
  async createThinker(thinkerData: Omit<UserThinker, 'id' | 'creator_id' | 'created_at' | 'updated_at'>): Promise<{ data: UserThinker | null; error: any }> {
    const { data, error } = await supabase
      .from('user_thinkers')
      .insert({
        ...thinkerData,
        creator_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    return { data, error };
  }

  /**
   * Get user's own thinkers
   */
  async getUserThinkers(): Promise<{ data: UserThinker[] | null; error: any }> {
    const { data, error } = await supabase
      .from('user_thinkers')
      .select('*')
      .eq('creator_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  /**
   * Get all public thinkers
   */
  async getPublicThinkers(): Promise<{ data: UserThinker[] | null; error: any }> {
    const { data, error } = await supabase
      .from('user_thinkers')
      .select('*')
      .eq('visibility', 'public')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  /**
   * Get a specific user thinker by ID
   */
  async getThinkerById(id: string): Promise<{ data: UserThinker | null; error: any }> {
    const { data, error } = await supabase
      .from('user_thinkers')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  /**
   * Update a user thinker
   */
  async updateThinker(id: string, updates: Partial<UserThinker>): Promise<{ data: UserThinker | null; error: any }> {
    const { data, error } = await supabase
      .from('user_thinkers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  /**
   * Delete a user thinker
   */
  async deleteThinker(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_thinkers')
      .delete()
      .eq('id', id);

    return { error };
  }

  /**
   * Add to favorites (built-in thinker by name)
   */
  async addBuiltInToFavorites(thinkerName: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        thinker_name: thinkerName
      });

    return { error };
  }

  /**
   * Add to favorites (user-created thinker by ID)
   */
  async addUserThinkerToFavorites(userThinkerId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        user_thinker_id: userThinkerId
      });

    return { error };
  }

  /**
   * Remove from favorites
   */
  async removeFromFavorites(favoriteId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('id', favoriteId);

    return { error };
  }

  /**
   * Get user's favorites
   */
  async getFavorites(): Promise<{ data: UserFavorite[] | null; error: any }> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        user_thinker:user_thinkers(*)
      `)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  /**
   * Check if thinker is favorited
   */
  async isFavorited(thinkerName?: string, userThinkerId?: string): Promise<boolean> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    let query = supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId);

    if (thinkerName) {
      query = query.eq('thinker_name', thinkerName);
    } else if (userThinkerId) {
      query = query.eq('user_thinker_id', userThinkerId);
    } else {
      return false;
    }

    const { data } = await query.maybeSingle();
    return !!data;
  }
}

export const userThinkerService = new UserThinkerService();
