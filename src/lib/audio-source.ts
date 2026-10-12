import { apiOrigin } from "./platform";
import { RECITERS } from "./quran";

/** Only the official verse audio URLs supplied by AlQuran Cloud are accepted. */
export function officialAudioUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.origin !== "https://cdn.islamic.network" || url.username || url.password || url.search || url.hash) return null;
    const match = url.pathname.match(/^\/quran\/audio\/(64|128|192)\/(ar\.[a-z]+)\/([1-9]\d{0,3})\.mp3$/);
    if (!match || Number(match[3]) > 6236 || !RECITERS.some((r) => r.id === match[2])) return null;
    return url.href;
  } catch { return null; }
}

export function audioDownloadUrl(value: string): string {
  const url = officialAudioUrl(value);
  if (!url) throw new Error("invalid-audio");
  return `${apiOrigin()}/api/public/quran-audio?url=${encodeURIComponent(url)}`;
}