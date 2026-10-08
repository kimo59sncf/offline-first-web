// CoranProFree service worker: offline shell + cached Quran text/audio.
const SHELL = "cpf-shell-v1";
const DATA = "cpf-data-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(["/", "/manifest.webmanifest", "/icon-512.png"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => ![SHELL, DATA].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Quran text, translations and audio: cache first (content never changes)
  if (url.hostname.endsWith("alquran.cloud") || url.hostname.endsWith("islamic.network") || url.hostname.includes("fonts.g")) {
    if (req.headers.has("range")) return;
    e.respondWith(
      caches.open(DATA).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === "opaque") c.put(req, res.clone());
        return res;
      }),
    );
    return;
  }
  if (url.origin !== location.origin) return;
  // Pages: network first, fallback to cache
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { caches.open(SHELL).then((c) => c.put(req, res.clone())); return res; })
        .catch(async () => (await caches.match(req)) || (await caches.match("/"))),
    );
    return;
  }
  // Static assets: stale-while-revalidate
  e.respondWith(
    caches.open(SHELL).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }),
  );
});
