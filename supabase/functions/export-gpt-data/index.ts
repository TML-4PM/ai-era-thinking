import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const exportType = url.searchParams.get('type') || 'master_4500';

    console.log(`Exporting ${exportType} data for GPT import`);

    if (exportType === 'master_4500') {
      // Export master 4500 records
      const { data, error } = await supabaseClient
        .from('4500 Master')
        .select('*')
        .not('title', 'is', null)
        .order('title');

      if (error) throw error;

      // Transform data to GPT format
      const transformedData = data.map((record: any) => {
        // Build era_mapping array from era columns
        const era_mapping = [];
        if (record.era_on_prem) era_mapping.push('on-prem');
        if (record.era_cloud_native) era_mapping.push('cloud-native');
        if (record.era_gen_ai) era_mapping.push('gen-ai');
        if (record.era_agentic_ai) era_mapping.push('agentic-ai');
        if (record.era_bci) era_mapping.push('bci');

        return {
          id: record.id,
          name: record.title,
          exemplar_type: record.exemplar_type || 'unknown',
          book_slug: record.book_slug || 'thinking-engine',
          section_slug: record.section_slug || 'general',
          summary: record.description || record.title,
          lobe: null, // Would need additional mapping
          tags: [], // Would need to extract from content
          related_thinkers: record.related_thinkers || [],
          related_frameworks: record.related_frameworks || [],
          era_mapping: era_mapping,
          core_framework: record.core_framework,
          original_insight: record.original_insight || record.author_original_insight,
          ai_relevance: record.ai_relevance || record.author_ai_relevance,
          ai_era_shift: record.ai_era_shift || record.author_ai_era_shift,
          cross_era_evolution: record.cross_era_evolution,
          status: record.status,
          progress: record.progress
        };
      });

      const output = {
        name: "Master 4500 Records - Phase 2 Export",
        version: "1.0",
        description: `Complete export of ${transformedData.length} exemplar records from The Thinking Engine knowledge base`,
        export_date: new Date().toISOString(),
        estimated_tokens: transformedData.length * 70,
        record_count: transformedData.length,
        exemplar_types: {
          thinker: transformedData.filter(r => r.exemplar_type === 'thinker').length,
          framework: transformedData.filter(r => r.exemplar_type === 'framework').length,
          technology: transformedData.filter(r => r.exemplar_type === 'technology').length,
          principle: transformedData.filter(r => r.exemplar_type === 'principle').length,
          organization: transformedData.filter(r => r.exemplar_type === 'organization').length,
          other: transformedData.filter(r => !['thinker', 'framework', 'technology', 'principle', 'organization'].includes(r.exemplar_type)).length
        },
        records: transformedData
      };

      return new Response(JSON.stringify(output, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (exportType === 'statistics') {
      // Get statistics about the data
      const { data: masterData, error: masterError } = await supabaseClient
        .from('4500 Master')
        .select('exemplar_type, book_slug, section_slug')
        .not('title', 'is', null);

      if (masterError) throw masterError;

      const stats = {
        total_records: masterData.length,
        by_type: {},
        by_book: {},
        by_section: {}
      };

      masterData.forEach((record: any) => {
        // Count by type
        const type = record.exemplar_type || 'unknown';
        stats.by_type[type] = (stats.by_type[type] || 0) + 1;

        // Count by book
        const book = record.book_slug || 'unknown';
        stats.by_book[book] = (stats.by_book[book] || 0) + 1;

        // Count by section
        const section = record.section_slug || 'unknown';
        stats.by_section[section] = (stats.by_section[section] || 0) + 1;
      });

      return new Response(JSON.stringify({
        name: "Export Statistics",
        export_date: new Date().toISOString(),
        statistics: stats
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Unknown export type. Use ?type=master_4500 or ?type=statistics' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
