import { createOpenAIResponse } from "@/lib/openai";

const DEFAULT_FARMER = {
  name: "Farmer",
  location: "Kenya",
  crop: "crops",
  stage: "growing",
  size: "farm",
};

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => item && typeof item.text === "string")
    .slice(-10)
    .map((item) => ({
      role: item.role === "ai" || item.role === "assistant" ? "assistant" : "user",
      content: item.text.slice(0, 2_000),
    }));
}

export async function POST(request) {
  try {
    const { message, farmer = {}, weather = {}, history = [] } = await request.json();

    if (typeof message !== "string" || !message.trim()) {
      return Response.json({ error: "A chat message is required." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "The AI chat service is not configured." }, { status: 503 });
    }

    const profile = { ...DEFAULT_FARMER, ...farmer };
    const system =
      `You are AgriMind, a friendly farming assistant for ${profile.name} in ${profile.location}. ` +
      `They grow ${profile.crop} at the ${profile.stage} stage on a ${profile.size}. ` +
      `Current weather: ${weather.temp ?? "unknown"}°C, ${weather.humidity ?? "unknown"}% humidity. ` +
      "Give practical, safe, concise guidance in simple language. Keep replies to three sentences or fewer.";

    const historyText = sanitizeHistory(history)
      .map((item) => `${item.role}: ${item.content}`)
      .join("\n");
    const reply = await createOpenAIResponse({
      instructions: system,
      input: `${historyText}\nuser: ${message.trim().slice(0, 2_000)}`.trim(),
      maxOutputTokens: 300,
    });

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return Response.json({ error: "Invalid chat request." }, { status: 400 });
  }
}
