import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useT } from "@/lib/i18n";
import { setState, useStore } from "@/lib/store";
import { editionQuery, runSearch, searchEdition, surah, surahName } from "@/lib/quran";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Recherche dans le Coran — CoranProFree" },
      { name: "description", content: "Recherchez un mot dans la traduction du Coran." },
      { property: "og:title", content: "Recherche — CoranProFree" },
      { property: "og:description", content: "Recherchez un mot dans la traduction du Coran." },
    ],
  }),
  component: SearchPage,
});

function highlight(text: string, q: string) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0 || !q) return text;
  return <>{text.slice(0, i)}<mark className="rounded bg-gold/30 text-foreground">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

function SearchPage() {
  const { t, lang, num } = useT();
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const history = useStore((s) => s.searchHistory);
  useEffect(() => { const id = setTimeout(() => setQ(input.trim()), 300); return () => clearTimeout(id); }, [input]);
  useEffect(() => {
    if (q.length > 1) setState((s) => ({ searchHistory: [q, ...s.searchHistory.filter((h) => h !== q)].slice(0, 8) }));
  }, [q]);
  const ed = searchEdition(q, lang);
  const idx = useQuery({ ...editionQuery(ed), enabled: q.length > 1 });
  const data = useMemo(() => (idx.data && q.length > 1 ? runSearch(idx.data, q) : undefined), [idx.data, q]);
  const r = { isFetching: idx.isFetching && !idx.data, isError: idx.isError, data };
  return (
    <div>
      <PageHeader title={t("search")}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("searchPh")} aria-label={t("searchPh")} autoFocus
          className="mt-4 w-full rounded-xl border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </PageHeader>
      <div className="px-5">
        {q.length <= 2 && history.length > 0 && (
          <>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("recent")}</p>
            <div className="flex flex-wrap gap-2">
              {history.map((h) => <button key={h} onClick={() => setInput(h)} className="rounded-full border bg-card px-3 py-1.5 text-sm">{h}</button>)}
            </div>
          </>
        )}
        {q.length <= 2 && history.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">{t("searchHint")}</p>
        )}
        {r.isFetching && <p className="py-8 text-center text-muted-foreground">{t("loading")}</p>}
        {r.isError && <p className="py-8 text-center text-muted-foreground">{t("error")}</p>}
        {r.data && !r.isFetching && (r.data.length === 0
          ? <p className="py-8 text-center text-muted-foreground">{t("noResults")}</p>
          : <ul className="divide-y">{r.data.map((h) => (
              <li key={`${h.s}:${h.a}`}>
                <Link to="/surah/$id" params={{ id: String(h.s) }} hash={`a${h.a}`} className="block py-4">
                  <div className="text-xs font-semibold text-primary">{surahName(surah(h.s), lang)} · {num(h.s)}:{num(h.a)}</div>
                  <p className="mt-1 text-sm leading-relaxed" dir={lang === "ar" ? "rtl" : "ltr"}>{highlight(h.text, q)}</p>
                </Link>
              </li>))}
            </ul>)}
      </div>
    </div>
  );
}
