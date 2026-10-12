// Mobile (Capacitor) build: static SPA shell, no server runtime. The web build (vite.config.ts) is untouched.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } },
  },
});
