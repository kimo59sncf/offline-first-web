import { afterEach, describe, expect, it, vi } from "vitest";
import { audioDownloadUrl, officialAudioUrl } from "@/lib/audio-source";
import { serveQuranAudio } from "@/lib/audio-download.server";

const audio = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
afterEach(() => vi.unstubAllGlobals());

describe("Official audio relay", () => {
  it("accepts official verse audio and rejects arbitrary hosts and out-of-bounds verses", () => {
    expect(officialAudioUrl(audio)).toBe(audio);
    expect(audioDownloadUrl(audio)).toBe(`/api/public/quran-audio?url=${encodeURIComponent(audio)}`);
    for (const url of ["https://example.com/1.mp3", audio + "?redirect=1", audio.replace("/1.mp3", "/6237.mp3"), audio.replace("ar.alafasy", "ar.unknown"), audio.replace("https:", "http:")]) expect(officialAudioUrl(url)).toBeNull();
  });
  it("never fetches a disallowed source", async () => {
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    const response = await serveQuranAudio(new Request("https://app.test/api/public/quran-audio?url=https://example.com"));
    expect(response.status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("accepts verified Basfar audio at the source's 192 kbps bitrate", () => {
    const url = "https://cdn.islamic.network/quran/audio/192/ar.abdullahbasfar/1.mp3";
    expect(officialAudioUrl(url)).toBe(url);
    expect(officialAudioUrl(url.replace("192", "256"))).toBeNull();
  });
  it("streams official audio without forwarding caller credentials", async () => {
    const fetcher = vi.fn(async () => new Response("audio-bytes", { headers: { "Content-Type": "audio/mpeg" } }));
    vi.stubGlobal("fetch", fetcher);
    const response = await serveQuranAudio(new Request(`https://app.test${audioDownloadUrl(audio)}`, { headers: { Cookie: "private", Authorization: "Bearer private" } }));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("audio-bytes");
    expect(fetcher).toHaveBeenCalledWith(audio, { redirect: "error", signal: expect.any(AbortSignal) });
  });
  it("returns an error for unavailable upstream audio", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("missing", { status: 404 })));
    expect((await serveQuranAudio(new Request(`https://app.test${audioDownloadUrl(audio)}`))).status).toBe(502);
  });
});
import { relayCorsHeaders } from "@/lib/audio-cors";
describe("Audio relay CORS", () => {
  it("allows only Capacitor origins, never credentials", () => {
    for (const o of ["capacitor://localhost", "https://localhost"]) {
      const h = relayCorsHeaders(new Request("https://x.test", { headers: { Origin: o } }));
      expect(h["Access-Control-Allow-Origin"]).toBe(o);
      expect(h["Access-Control-Allow-Credentials"]).toBeUndefined();
    }
    expect(relayCorsHeaders(new Request("https://x.test", { headers: { Origin: "https://evil.test" } }))["Access-Control-Allow-Origin"]).toBeUndefined();
  });
});
