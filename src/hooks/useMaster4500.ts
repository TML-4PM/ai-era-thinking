import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Master4500Record {
  id: string;
  book_slug: string;
  section_slug: string;
  exemplar_type: string;
  title: string;
  status: 'scaffold' | 'seeded' | 'complete';
  progress: number;
  description?: string;
  core_framework?: string;
  original_insight?: string;
  ai_era_shift?: string;
  ai_relevance?: string;
  cross_era_evolution?: string;
  era_on_prem?: string;
  era_cloud_native?: string;
  era_gen_ai?: string;
  era_agentic_ai?: string;
  era_bci?: string;
  implementation_phase1?: string;
  implementation_phase2?: string;
  implementation_phase3?: string;
  author_original_insight?: string;
  author_ai_era_shift?: string;
  author_ai_relevance?: string;
  related_thinkers?: string[];
  related_frameworks?: string[];
  case_studies?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Get all records for "The Thinking Engine"
export function useMaster4500() {
  return useQuery({
    queryKey: ['master_4500'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_4500')
        .select('*')
        .eq('book_slug', 'thinking-engine')
        .order('section_slug', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      return data as Master4500Record[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get writing progress summary by section
export function useMaster4500Progress() {
  return useQuery({
    queryKey: ['master_4500_progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_4500')
        .select('section_slug, status, progress')
        .eq('book_slug', 'thinking-engine');

      if (error) throw error;

      // Calculate progress by section
      const sectionProgress: Record<string, {
        total: number;
        seeded: number;
        complete: number;
        avgProgress: number;
        status: 'scaffold' | 'seeded' | 'complete';
      }> = {};

      data.forEach(record => {
        if (!sectionProgress[record.section_slug]) {
          sectionProgress[record.section_slug] = {
            total: 0,
            seeded: 0,
            complete: 0,
            avgProgress: 0,
            status: 'scaffold'
          };
        }

        const section = sectionProgress[record.section_slug];
        section.total += 1;
        
        if (record.status === 'seeded') section.seeded += 1;
        if (record.status === 'complete') section.complete += 1;
        
        // Calculate average progress
        section.avgProgress = ((section.avgProgress * (section.total - 1)) + record.progress) / section.total;
        
        // Determine section status: complete if all complete, seeded if any seeded, scaffold otherwise
        if (section.complete === section.total) {
          section.status = 'complete';
        } else if (section.seeded > 0 || section.complete > 0) {
          section.status = 'seeded';
        }
      });

      return sectionProgress;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get records for a specific section
export function useMaster4500Section(sectionSlug: string) {
  return useQuery({
    queryKey: ['master_4500_section', sectionSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_4500')
        .select('*')
        .eq('book_slug', 'thinking-engine')
        .eq('section_slug', sectionSlug)
        .order('title', { ascending: true });

      if (error) throw error;
      return data as Master4500Record[];
    },
    enabled: !!sectionSlug,
    staleTime: 5 * 60 * 1000,
  });
}

// Get overall book progress
export function useMaster4500BookProgress() {
  return useQuery({
    queryKey: ['master_4500_book_progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_4500')
        .select('status, progress')
        .eq('book_slug', 'thinking-engine');

      if (error) throw error;

      const total = data.length;
      const seeded = data.filter(r => r.status === 'seeded').length;
      const complete = data.filter(r => r.status === 'complete').length;
      const scaffold = total - seeded - complete;
      
      const avgProgress = total > 0 
        ? data.reduce((sum, r) => sum + r.progress, 0) / total 
        : 0;

      return {
        total,
        seeded,
        complete,
        scaffold,
        avgProgress: Math.round(avgProgress),
        percentComplete: total > 0 ? Math.round((complete / total) * 100) : 0,
        percentSeeded: total > 0 ? Math.round(((seeded + complete) / total) * 100) : 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}