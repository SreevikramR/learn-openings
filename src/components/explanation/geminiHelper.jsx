export async function getExplanationFromGemini(
  fenBeforeUserMove,          // FEN of the position BEFORE the user's move
  userMoveUciOrSan,           // e.g. "e2e4" or "e4"
  correctMoveUciOrSan = null  // optional, e.g. "c5" or "g1f3"
) {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("Gemini API key not found.");
  }

  const modelUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  // Build a coaching prompt with paragraph format
  const promptLines = [
    "You are a concise, friendly chess coach.",
    `Position BEFORE the user's move (FEN): ${fenBeforeUserMove}`,
    `The user just played: ${userMoveUciOrSan}`,
  ];

  if (correctMoveUciOrSan && correctMoveUciOrSan !== userMoveUciOrSan) {
    promptLines.push(
      `The correct move in the chosen opening line is: ${correctMoveUciOrSan}.`,
      "Write a short paragraph that naturally explains:",
      "- What the user played,",
      "- What the correct move in the opening line is,",
      "- Why the user's move is less effective,",
      "- And why the correct move fits the opening's idea.",
      "Do not use bullet points or numbers. Make it flow like a coach’s advice.",
      "Keep it under 100 words."
    );
  } else {
    promptLines.push(
      "Write a short paragraph explaining why this move is correct for the opening line.",
      "Describe the key idea, typical plan, and why this move fits the opening strategy.",
      "Do not list options — focus only on the given move.",
      "Keep it under 100 words."
    );
  }

  const prompt = promptLines.join("\n");

  try {
    const res = await fetch(modelUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      let errorDetail = "";
      try {
        const errJson = await res.json();
        errorDetail = JSON.stringify(errJson, null, 2);
      } catch {
        errorDetail = await res.text();
      }
      throw new Error("Gemini API Error: " + errorDetail);
    }

    const data = await res.json();
    console.log("Gemini raw response:", data);

    const candidates = data?.candidates ?? [];
    const parts = candidates[0]?.content?.parts ?? [];
    const combined = parts
      .map((p) => (typeof p.text === "string" ? p.text : ""))
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!combined) {
      throw new Error("No explanation returned from the API.");
    }

    return combined;
  } catch (err) {
    console.error("Error calling Gemini:", err);
    throw new Error("An error occurred while contacting the Gemini API.");
  }
}
