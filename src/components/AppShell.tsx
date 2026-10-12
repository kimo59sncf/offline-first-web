import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { BookOpen, CloudCheck, Heart, Home, Pause, Play, Repeat, Search, Settings, SkipBack, SkipForward, Shuffle, X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurahActions } from "@/components/LibraryControls";
import { useDownload } from "@/lib/downloads";
import { useT, type TKey } from "@/lib/i18n";
import { usePlayer } from "@/lib/player-context";
import { RECITERS, surah, surahName } from "@/lib/quran";
import { useOnline } from "@/lib/offline";
import { useStore } from "@/lib/store";
import { initNative } from "@/lib/native";
import { isNativeApp } from "@/lib/platform";

const tabs: { to: "/" | "/surahs" | "/search" | "/favorites" | "/settings"; icon: typeof Home; k: TKey }[] = [
  { to: "/", icon: Home, k: "home" },
  { to: "/surahs", icon: BookOpen, k: "surahs" },
  { to: "/search", icon: Search, k: "search" },
  { to: "/favorites", icon: Heart, k: "favorites" },
  { to: "/settings", icon: Settings, k: "settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, dir } = useT();
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);
  useEffect(() => {
    let cleanup = () => {};
    void initNative().then((fn) => { cleanup = fn; });
    return () => cleanup();
  }, []);
  useEffect(() => {
    // Offline support only on the real site (never inside the editor preview or the native app).
    const inFrame = window.self !== window.top;
    const preview = /id-preview|lovableproject|localhost/.test(location.hostname);
    if (!("serviceWorker" in navigator)) return;
    if (inFrame || preview || isNativeApp() || !import.meta.env.PROD) {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  const online = useOnline();
  return (
    <div className="mx-auto min-h-screen max-w-3xl pb-40 pt-[env(safe-area-inset-top)]">
      {!online && (
        <div role="status" className="sticky top-0 z-40 bg-gold px-4 py-2 text-center text-xs font-medium text-gold-foreground">
          {t("offlineBanner")}
        </div>
      )}
      {children}
      <MiniPlayer />
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur">
        <ul className="mx-auto flex max-w-3xl justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {tabs.map(({ to, icon: Icon, k }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex flex-col items-center gap-1 px-3 py-2.5 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary"
              >
                <Icon className="h-5 w-5" aria-hidden />
                {t(k)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function MiniPlayer() {
  const p = usePlayer();
  const { t, num, lang } = useT();
  const reciterId = useStore((s) => s.reciter);
  const tr = p.queue[p.index];
  if (!tr) return null;
  const s = surah(tr.s);
  const reciterInfo = RECITERS.find((r) => r.id === reciterId);
  const reciterName = (lang === "ar" ? reciterInfo?.ar : reciterInfo?.name) ?? reciterId;
  const repeatOrder = ["off", "ayah", "surah"] as const;
  const cycleRepeat = () => {
    const next = repeatOrder[(repeatOrder.indexOf(p.repeat) + 1) % repeatOrder.length] ?? "off";
    p.setRepeat(next);
  };
  const repeatLabel = t(p.repeat === "off" ? "repeatOff" : p.repeat === "ayah" ? "repeatAyah" : "repeatSurah");
  return (
    <div className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-20 px-3">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-foreground text-background shadow-soft">
        <div className="h-0.5 bg-gold" style={{ width: `${p.progress * 100}%` }} />
        <div className="flex items-center gap-1 p-2.5">
          <Link to="/surah/$id" params={{ id: String(tr.s) }} className="min-w-0 flex-1 px-1">
            <div className="truncate text-sm font-semibold">{surahName(s, lang)}</div>
            <div className="truncate text-xs opacity-70">{reciterName} · {t("ayah")} {num(tr.a)}{p.error && ` · ${t("error")}`}</div>
          </Link>
          <Button size="icon" variant="ghost" aria-label={t("prev")} title={t("prev")} onClick={p.prev}><SkipBack className="h-4 w-4 rtl:rotate-180" /></Button>
          <Button size="icon" aria-label={p.error ? t("retry") : p.playing ? t("pause") : t("play")} title={p.playing ? t("pause") : t("play")} onClick={p.toggle}>
            {p.error ? <RotateCw className="h-4 w-4" /> : p.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="ghost" aria-label={t("next")} title={t("next")} onClick={p.next}><SkipForward className="h-4 w-4 rtl:rotate-180" /></Button>
          <Button size="icon" variant="ghost" aria-label={t("shuffle")} title={t("shuffle")} onClick={() => void p.playRandomSurah()}><Shuffle className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label={`${t("repeat")}: ${repeatLabel}`} title={`${t("repeat")}: ${repeatLabel}`} aria-pressed={p.repeat !== "off"} className={p.repeat !== "off" ? "text-primary" : "text-muted-foreground"} onClick={cycleRepeat}><Repeat className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label={t("close")} title={t("close")} onClick={p.stop}><X /></Button>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="px-5 pb-4 pt-8">
      <h1 className="text-4xl font-semibold">{title}</h1>
      {children}
    </header>
  );
}

export function SurahRow({ n }: { n: number }) {
  const { t, num, lang } = useT();
  const reciter = useStore((s) => s.reciter);
  const favorite = useStore((s) => (s.favoriteSurahs[s.reciter] ?? []).includes(n));
  const { saved, busy } = useDownload(n, lang, reciter);
  const s = surah(n);
  return (
    <div className="flex flex-wrap items-center gap-x-2 border-b px-3 py-2">
    <Link to="/surah/$id" params={{ id: String(n) }} className="flex min-w-0 flex-1 items-center gap-3 py-2 transition-colors hover:bg-card">
      <span className="grid h-10 w-10 shrink-0 rotate-45 place-items-center rounded-lg border border-gold/50 text-xs font-semibold text-gold">
        <span className="-rotate-45">{num(n)}</span>
      </span>
       <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="truncate">{surahName(s, lang)}</span>
          {favorite && <Heart className="h-4 w-4 shrink-0 text-favorite" fill="currentColor" role="img" aria-label={t("favorite")} />}
          {saved && <CloudCheck className="h-4 w-4 shrink-0 text-success" role="img" aria-label={t("downloaded")} />}
        </div>
        <div className="text-xs text-muted-foreground">
          {lang === "en" && `${s.en} · `}{num(s.ayahs)} {t("ayahs")} · {t(s.type === "Meccan" ? "meccan" : "medinan")}
        </div>
      </div>
      {lang !== "ar" && <span dir="rtl" className="font-quran hidden text-xl text-primary sm:block">{s.ar.replace("سُورَةُ ", "")}</span>}
    </Link>
    <SurahActions n={n} favorite={favorite} saved={saved} busy={busy} />
    </div>
  );
}
