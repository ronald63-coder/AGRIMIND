export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Irrigation Agent. " +
    "Farm: Tomatoes fruiting stage, 3.2 ha, Nakuru Kenya. " +
    "Weather: 16.3C, 79% humidity, 0mm rainfall, soil moisture 62%. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"irrigate_today":"yes|no",' +
    '"water_amount_mm":"...",' +
    '"next_irrigation":"...",' +
    '"reasoning":"...",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist irrigation management agent. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}