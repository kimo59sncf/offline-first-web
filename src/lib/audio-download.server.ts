import { officialAudioUrl } from "./audio-source";

/** Public, read-only Quran audio. Never forwards cookies, credentials or arbitrary URLs. */
export async function serveQuranAudio(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const input = params.get("url") ?? "";
  const url = input.length <= 200 ? officialAudioUrl(input) : null;
  if (!url) return new Response("Invalid audio source", { status: 400 });
  try {
    const upstream = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30000) });
    if (!upstream.ok || !upstream.body || !upstream.headers.get("content-type")?.startsWith("audio/")) {
      await upstream.body?.cancel();
      return new Response("Audio unavailable", { status: 502 });
    }
    return new Response(upstream.body, { headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "audio/mpeg",
      "Cache-Control": "public, max-age=604800",
      "X-Content-Type-Options": "nosniff",
    } });
  } catch { return new Response("Audio unavailable", { status: 502 }); }
}