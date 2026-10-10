import { CloudDownload, CloudCheck, Heart, ListPlus, ListChecks, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { favoritesOf, setState, toggleIn, toggleReciterFavorite, toggleSurah, useStore } from "@/lib/store";
import { downloadSurah, removeDownload, useDownload } from "@/lib/downloads";
import { RECITERS } from "@/lib/quran";
import { RECITER_PHOTOS } from "@/lib/reciter-photos";
import { ReciterPortrait } from "@/components/ReciterPortrait";

export function SurahActions({ n }: { n: number }) {
  const { t, lang } = useT();
  const reciter = useStore((s) => s.reciter);
  const favorite = useStore((s) => favoritesOf(s, reciter).includes(n));
  const inPlaylist = useStore((s) => s.playlist.includes(n));
  const { saved, busy } = useDownload(n, lang, reciter);
  const downloadLabel = t(busy ? "saving" : saved ? "removeDownload" : "download");
  return <div className="flex shrink-0 items-center">
    <Button size="icon" variant="ghost" title={downloadLabel} aria-label={downloadLabel} aria-pressed={saved} disabled={busy}
      className={saved ? "text-success" : "text-muted-foreground"}
      onClick={async () => { try { if (saved) await removeDownload(n, lang, reciter); else { await downloadSurah(n, lang, reciter); toast.success(t("downloadDone")); } } catch { toast.error(t("error")); } }}>
      {busy ? <LoaderCircle className="animate-spin" /> : saved ? <CloudCheck fill="currentColor" className="text-success" /> : <CloudDownload />}
    </Button>
    <Button size="icon" variant="ghost" title={t(favorite ? "removeFavorite" : "addFavorite")} aria-label={t(favorite ? "removeFavorite" : "addFavorite")} aria-pressed={favorite}
      className={favorite ? "text-favorite" : "text-muted-foreground"} onClick={() => setState((s) => toggleReciterFavorite(s, reciter, n))}>
      <Heart fill={favorite ? "currentColor" : "none"} />
    </Button>
    <Button size="icon" variant="ghost" title={t(inPlaylist ? "removePlaylist" : "addPlaylist")} aria-label={t(inPlaylist ? "removePlaylist" : "addPlaylist")} aria-pressed={inPlaylist}
      className={inPlaylist ? "text-primary" : "text-muted-foreground"} onClick={() => setState((s) => ({ playlist: toggleSurah(s.playlist, n) }))}>
      {inPlaylist ? <ListChecks /> : <ListPlus />}
    </Button>
  </div>;
}

export function ReciterPicker({ favoritesOnly = false, onSelect }: { favoritesOnly?: boolean; onSelect?: (id: string) => void }) {
  const { t, lang } = useT();
  const selected = useStore((s) => s.reciter);
  const favorites = useStore((s) => s.favoriteReciters);
  const list = RECITERS.filter((r) => !favoritesOnly || favorites.includes(r.id));
  return <div role="region" aria-label={t("reciters")} className="flex gap-3 overflow-x-auto px-1 py-2">
    {list.map((r) => {
      const favorite = favorites.includes(r.id);
      const on = selected === r.id;
      const name = lang === "ar" ? r.ar : r.name;
      return <div key={r.id} className="relative w-28 shrink-0 text-center">
        <Button variant="ghost" aria-label={name} title={name} aria-pressed={on} className="h-auto w-full flex-col gap-2 whitespace-normal p-0 hover:bg-transparent" onClick={() => { setState(() => ({ reciter: r.id })); onSelect?.(r.id); }}>
          <ReciterPortrait key={r.id} src={RECITER_PHOTOS[r.id]} name={r.name} selected={on} />
          <span className={`min-h-10 w-full text-xs leading-tight ${on ? "font-semibold text-primary" : "font-medium"}`}>{name}</span>
        </Button>
        <Button variant="outline" size="icon" aria-label={`${t(favorite ? "removeFavorite" : "addFavorite")} · ${name}`} title={t(favorite ? "removeFavorite" : "addFavorite")} aria-pressed={favorite} className={`absolute end-2 top-10 h-7 w-7 rounded-full ${favorite ? "text-favorite" : "text-muted-foreground"}`} onClick={() => setState((s) => ({ favoriteReciters: toggleIn(s.favoriteReciters, r.id) }))}><Heart fill={favorite ? "currentColor" : "none"} /></Button>
      </div>;
    })}
  </div>;
}