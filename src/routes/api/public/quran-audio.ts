import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/quran-audio")({
  server: { handlers: { GET: async ({ request }) => {
    const { serveQuranAudio } = await import("@/lib/audio-download.server");
    return serveQuranAudio(request);
  } } },
});