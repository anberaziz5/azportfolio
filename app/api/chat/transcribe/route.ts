import { groqTranscribe } from "@/lib/ada/groq";

export const maxDuration = 15;
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob) || file.size < 200) {
      return Response.json({ error: "No audio received." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return Response.json({ error: "Audio too large." }, { status: 413 });
    }

    const name = (file as File).name || "clip.webm";
    const t0 = Date.now();
    const text = await groqTranscribe(file, name);
    if (!text) {
      return Response.json({ error: "Could not hear that. Try again." }, { status: 422 });
    }

    return Response.json({ text, ms: Date.now() - t0 });
  } catch (err) {
    console.error("Ada STT error:", err);
    return Response.json({ error: "Transcription failed. Please try again." }, { status: 502 });
  }
}
