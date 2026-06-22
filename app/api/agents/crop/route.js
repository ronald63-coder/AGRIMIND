export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Crop Agent. " +
    "Crop: Tomatoes Cal-J variety, planted 2026-03-10, expected harvest 2026-06-20. " +
    "Current stage: fruiting. Weather: 16.3C, 79% humidity, cool_dry. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"days_to_harvest":0,' +
    '"stage_health":"good|fair|poor",' +
    '"stage_risks":"...",' +
    '"fertilizer_advice":"...",' +
    '"harvest_readiness":"...",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist crop monitoring agent. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}