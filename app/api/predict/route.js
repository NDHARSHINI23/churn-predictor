const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // Free, fast, high quality

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.startsWith("PASTE_")) {
      return Response.json(
        { error: "GROQ_API_KEY is not set. Add it to .env.local — get a free key at console.groq.com" },
        { status: 500 }
      );
    }

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,                  // already in [{role, content}] format
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: "json_object" } // forces valid JSON output
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const status = response.status;
      let message = data.error?.message || "Groq API error";

      if (status === 401) message = "Invalid Groq API key. Check your GROQ_API_KEY in .env.local.";
      if (status === 429) message = "Groq rate limit hit. Please wait a moment and try again.";
      if (status === 400) message = "Bad request to Groq. " + message;

      return Response.json({ error: message }, { status });
    }

    // Extract the text from the OpenAI-compatible response
    const text = data.choices?.[0]?.message?.content || "";
    if (!text) {
      return Response.json({ error: "Empty response from Groq. Try again." }, { status: 500 });
    }

    // Normalize to the shape the frontend expects
    return Response.json({ content: [{ type: "text", text }] });

  } catch (err) {
    return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
