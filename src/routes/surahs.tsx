import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { SURAHS, normalize } from "@/lib/quran";
import { PageHeader, SurahRow } from "@/components/AppShell";

export const Route = createFileRoute("/surahs")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Les 114 sourates — CoranProFree" },
      { name: "description", content: "Liste complète des 114 sourates du Coran avec nom arabe, translittération et nombre de versets." },
      { property: "og:title", content: "Les 114 sourates — CoranProFree" },
      { property: "og:description", content: "Parcourez les 114 sourates du Coran." },
    ],
  }),
  component: Surahs,
});

function Surahs() {
  const { t } = useT();
  const [q, setQ] = useState("");
  const f = normalize(q.trim());
  const list = SURAHS.filter((s) => !f || String(s.n) === f || normalize(`${s.tr} ${s.en} ${s.ar}`).includes(f));
  return (
    <div>
      <PageHeader title={t("surahs")}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchSurahPh")} aria-label={t("searchSurahPh")}
          className="mt-4 w-full rounded-xl border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </PageHeader>
      <div className="px-1">
        {list.map((s) => <SurahRow key={s.n} n={s.n} />)}
        {!list.length && <p className="p-8 text-center text-muted-foreground">{t("noResults")}</p>}
      </div>
    </div>
  );
}
