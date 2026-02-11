import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

    const { myProfile, partnerProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a compassionate relationship counselor AI. You specialize in helping couples understand each other's emotional triggers, childhood wounds, and hangups. Your goal is to provide empathetic, non-clinical insights that help partners understand WHY their partner reacts certain ways, and how their own triggers might interact with their partner's.

IMPORTANT GUIDELINES:
- Be warm, validating, and non-judgmental
- Focus on understanding, not blame
- Explain trigger interactions simply
- Offer concrete, actionable suggestions
- Reference attachment theory and childhood patterns when relevant
- Keep language accessible and avoid clinical jargon
- Always emphasize that triggers are valid and come from real experiences

Return your response as a JSON object with this structure:
{
  "dynamic_insights": [
    {
      "title": "Short insight title",
      "description": "2-3 sentence explanation of how these triggers might interact",
      "tip": "A concrete suggestion for navigating this"
    }
  ],
  "potential_misunderstandings": [
    {
      "scenario": "Brief scenario description",
      "partner_a_perspective": "How partner A might feel/react",
      "partner_b_perspective": "How partner B might feel/react",
      "bridge": "How to bridge understanding in this moment"
    }
  ],
  "growth_areas": [
    "Short growth area suggestion"
  ]
}`;

    const userPrompt = `Here are the trigger profiles for a couple:

PARTNER A:
- Emotional triggers: ${JSON.stringify(myProfile.emotional_triggers)}
- Childhood triggers: ${JSON.stringify(myProfile.childhood_triggers)}
- Hangups: ${JSON.stringify(myProfile.hangups)}
- Conflict style: ${myProfile.conflict_style}
- Stress response: ${myProfile.stress_response}
- What they need when triggered: ${myProfile.needs_when_triggered}
- Signals often misread: ${myProfile.misread_signals}

PARTNER B:
- Emotional triggers: ${JSON.stringify(partnerProfile.emotional_triggers)}
- Childhood triggers: ${JSON.stringify(partnerProfile.childhood_triggers)}
- Hangups: ${JSON.stringify(partnerProfile.hangups)}
- Conflict style: ${partnerProfile.conflict_style}
- Stress response: ${partnerProfile.stress_response}
- What they need when triggered: ${partnerProfile.needs_when_triggered}
- Signals often misread: ${partnerProfile.misread_signals}

Please analyze how these trigger profiles might interact, identify potential misunderstandings, and provide compassionate insights for the couple.`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_trigger_insights",
              description: "Return structured insights about how the couple's triggers interact.",
              parameters: {
                type: "object",
                properties: {
                  dynamic_insights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        tip: { type: "string" },
                      },
                      required: ["title", "description", "tip"],
                      additionalProperties: false,
                    },
                  },
                  potential_misunderstandings: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        scenario: { type: "string" },
                        partner_a_perspective: { type: "string" },
                        partner_b_perspective: { type: "string" },
                        bridge: { type: "string" },
                      },
                      required: ["scenario", "partner_a_perspective", "partner_b_perspective", "bridge"],
                      additionalProperties: false,
                    },
                  },
                  growth_areas: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["dynamic_insights", "potential_misunderstandings", "growth_areas"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_trigger_insights" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let insights;

    if (toolCall?.function?.arguments) {
      insights = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content || "{}";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      insights = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-triggers error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
