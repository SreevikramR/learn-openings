export async function getExplanationFromGemini(fen, userMove, correctMove = null) {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!API_KEY) {
    console.error("Gemini API key is missing. Make sure it's set in your .env.local file.");
    // Throw an error to be caught by the calling function
    throw new Error("Gemini API key not found.");
  }

  // Use the v1beta endpoint with the latest flash model
  const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  let prompt = `You are a friendly chess coach.
The current chess board FEN is: ${fen}.
The user just played the move: ${userMove}.
`;

  if (correctMove && correctMove !== userMove) {
    prompt += `This was not the best move. The recommended move is: ${correctMove}.
Explain concisely why the user's move is a mistake and why the recommended move is better. Keep the tone encouraging.`;
  } else {
    prompt += `Explain concisely why this is a good move and what the strategic idea behind it is.`;
  }

  try {
    const res = await fetch(modelUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    // If the response is not OK, parse the JSON error from Google for more details
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Gemini API Error Response:", JSON.stringify(errorData, null, 2));
      throw new Error("Failed to get explanation from Gemini. Check console for details.");
    }

    const data = await res.json();
    const explanation = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!explanation) {
      console.warn("Gemini response was successful but contained no explanation.", data);
      throw new Error("No explanation was returned from the API.");
    }

    return explanation.trim();
  } catch (err) {
    console.error("Error during fetch call to Gemini:", err);
    // Re-throw the error so the calling function knows the request failed.
    throw new Error("An error occurred while contacting the Gemini API.");
  }
}