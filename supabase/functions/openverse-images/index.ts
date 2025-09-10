import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OpenverseImage {
  id: string;
  title: string;
  creator: string;
  creator_url: string;
  license: string;
  license_url: string;
  license_version: string;
  attribution: string;
  url: string;
  thumbnail: string;
  tags: { name: string }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Check if user is authenticated
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, query, imageUrl } = await req.json();

    if (action === 'search') {
      console.log('Searching Openverse for:', query);
      
      // Search Openverse API
      const searchUrl = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license=cc0,pdm,by,by-sa&page_size=20`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Tech4Humanity-BookCovers/1.0 (https://tech4humanity.org)',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded - please wait a moment and try again');
        } else if (response.status >= 500) {
          throw new Error('Openverse API is temporarily unavailable');
        }
        throw new Error(`Openverse API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Openverse search results:', data.results?.length || 0);

      // Filter and format results
      const images = data.results?.map((img: any) => ({
        id: img.id,
        title: img.title || 'Untitled',
        creator: img.creator || 'Unknown',
        creator_url: img.creator_url,
        license: img.license,
        license_url: img.license_url,
        license_version: img.license_version,
        attribution: img.attribution || `"${img.title}" by ${img.creator} is licensed under ${img.license}`,
        url: img.url,
        thumbnail: img.thumbnail,
        tags: img.tags || [],
      })) || [];

      return new Response(JSON.stringify({ images }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'download') {
      console.log('Downloading and storing image:', imageUrl);

      // Download the image with timeout and better error handling
      const imageResponse = await fetch(imageUrl, {
        signal: AbortSignal.timeout(30000), // 30 second timeout for downloads
        headers: {
          'User-Agent': 'Tech4Humanity-BookCovers/1.0 (https://tech4humanity.org)',
        },
      });
      
      if (!imageResponse.ok) {
        if (imageResponse.status === 404) {
          throw new Error('Image not found - it may have been removed from the source');
        } else if (imageResponse.status === 403) {
          throw new Error('Access denied - image may have restricted permissions');
        }
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }

      // Check content type
      const contentType = imageResponse.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        throw new Error('Downloaded file is not a valid image');
      }

      const imageBlob = await imageResponse.blob();
      const imageBuffer = await imageBlob.arrayBuffer();
      
      // Generate filename
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      let filename = pathParts[pathParts.length - 1] || 'image';
      
      // Ensure we have a file extension
      if (!filename.includes('.')) {
        const contentType = imageResponse.headers.get('content-type');
        if (contentType?.includes('jpeg')) filename += '.jpg';
        else if (contentType?.includes('png')) filename += '.png';
        else if (contentType?.includes('webp')) filename += '.webp';
        else filename += '.jpg'; // default
      }

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${filename}`;
      const storagePath = `covers/${uniqueFilename}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('book-covers')
        .upload(storagePath, new Uint8Array(imageBuffer), {
          contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabaseClient.storage
        .from('book-covers')
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl;
      console.log('Image uploaded successfully:', publicUrl);

      // Store metadata in database
      const { query: bookQuery, ...imageMetadata } = await req.json();
      
      const { data: assetData, error: assetError } = await supabaseClient
        .from('media_assets')
        .insert({
          filename: uniqueFilename,
          original_url: imageUrl,
          storage_path: storagePath,
          source_api: 'openverse',
          title: imageMetadata.title || 'Untitled',
          creator: imageMetadata.creator || 'Unknown',
          license: imageMetadata.license || 'Unknown',
          license_url: imageMetadata.license_url || '',
          attribution: imageMetadata.attribution || `Image from ${imageUrl}`,
          tags: imageMetadata.tags?.map((t: any) => t.name || t) || [],
          metadata: {
            original_size: imageBuffer.byteLength,
            content_type: imageResponse.headers.get('content-type'),
            downloaded_at: new Date().toISOString(),
          },
        })
        .select()
        .single();

      if (assetError) {
        console.error('Database insert error:', assetError);
        // Don't fail the whole operation, just log the error
      }

      return new Response(JSON.stringify({ 
        success: true, 
        publicUrl,
        storagePath,
        filename: uniqueFilename,
        asset: assetData,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in openverse-images function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Network error - please check your connection and try again';
      statusCode = 503;
    } else if (error.message.includes('Openverse API error')) {
      errorMessage = 'Image search service is temporarily unavailable';
      statusCode = 503;
    } else if (error.message.includes('Failed to download image')) {
      errorMessage = 'Could not download the selected image - it may no longer be available';
      statusCode = 404;
    } else if (error.message.includes('Failed to upload image')) {
      errorMessage = 'Could not save the image to storage - please try again';
      statusCode = 500;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});