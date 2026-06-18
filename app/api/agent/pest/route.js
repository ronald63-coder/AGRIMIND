export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Pest Agent. " +
    "Crop: Tomatoes fruiting stage, Nakuru Kenya. " +
    "Weather: 16.3C, 79% humidity, 19.5km/h wind, cool_dry season. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"pest_risk":"HIGH|MODERATE|LOW",' +
    '"pests_detected":["..."],' +
    '"infestation_probability":0-100,' +
    '"control_method":"...",' +
    '"scouting_advice":"...",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist pest management agent. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}