
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting 729-member seeding process...');

    // Fetch the 9 neural ennead families
    const { data: families, error: familiesError } = await supabaseClient
      .from('neural_ennead_families')
      .select('*')
      .order('family_code');

    if (familiesError) {
      throw new Error(`Failed to fetch families: ${familiesError.message}`);
    }

    if (!families || families.length !== 9) {
      throw new Error(`Expected 9 families, got ${families?.length || 0}`);
    }

    console.log(`Found ${families.length} families, generating 729 members...`);

    // Generate all 9×9×9 combinations
    const members = [];
    let memberCount = 0;

    for (const primary of families) {
      for (const secondary of families) {
        for (const tertiary of families) {
          const memberCode = `${primary.family_code}-${secondary.family_code}-${tertiary.family_code}`;
          const displayName = `${primary.family_name} / ${secondary.family_name} / ${tertiary.family_name}`;
          const shortLabel = `${primary.family_code.substring(0, 3)}/${secondary.family_code.substring(0, 3)}/${tertiary.family_code.substring(0, 3)}`;
          
          // Merge keywords with primary having highest weight
          const canonicalKeywords = [
            ...(primary.canonical_keywords || []),
            ...(secondary.canonical_keywords || []),
            ...(tertiary.canonical_keywords || [])
          ].filter((keyword, index, array) => array.indexOf(keyword) === index); // Remove duplicates

          // Merge exemplar roles
          const exemplarRoles = [
            ...(primary.exemplar_roles || []),
            ...(secondary.exemplar_roles || []),
            ...(tertiary.exemplar_roles || [])
          ].filter((role, index, array) => array.indexOf(role) === index);

          // Generate description
          const description = `A hybrid work family combining ${primary.family_name} (strategic direction), ${secondary.family_name} (operational support), and ${tertiary.family_name} (specialized capabilities). This member excels at ${primary.description.split('.')[0].toLowerCase()}, while leveraging ${secondary.family_name.toLowerCase()} strengths and ${tertiary.family_name.toLowerCase()} expertise.`;

          members.push({
            member_code: memberCode,
            primary_family_code: primary.family_code,
            secondary_family_code: secondary.family_code,
            tertiary_family_code: tertiary.family_code,
            display_name: displayName,
            short_label: shortLabel,
            description: description,
            canonical_keywords: canonicalKeywords,
            exemplar_roles: exemplarRoles
          });

          memberCount++;
        }
      }
    }

    console.log(`Generated ${memberCount} member combinations, inserting into database...`);

    // Insert in batches to avoid timeout
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      
      const { error: insertError } = await supabaseClient
        .from('neural_ennead_members')
        .upsert(batch, { 
          onConflict: 'member_code',
          ignoreDuplicates: false 
        });

      if (insertError) {
        console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, insertError);
        errorCount++;
      } else {
        insertedCount += batch.length;
        console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(members.length/batchSize)}`);
      }
    }

    console.log(`Seeding completed. Inserted: ${insertedCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully seeded ${insertedCount} Neural Ennead members (729 total combinations)`,
        total_members: insertedCount,
        error_count: errorCount,
        batch_size: batchSize
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in seed-neural-ennead-members function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
