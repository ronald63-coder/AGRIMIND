// FILE 1: app/api/agents/weather/route.js
// ================================================================
export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Weather Agent. " +
    "Analyse current weather conditions for Nakuru, Kenya. " +
    "Temperature: 16.3C, Humidity: 79%, Rainfall: 0mm, Wind: 19.5km/h, Season: cool_dry. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"weather_risk":"HIGH|MODERATE|LOW",' +
    '"risk_window":"...",' +
    '"conditions_summary":"...",' +
    '"alert_level":"HIGH|MODERATE|LOW",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist weather intelligence agent. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}

 
