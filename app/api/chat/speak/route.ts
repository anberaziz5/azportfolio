import { groqSpeak } from "@/lib/ada/groq";

export const maxDuration = 15;
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string };
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) return Response.json({ error: "Missing text." }, { status: 400 });

    const { audio, contentType } = await groqSpeak(text);
    return new Response(audio, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS failed";
    console.error("Ada TTS error:", message);
    const terms = /terms/i.test(message);
    return Response.json(
      {
        error: terms
          ? "Groq Orpheus TTS needs terms accepted in the Groq console."
          : "Speech synthesis failed.",
        code: terms ? "tts_terms" : "tts_failed",
      },
      { status: 502 }
    );
  }
}
