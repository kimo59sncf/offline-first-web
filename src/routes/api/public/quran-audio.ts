import { createFileRoute } from "@tanstack/react-router";
import { relayCorsHeaders } from "@/lib/audio-cors";

export const Route = createFileRoute("/api/public/quran-audio")({
  server: { handlers: {
    OPTIONS: async ({ request }) => new Response(null, { status: 204, headers: relayCorsHeaders(request) }),
    GET: async ({ request }) => {
      const { serveQuranAudio } = await import("@/lib/audio-download.server");
      const res = await serveQuranAudio(request);
      const headers = new Headers(res.headers);
      for (const [k, v] of Object.entries(relayCorsHeaders(request))) headers.set(k, v);
      return new Response(res.body, { status: res.status, headers });
    },
  } },
});
