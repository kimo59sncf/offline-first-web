import { Capacitor } from "@capacitor/core";

/** True only inside the Android/iOS Capacitor shell; always false on the web and during SSR. */
export function isNativeApp(): boolean {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
}

/**
 * Origin of the published server for server routes (audio relay).
 * Web: same-origin relative URLs (""). Native: VITE_PUBLIC_API_ORIGIN (HTTPS, set in .env.mobile).
 */
export function apiOrigin(): string {
  if (!isNativeApp()) return "";
  const origin = (import.meta.env['VITE_PUBLIC_API_ORIGIN'] as string | undefined)?.replace(/\/+$/, "") ?? "";
  if (!origin.startsWith("https://")) throw new Error("VITE_PUBLIC_API_ORIGIN must be an https URL for the native app");
  return origin;
}
