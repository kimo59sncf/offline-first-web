import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { BookOpen, Heart, Home, Pause, Play, Search, Settings, SkipBack, SkipForward, X, RotateCw } from "lucide-react";
import { useT, type TKey } from "@/lib/i18n";
import { usePlayer } from "@/lib/player";
import { surah } from "@/lib/quran";
import { useOnline } from "@/lib/offline";

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
    // Offline support only on the real site (never inside the editor preview).
    const inFrame = window.self !== window.top;
    const preview = /id-preview|lovableproject|localhost/.test(location.hostname);
    if (!("serviceWorker" in navigator)) return;
    if (inFrame || preview || !import.meta.env.PROD) {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  const online = useOnline();
  return (
    <div className="mx-auto min-h-screen max-w-3xl pb-40">
      {!online && (
        <div role="status" className="sticky top-0 z-40 bg-gold px-4 py-2 text-center text-xs font-medium text-foreground">
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
  const tr = p.queue[p.index];
  if (!tr) return null;
  const s = surah(tr.s);
  return (
    <div className="fixed inset-x-0 bottom-[62px] z-20 px-3">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-foreground text-background shadow-soft">
        <div className="h-0.5 bg-gold" style={{ width: `${p.progress * 100}%` }} />
        <div className="flex items-center gap-2 p-2.5">
          <Link to="/surah/$id" params={{ id: String(tr.s) }} className="min-w-0 flex-1 px-1">
            <div className="truncate text-sm font-semibold">{lang === "ar" ? s.ar : s.tr}</div>
            <div className="text-xs opacity-70">{t("ayah")} {num(tr.a)}{p.error && ` · ${t("error")}`}</div>
          </Link>
          <button aria-label={t("prev")} onClick={p.prev} className="rounded-full p-2 hover:bg-background/10"><SkipBack className="h-4 w-4 rtl:rotate-180" /></button>
          <button aria-label={p.error ? t("retry") : p.playing ? t("pause") : t("play")} onClick={p.toggle} className="rounded-full bg-primary p-2.5 text-primary-foreground">
            {p.error ? <RotateCw className="h-4 w-4" /> : p.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button aria-label={t("next")} onClick={p.next} className="rounded-full p-2 hover:bg-background/10"><SkipForward className="h-4 w-4 rtl:rotate-180" /></button>
          <button aria-label="Close" onClick={p.stop} className="rounded-full p-2 opacity-70 hover:bg-background/10"><X className="h-4 w-4" /></button>
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
  const s = surah(n);
  return (
    <Link to="/surah/$id" params={{ id: String(n) }} className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-card">
      <span className="grid h-10 w-10 shrink-0 rotate-45 place-items-center rounded-lg border border-gold/50 text-xs font-semibold text-gold">
        <span className="-rotate-45">{num(n)}</span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{s.tr}</div>
        <div className="text-xs text-muted-foreground">
          {lang !== "ar" && `${s.en} · `}{num(s.ayahs)} {t("ayahs")} · {t(s.type === "Meccan" ? "meccan" : "medinan")}
        </div>
      </div>
      <span dir="rtl" className="font-quran text-xl text-primary">{s.ar.replace("سُورَةُ ", "")}</span>
    </Link>
  );
}
