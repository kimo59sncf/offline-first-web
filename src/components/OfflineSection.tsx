import { useEffect, useRef, useState } from "react";
import { Download, Smartphone, Trash2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { clearSavedData, countSavedSurahs, offlineSupported, saveAllSurahs, useInstallPrompt, useOnline } from "@/lib/offline";

export function OfflineSection() {
  const { t, num } = useT();
  const lang = useStore((s) => s.lang);
  const reciter = useStore((s) => s.reciter);
  const online = useOnline();
  const { canInstall, installed, install } = useInstallPrompt();
  const [saved, setSaved] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [supported, setSupported] = useState(false);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    setSupported(offlineSupported());
    countSavedSurahs(lang, reciter).then(setSaved).catch(() => {});
  }, [lang, reciter]);
  useEffect(() => () => abort.current?.abort(), []);

  const save = async () => {
    setBusy(true); setErr(false);
    abort.current = new AbortController();
    try {
      await saveAllSurahs(lang, reciter, () => {}, abort.current.signal);
    } catch {
      setErr(true);
    }
    setSaved(await countSavedSurahs(lang, reciter));
    setBusy(false);
  };

  const pct = Math.round((saved / 114) * 100);
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{t("offlineTitle")}</h2>
      <div className="space-y-3 rounded-2xl border bg-card p-4">
        {installed ? (
          <p className="flex items-center gap-2 text-sm font-medium text-primary"><Smartphone className="h-4 w-4" />{t("installed")}</p>
        ) : canInstall ? (
          <button onClick={install} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Smartphone className="h-4 w-4" />{t("install")}
          </button>
        ) : (
          <p className="text-xs text-muted-foreground">{t("installHint")}</p>
        )}
        {supported && (
          <>
            <div>
              <div className="mb-1 flex justify-between text-sm"><span>{num(saved)} / {num(114)} {t("saved")}</span><span>{num(pct)}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
            </div>
            {err && <p className="text-xs text-destructive">{t("error")}</p>}
            <div className="flex flex-wrap gap-2">
              {saved < 114 && (
                <button disabled={busy || !online} onClick={save} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-50">
                  <Download className="h-4 w-4" />{busy ? t("saving") : t("saveAll")}
                </button>
              )}
              {saved > 0 && !busy && (
                <button onClick={async () => { await clearSavedData(); setSaved(0); }} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-destructive">
                  <Trash2 className="h-4 w-4" />{t("clearOffline")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
