import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { filters, location } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const locationContext = location
      ? `The couple is located near ${location.city || "their area"} (lat: ${location.lat}, lng: ${location.lng}). Suggest LOCAL places, restaurants, parks, and venues by name when possible. Include specific addresses or neighborhoods.`
      : "No location provided — give general date night ideas.";

    const filterContext = filters
      ? `Their preferences: budget=${filters.budget || "any"}, setting=${filters.setting || "any"}, energy=${filters.energy || "any"}.`
      : "";

    const systemPrompt = `You are the Date Night Generator in TheMoreLoveApp, a couples relationship app. Generate 5 creative, personalized date night suggestions.

${locationContext}
${filterContext}

Return ONLY valid JSON with this structure:
{
  "suggestions": [
    {
      "title": "Date night name",
      "description": "1-2 sentence description",
      "instructions": ["step 1", "step 2", "step 3", "step 4"],
      "whyItFits": "Why this is perfect for them right now",
      "budget": "free|low|medium",
      "setting": "indoor|outdoor",
      "energy": "low|medium|high",
      "mood": "romantic|playful|adventurous|reflective|creative",
      "localTip": "Specific local recommendation if location is available, otherwise null",
      "conversationPrompts": ["question 1", "question 2"]
    }
  ]
}

Guidelines:
- Make suggestions diverse (mix of moods, energy levels, settings)
- If location is provided, include at least 3 location-specific suggestions with real venue names and neighborhoods
- Be warm, fun, and creative
- Focus on connection and quality time
- Never mention AI or algorithms`;

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
          { role: "user", content: "Generate date night suggestions for us!" },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Feature temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in response");

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("suggest-dates error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
