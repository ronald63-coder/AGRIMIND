export async function GET() {
  const AI_URL = "https://api.anthropic.com/v1/messages";
 
  const prompt =
    "You are the AgriMind Finance Agent. " +
    "Farm: 3.2 ha Tomatoes, Nakuru Kenya. Market price: KES 45/kg. " +
    "Potential disease loss: 30% yield. Fungicide intervention cost: KES 8000. " +
    "Return ONLY valid JSON (no backticks): " +
    '{"intervention_roi":"...",' +
    '"expected_yield_kes":"KES X",' +
    '"loss_avoided_kes":"KES X",' +
    '"recommendation":"treat|skip",' +
    '"break_even_price":"KES X/kg",' +
    '"confidence":0-100,' +
    '"summary":"one sentence"}';
 
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are a specialist agricultural finance agent. Respond ONLY with valid JSON.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
 
  const data = await res.json();
  const text = (data.content || []).find(b => b.type === "text")?.text || "{}";
  return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}