/** Origins of the Capacitor WebViews (iOS uses capacitor://, Android uses https://localhost). */
export const NATIVE_ORIGINS = ["capacitor://localhost", "https://localhost"] as const;

/** CORS for the read-only audio relay: only Capacitor origins, never credentials. Same-origin web needs none. */
export function relayCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") ?? "";
  const base: Record<string, string> = { Vary: "Origin" };
  if (!(NATIVE_ORIGINS as readonly string[]).includes(origin)) return base;
  return {
    ...base,
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}
