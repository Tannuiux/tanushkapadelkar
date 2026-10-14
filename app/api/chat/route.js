// /api/chat: the small server behind the AI twin. It runs on Vercel, never in the visitor's browser,
// so your API key stays secret. Same idea as Divyansh's "Lotus".
//
// To switch it on, add these in Vercel → Project → Settings → Environment Variables:
//   GEMINI_API_KEY = your key from Google AI Studio
//   GEMINI_MODEL   = (optional) the model name, e.g. gemini-flash-latest
// With no key, the twin still works with its preset questions.
import { RULES } from "@/data/content";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

// The page asks "is chat switched on?" with a GET.
export async function GET() {
  return Response.json({ enabled: Boolean(process.env.GEMINI_API_KEY) });
}

export async function POST(req) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "not_configured" }, { status: 503 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "bad_request" }, { status: 400 }); }

  // Keep only the last 8 turns and short messages, so nobody can run up a bill.
  const turns = (Array.isArray(body?.messages) ? body.messages : [])
    .slice(-8)
    .filter((m) => typeof m?.content === "string" && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content.slice(0, 600) }] }));
  if (!turns.length || turns.at(-1).role !== "user") return Response.json({ error: "bad_request" }, { status: 400 });

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: RULES }] },
      contents: turns,
      generationConfig: { maxOutputTokens: 300, temperature: 0.4 },
    }),
  });

  if (res.status === 429) return Response.json({ error: "rate_limited" }, { status: 429 });
  if (!res.ok) return Response.json({ error: "upstream" }, { status: 502 });

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();
  return Response.json({ text: text || "I'm not sure. Email work.tanushka16@gmail.com and Tanushka will answer." });
}
