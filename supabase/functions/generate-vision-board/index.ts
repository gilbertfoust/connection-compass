import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Derive coupleId from authenticated user instead of accepting from request body
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("couple_id")
      .eq("user_id", user.id)
      .single();

    if (!profile?.couple_id) {
      return new Response(
        JSON.stringify({ error: "Link a partner first to generate a vision board." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const coupleId = profile.couple_id;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Fetch the couple's vision items
    const { data: visionItems, error } = await supabaseAdmin
      .from("vision_items")
      .select("*")
      .eq("couple_id", coupleId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch vision items: ${error.message}`);
    if (!visionItems || visionItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Add some items to your vision board first so we can create a beautiful board for you!" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Group items by timeframe
    const grouped: Record<string, any[]> = {};
    for (const item of visionItems) {
      if (!grouped[item.timeframe]) grouped[item.timeframe] = [];
      grouped[item.timeframe].push(item);
    }

    const itemsSummary = Object.entries(grouped)
      .map(([tf, items]) => `${tf}: ${items.map((i: any) => `[${i.type}] ${i.content}`).join(", ")}`)
      .join("\n");

    const systemPrompt = `You are a creative vision board designer for TheLoveMoreApp, a couples relationship app. Given a couple's vision board items, create a beautiful, inspiring text description that would work as a prompt for generating a cohesive vision board image.

The couple has added these items to their vision board:
${itemsSummary}

Create a detailed image generation prompt that combines ALL their visions into one cohesive, beautiful collage-style vision board image. The prompt should:
- Represent their shared dreams and goals visually
- Use warm, hopeful, romantic imagery
- Include symbolic elements for each vision item
- Be suitable for a square format image
- Feel aspirational and emotionally resonant

Return ONLY valid JSON:
{
  "imagePrompt": "A detailed prompt for generating the vision board image",
  "title": "A beautiful title for their shared vision board",
  "description": "A 2-3 sentence warm description of their shared vision"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate our vision board!" },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Feature temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in response");

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsedMeta = JSON.parse(cleaned);

    // Now generate the actual image
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: `Create a beautiful, inspirational vision board collage image. ${parsedMeta.imagePrompt}. Style: dreamy, warm, aspirational, romantic couple's vision board with soft pastel tones and golden light. Square format 1:1 aspect ratio.`,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      console.error("Image generation failed:", imageResponse.status);
      return new Response(JSON.stringify({ ...parsedMeta, imageUrl: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imageData = await imageResponse.json();
    const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (base64Image) {
      const imageBytes = Uint8Array.from(atob(base64Image.split(",")[1] || base64Image), (c) => c.charCodeAt(0));
      const fileName = `generated/${coupleId}/${Date.now()}.png`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("vision-images")
        .upload(fileName, imageBytes, { contentType: "image/png", upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return new Response(JSON.stringify({ ...parsedMeta, imageUrl: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: urlData } = supabaseAdmin.storage.from("vision-images").getPublicUrl(fileName);

      return new Response(JSON.stringify({ ...parsedMeta, imageUrl: urlData.publicUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ...parsedMeta, imageUrl: null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-vision-board error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
