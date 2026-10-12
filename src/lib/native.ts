import { isNativeApp } from "./platform";

/** Native-only setup (back button, status bar, splash, external links). No-op on the web. Call from useEffect. */
export async function initNative(): Promise<() => void> {
  if (!isNativeApp()) return () => {};
  const [{ App }, { StatusBar, Style }, { SplashScreen }, { Browser }] = await Promise.all([
    import("@capacitor/app"), import("@capacitor/status-bar"), import("@capacitor/splash-screen"), import("@capacitor/browser"),
  ]);
  const back = await App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack && window.history.length > 1) window.history.back();
    else void App.minimizeApp();
  });
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: "#3E6B58" }).catch(() => {});
  SplashScreen.hide().catch(() => {});
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || a.origin === window.location.origin || !/^https?:/.test(a.protocol)) return;
    e.preventDefault();
    void Browser.open({ url: a.href });
  };
  document.addEventListener("click", onClick, true);
  return () => { void back.remove(); document.removeEventListener("click", onClick, true); };
}
