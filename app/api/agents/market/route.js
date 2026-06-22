export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Market Agent. " +
    "Crop: Tomatoes, Nakuru County Kenya. " +
    "Current price: KES 45/kg. Season: cool_dry. Growth stage: fruiting. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"price_trend":"rising|falling|stable",' +
    '"sell_now":"yes|no",' +
    '"optimal_price":"KES X/kg",' +
    '"market_forecast":"...",' +
    '"best_market":"...",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist agricultural market analysis agent. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}