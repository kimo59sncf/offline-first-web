import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Headphones } from "lucide-react";
import { useT } from "@/lib/i18n";
import { setState, useStore } from "@/lib/store";
import { RECITERS, SURAHS, surah } from "@/lib/quran";
import { SurahRow } from "@/components/AppShell";
import { ReciterPicker } from "@/components/LibraryControls";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoranProFree — Lire et écouter le Coran gratuitement" },
      { name: "description", content: "Application Coran gratuite et respectueuse de la vie privée : 114 sourates, récitations audio, recherche et favoris." },
      { property: "og:title", content: "CoranProFree" },
      { property: "og:description", content: "Lire et écouter le Coran, gratuitement et sans pistage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, num, lang } = useT();
  const last = useStore((s) => s.lastRead);
  const listen = useStore((s) => s.lastListen);
  const opened = useStore((s) => s.stats.surahsOpened.length);
  const reciter = useStore((s) => s.reciter);
  const [date, setDate] = useState<{ g: string; h: string; morning: boolean } | null>(null);
  useEffect(() => {
    const d = new Date();
    const loc = lang === "ar" ? "ar" : lang;
    setDate({
      g: d.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" }),
      h: d.toLocaleDateString(`${loc}-u-ca-islamic`, { day: "numeric", month: "long", year: "numeric" }),
      morning: d.getHours() < 17,
    });
  }, [lang]);

  return (
    <div>
      <section className="bg-hero relative m-3 overflow-hidden rounded-3xl px-6 pb-8 pt-10 text-primary-foreground">
        <p className="text-xs uppercase tracking-widest opacity-75">{date ? `${date.g} · ${date.h}` : "\u00a0"}</p>
        <h1 className="mt-3 text-4xl font-semibold">{date ? t(date.morning ? "morning" : "evening") : "\u00a0"}</h1>
        <p className="mt-1 opacity-80">{t("tagline")}</p>
        <p dir="rtl" className="font-quran mt-6 text-3xl text-gold">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      </section>

      <div className="grid gap-3 px-3 sm:grid-cols-2">
        <ContinueCard icon={<BookOpen className="h-5 w-5" />} label={last ? t("continueReading") : t("start")} pos={last ?? { s: 1, a: 1 }} />
        {listen && <ContinueCard icon={<Headphones className="h-5 w-5" />} label={t("continueListening")} pos={listen} />}
      </div>

      {opened > 0 && (
        <p className="px-6 pt-4 text-sm text-muted-foreground">
          {num(opened)} / {num(114)} {t("opened")}
        </p>
      )}

      <h2 className="px-6 pb-2 pt-8 text-2xl font-semibold">{t("reciters")}</h2>
      <div className="px-5 pb-2"><ReciterPicker /></div>

      <div className="flex items-end justify-between px-6 pb-2 pt-8">
        <h2 className="text-2xl font-semibold">{t("surahs")}</h2>
        <Link to="/surahs" className="text-sm font-medium text-primary">{num(114)} →</Link>
      </div>
      <div className="px-1">{SURAHS.slice(0, 8).map((s) => <SurahRow key={s.n} n={s.n} />)}</div>
    </div>
  );
}

function ContinueCard({ icon, label, pos }: { icon: React.ReactNode; label: string; pos: { s: number; a: number } }) {
  const { t, num } = useT();
  const s = surah(pos.s);
  return (
    <Link to="/surah/$id" params={{ id: String(pos.s) }} hash={`a${pos.a}`} className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">{icon}</span>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-semibold">{s.tr} · {t("ayah")} {num(pos.a)}</div>
      </div>
    </Link>
  );
}
