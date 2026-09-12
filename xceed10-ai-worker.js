/*
Xceed10 AI backend for Cloudflare Workers.
- Deploy this file as a Worker.
- Add a secret named GEMINI_API_KEY in the Worker settings.
- Put the Worker URL into ai-config.js on the GitHub Pages site.
Never put the Gemini API key in your public GitHub repository.
*/

const ALLOWED_ORIGINS = [
  "https://hxmza660.github.io"
];

const SYSTEM = `You are Xceed10 AI, a patient Class 10 CBSE study coach.
Teach concepts clearly and accurately. Prefer simple English/Hinglish when the user does.
Do not just give a final answer when a student asks for help: show the reasoning and a method they can reuse.
Create original practice questions; do not reproduce copyrighted textbook passages or private coaching material.
Stay within Class 10 academic level unless the student asks for a deeper explanation.
For study plans, be realistic and include breaks. Never shame the student for weak performance.
`;

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8"
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response("", { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers: corsHeaders(origin) });
    }
    try {
      const body = await request.json();
      const mode = String(body.mode || "Explain").slice(0, 40);
      const prompt = String(body.prompt || "").trim().slice(0, 6000);
      if (!prompt) return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400, headers: corsHeaders(origin) });

      const fullPrompt = `${SYSTEM}\nMode: ${mode}\nStudent request: ${prompt}`;
      const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "x-goog-api-key": env.GEMINI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            thinkingConfig: { thinkingLevel: "medium" },
            maxOutputTokens: 1400
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        return new Response(JSON.stringify({ error: data.error?.message || "Gemini request failed" }), { status: 502, headers: corsHeaders(origin) });
      }
      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
      return new Response(JSON.stringify({ text: text || "No response returned." }), { status: 200, headers: corsHeaders(origin) });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: corsHeaders(origin) });
    }
  }
};
