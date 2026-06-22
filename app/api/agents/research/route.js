export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Research Agent. " +
    "Context: Tomatoes in Nakuru Kenya, cool_dry season, fruiting stage. " +
    "Disease history: Late Blight, Bacterial Wilt. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"research_insight":"...",' +
    '"best_practice":"...",' +
    '"kephis_advisory":"...",' +
    '"prevention_method":"...",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist agricultural research agent with knowledge of Kenyan farming. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}