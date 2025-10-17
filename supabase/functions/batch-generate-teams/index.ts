import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThinkerRequest {
  name: string;
  coreIdea: string;
  domain: string;
  industries?: string[];
  teamSize?: number;
}

interface BatchRequest {
  thinkers: ThinkerRequest[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { thinkers }: BatchRequest = await req.json();

    if (!thinkers || !Array.isArray(thinkers) || thinkers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: thinkers array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing batch of ${thinkers.length} thinkers`);
    const results = [];

    for (const thinker of thinkers) {
      try {
        console.log(`Generating team for: ${thinker.name}`);
        
        const { data, error } = await supabaseClient.functions.invoke('build-thinker-team', {
          body: {
            thinkerName: thinker.name,
            coreIdea: thinker.coreIdea,
            domain: thinker.domain,
            industries: thinker.industries || ['Public Sector', 'Technology', 'Healthcare'],
            teamSize: thinker.teamSize || 7
          }
        });

        if (error) {
          console.error(`Error generating team for ${thinker.name}:`, error);
          results.push({
            thinkerName: thinker.name,
            success: false,
            error: error.message
          });
        } else {
          results.push({
            thinkerName: thinker.name,
            success: true,
            teamId: data?.teamId,
            memberCount: data?.team?.length || 0
          });
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Exception for ${thinker.name}:`, err);
        results.push({
          thinkerName: thinker.name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Batch complete: ${successCount}/${thinkers.length} successful`);

    return new Response(
      JSON.stringify({
        totalProcessed: thinkers.length,
        successCount,
        failureCount: thinkers.length - successCount,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Batch generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
