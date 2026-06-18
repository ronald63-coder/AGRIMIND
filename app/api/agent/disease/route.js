export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Disease Agent. " +
    "Farm context: Tomatoes in fruiting stage, Nakuru Kenya. " +
    "Weather: 16.3C, 79% humidity, 0mm rainfall, cool_dry season. " +
    "Disease history: Late Blight, Bacterial Wilt previously recorded. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"disease_risk":"HIGH|MODERATE|LOW",' +
    '"diseases_detected":["..."],' +
    '"outbreak_probability":0-100,' +
    '"recommended_action":"...",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist disease prediction agent. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}