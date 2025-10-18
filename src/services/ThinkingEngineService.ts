/**
 * Service for The Thinking Engine book data management
 * Handles queries and transformations for master_4500 exemplars
 */

import { supabase } from '@/integrations/supabase/client';
import { ALL_ERAS, type EraName } from '@/lib/era-mapping-utils';

export interface ThinkingEngineExemplar {
  id: string;
  book_slug: string;
  section_slug: string;
  exemplar_type: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  core_framework: string;
  original_insight: string;
  ai_relevance: string;
  ai_era_shift: string;
  era_on_prem: string;
  era_cloud_native: string;
  era_gen_ai: string;
  era_agentic_ai: string;
  era_bci: string;
  cross_era_evolution: string;
  implementation_phase1: string;
  implementation_phase2: string;
  implementation_phase3: string;
  related_thinkers: string[];
  related_frameworks: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all exemplars for a specific chapter/section
 */
export async function getChapterExemplars(sectionSlug: string) {
  const { data, error } = await supabase
    .from('master_4500')
    .select('*')
    .eq('book_slug', 'thinking-engine')
    .eq('section_slug', sectionSlug)
    .order('title');

  if (error) {
    console.error('Error fetching chapter exemplars:', error);
    throw error;
  }

  return data as ThinkingEngineExemplar[];
}

/**
 * Get exemplars relevant to a specific era
 */
export async function getEraExemplars(eraName: EraName) {
  const { data, error } = await supabase
    .from('master_4500')
    .select('*')
    .eq('book_slug', 'thinking-engine')
    .order('title');

  if (error) {
    console.error('Error fetching era exemplars:', error);
    throw error;
  }

  // Filter in JS to avoid complex type issues
  const fieldName = `era_${eraName}`;
  const filtered = (data || []).filter(item => {
    const value = (item as any)[fieldName];
    return value && String(value).trim() !== '';
  });

  return filtered as ThinkingEngineExemplar[];
}

/**
 * Search exemplars by text query
 */
export async function searchExemplars(query: string) {
  const { data, error } = await supabase
    .from('master_4500')
    .select('*')
    .eq('book_slug', 'thinking-engine')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,notes.ilike.%${query}%`)
    .order('title');

  if (error) {
    console.error('Error searching exemplars:', error);
    throw error;
  }

  return data as ThinkingEngineExemplar[];
}

/**
 * Get all exemplars for The Thinking Engine
 */
export async function getAllExemplars() {
  const { data, error } = await supabase
    .from('master_4500')
    .select('*')
    .eq('book_slug', 'thinking-engine')
    .order('section_slug', { ascending: true })
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching all exemplars:', error);
    throw error;
  }

  return data as ThinkingEngineExemplar[];
}

/**
 * Get exemplars by status
 */
export async function getExemplarsByStatus(status: string) {
  const { data, error } = await supabase
    .from('master_4500')
    .select('*')
    .eq('book_slug', 'thinking-engine')
    .order('title');

  if (error) {
    console.error('Error fetching exemplars by status:', error);
    throw error;
  }

  // Filter by status in JS
  const filtered = (data || []).filter(e => e.status === status);
  return filtered as ThinkingEngineExemplar[];
}

/**
 * Get related content for an exemplar
 */
export async function getRelatedContent(exemplarId: string) {
  const { data: exemplar, error } = await supabase
    .from('master_4500')
    .select('related_thinkers, related_frameworks')
    .eq('id', exemplarId)
    .single();

  if (error) {
    console.error('Error fetching related content:', error);
    return { thinkers: [], frameworks: [] };
  }

  return {
    thinkers: exemplar?.related_thinkers || [],
    frameworks: exemplar?.related_frameworks || []
  };
}

/**
 * Get chapter statistics
 */
export async function getChapterStats(sectionSlug: string) {
  const exemplars = await getChapterExemplars(sectionSlug);
  
  const total = exemplars.length;
  const complete = exemplars.filter(e => e.status === 'complete').length;
  const seeded = exemplars.filter(e => e.status === 'seeded').length;
  const scaffold = exemplars.filter(e => e.status === 'scaffold').length;
  
  const avgProgress = exemplars.length > 0
    ? Math.round(exemplars.reduce((sum, e) => sum + (e.progress || 0), 0) / exemplars.length)
    : 0;

  // Calculate era coverage
  const eraCoverage: Record<string, number> = {};
  ALL_ERAS.forEach(era => {
    const fieldName = `era_${era}`;
    const withContent = exemplars.filter(e => {
      const value = (e as any)[fieldName];
      return value && String(value).trim() !== '';
    }).length;
    eraCoverage[era] = total > 0 ? Math.round((withContent / total) * 100) : 0;
  });

  return {
    total,
    complete,
    seeded,
    scaffold,
    avgProgress,
    eraCoverage
  };
}

/**
 * Get overall book statistics
 */
export async function getBookStats() {
  const exemplars = await getAllExemplars();
  
  const total = exemplars.length;
  const complete = exemplars.filter(e => e.status === 'complete').length;
  const seeded = exemplars.filter(e => e.status === 'seeded').length;
  const scaffold = exemplars.filter(e => e.status === 'scaffold').length;
  
  const avgProgress = exemplars.length > 0
    ? Math.round(exemplars.reduce((sum, e) => sum + (e.progress || 0), 0) / exemplars.length)
    : 0;

  // Count by section
  const bySection: Record<string, number> = {};
  exemplars.forEach(e => {
    bySection[e.section_slug] = (bySection[e.section_slug] || 0) + 1;
  });

  return {
    total,
    complete,
    seeded,
    scaffold,
    avgProgress,
    bySection
  };
}