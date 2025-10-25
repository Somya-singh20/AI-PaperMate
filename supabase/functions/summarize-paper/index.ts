import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, summaryStyle, citationFormat } = await req.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: "No content provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Determine summary length based on style
    const summaryLengths = {
      short: "a brief 2-3 sentence summary",
      detailed: "a detailed 1-paragraph summary",
      comprehensive: "a comprehensive 2-3 paragraph summary"
    };

    const summaryPrompt = `Analyze this research paper and provide ${summaryLengths[summaryStyle as keyof typeof summaryLengths] || summaryLengths.detailed}.

Paper content:
${content.substring(0, 8000)}

Provide:
1. A clear summary following the requested style
2. 5-7 key keywords or concepts
3. A properly formatted academic citation in ${citationFormat.toUpperCase()} format (extract title, authors, year from the content if available, or generate a generic citation)

Format your response as JSON:
{
  "summary": "your summary here",
  "keywords": ["keyword1", "keyword2", ...],
  "citation": "formatted citation here"
}`;

    console.log("Calling Lovable AI for summarization...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert academic research assistant. Always respond with valid JSON only, no additional text."
          },
          {
            role: "user",
            content: summaryPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");
    
    const resultText = aiResponse.choices[0].message.content;
    
    // Extract JSON from the response (handle markdown code blocks if present)
    let resultJson;
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultJson = JSON.parse(jsonMatch[0]);
      } else {
        resultJson = JSON.parse(resultText);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", resultText);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate the response structure
    if (!resultJson.summary || !resultJson.keywords || !resultJson.citation) {
      throw new Error("Invalid response structure from AI");
    }

    return new Response(
      JSON.stringify(resultJson),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in summarize-paper function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
