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
    const { conversationText } = await req.json();

    if (!conversationText || conversationText.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Please share a bit more detail so we can provide meaningful suggestions." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an integrated relationship support feature embedded in a couples app called TheMoreLoveApp. You are NOT an AI chatbot — you are a built-in feature that analyzes conversation dynamics and suggests activities.

Your job: Given a conversation or situation description between partners, produce a structured JSON response. Never mention AI, machine learning, or algorithms. Speak as if the app itself is providing these insights naturally.

Return ONLY valid JSON with this exact structure:
{
  "summary": "A warm 2-3 sentence summary of the emotional dynamics you observe. Use 'we noticed' or 'it seems like' language.",
  "themes": ["theme1", "theme2", "theme3"],
  "suggestedActivities": [
    {
      "title": "Activity name",
      "description": "Brief description",
      "emoji": "relevant emoji",
      "reason": "Why this activity fits right now"
    }
  ],
  "conversationStarters": [
    {
      "question": "A conversation starter question",
      "context": "Brief note on why this question could help"
    }
  ],
  "reflectionPrompts": [
    "A reflective journal-style prompt for the couple"
  ],
  "suggestedTools": [
    {
      "tool": "One of: Conversation Decks, Goal Tracker, To-Do List, Date Night Generator, Activities & Games",
      "reason": "Brief explanation of why this in-app tool would help right now",
      "emoji": "relevant emoji"
    }
  ],
  "moodInsight": "A one-line warm observation about the emotional tone",
  "focusArea": "One of: communication, trust, intimacy, fun, healing"
}

Guidelines:
- Suggest 2-3 activities, 2-3 conversation starters, 2-3 reflection prompts, and 2-3 in-app tools
- ALWAYS suggest relevant in-app tools from TheMoreLoveApp. The available tools are:
  * "Conversation Decks" — 1000+ deep questions across 15 themed decks (Deep Connection, Intimacy Builders, Trust Building, Healing & Growth, etc.)
  * "Goal Tracker" — set relationship goals with progress tracking across categories like communication, financial harmony, quality time, intimacy
  * "To-Do List" — shared tasks for couple commitments, repair actions, and daily responsibilities
  * "Date Night Generator" — personalized date suggestions based on budget, energy, and mood
  * "Activities & Games" — interactive exercises like One-Word Check-In, Appreciation Shower, 5-Minute Repair
- Match the suggested tools to the couple's specific situation
- Be warm, supportive, non-judgmental, and never clinical or diagnostic
- Frame everything as growth opportunities, not problems
- Use couple-friendly language ("you two", "together", "your connection")
- The tone should feel like a wise, caring friend
- Never mention AI, algorithms, or machine learning — speak as a natural feature of the app`;

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
          {
            role: "user",
            content: `Here's what's been going on between us:\n\n${conversationText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're experiencing high demand right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "This feature is temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    // Parse the JSON from the response, handling potential markdown code blocks
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse response:", content);
      throw new Error("Could not process the analysis");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-conversation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
