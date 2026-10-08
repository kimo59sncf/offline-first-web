import { createFileRoute } from "@tanstack/react-router";
import { LANGS, useT } from "@/lib/i18n";
import { defaultState, setState, useStore } from "@/lib/store";
import { RECITERS, TRANSLATIONS } from "@/lib/quran";
import { usePlayer } from "@/lib/player";
import { PageHeader } from "@/components/AppShell";
import { OfflineSection } from "@/components/OfflineSection";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Réglages — CoranProFree" },
      { name: "description", content: "Langue, récitateur, taille du texte et sources de CoranProFree." },
      { property: "og:title", content: "Réglages — CoranProFree" },
      { property: "og:description", content: "Personnalisez votre lecture du Coran." },
    ],
  }),
  component: SettingsPage,
});

const chip = (on: boolean) => `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`;

function SettingsPage() {
  const { t, num, lang } = useT();
  const st = useStore((s) => s);
  const p = usePlayer();
  return (
    <div>
      <PageHeader title={t("settings")} />
      <div className="space-y-8 px-5">
        <Section title={t("language")}>
          {LANGS.map((l) => <button key={l.id} className={chip(st.lang === l.id)} onClick={() => setState(() => ({ lang: l.id }))}>{l.label}</button>)}
        </Section>
        <Section title={t("reciter")}>
          {RECITERS.map((r) => <button key={r.id} className={chip(st.reciter === r.id)} onClick={() => setState(() => ({ reciter: r.id }))}>{lang === "ar" ? r.ar : r.name}</button>)}
        </Section>
        <Section title={t("speed")}>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => <button key={v} className={chip(p.speed === v)} onClick={() => p.setSpeed(v)}>{num(v)}×</button>)}
        </Section>
        <Section title={t("repeat")}>
          {(["off", "ayah", "surah"] as const).map((r) => <button key={r} className={chip(p.repeat === r)} onClick={() => p.setRepeat(r)}>{t(r === "off" ? "repeatOff" : r === "ayah" ? "repeatAyah" : "repeatSurah")}</button>)}
        </Section>
        <Section title={t("fontSize")}>
          <input type="range" min={22} max={48} value={st.fontSize} onChange={(e) => setState(() => ({ fontSize: Number(e.target.value) }))} className="w-full accent-primary" aria-label={t("fontSize")} />
          <p dir="rtl" className="font-quran w-full text-right" style={{ fontSize: st.fontSize }}>ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ</p>
        </Section>
        {TRANSLATIONS[lang] && (
          <label className="flex items-center justify-between rounded-2xl border bg-card p-4">
            <span className="font-medium">{t("translation")}</span>
            <input type="checkbox" checked={st.showTranslation} onChange={(e) => setState(() => ({ showTranslation: e.target.checked }))} className="h-5 w-5 accent-primary" />
          </label>
        )}
        <OfflineSection />
        <Section title={t("stats")}>
          <p className="text-sm text-muted-foreground">{num(st.stats.sessions)} {t("sessions")} · {num(st.stats.surahsOpened.length)} {t("opened")}</p>
        </Section>
        <Section title={t("sources")}>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Texte arabe : Tanzil Project — Uthmani (tanzil.net)</li>
            <li>Traductions : {TRANSLATIONS.fr!.name}, {TRANSLATIONS.en!.name}</li>
            <li>Audio & API : Islamic Network (alquran.cloud)</li>
          </ul>
        </Section>
        <div className="rounded-2xl bg-muted p-4 text-sm">
          <p>{t("privacy")}</p>
          <button className="mt-2 font-semibold text-destructive" onClick={() => setState(() => ({ ...defaultState, lang: st.lang }))}>{t("clearData")}</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}
