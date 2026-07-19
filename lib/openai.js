const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export async function createOpenAIResponse({ instructions, input, maxOutputTokens = 400 }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.6-sol",
      instructions,
      input,
      max_output_tokens: maxOutputTokens,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("OpenAI API error:", data);
    throw new Error("OpenAI could not generate a response.");
  }

  const text = data.output_text || data.output
    ?.flatMap((item) => item.content || [])
    .find((item) => item.type === "output_text")?.text;

  if (!text) throw new Error("OpenAI returned no text response.");
  return text;
}

export async function createOpenAIJsonResponse({ instructions, input, maxOutputTokens = 400 }) {
  const text = await createOpenAIResponse({ instructions, input, maxOutputTokens });
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
