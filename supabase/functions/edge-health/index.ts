import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to parse body if provided (not required)
    try {
      await req.json();
    } catch (_) {
      // ignore if no JSON body
    }

    const time = new Date().toISOString();
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || null;
    const projectRef = supabaseUrl ? supabaseUrl.replace("https://", "").split(".")[0] : null;
    const region = Deno.env.get("REGION") || Deno.env.get("FLY_REGION") || null;

    const payload = {
      ok: true,
      time,
      projectRef,
      region,
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in edge-health function:", error);
    return new Response(JSON.stringify({ ok: false, error: (error as Error).message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});