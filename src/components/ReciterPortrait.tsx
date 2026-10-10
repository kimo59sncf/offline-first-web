import { useState } from "react";

export function ReciterPortrait({ src, name, selected }: { src: string | undefined; name: string; selected: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full font-display text-xl font-semibold transition-colors ${selected ? "bg-primary text-primary-foreground ring-2 ring-gold ring-offset-2 ring-offset-background" : "bg-accent text-accent-foreground"}`} aria-hidden="true">
      {failed || !src ? name.split(" ").map((word) => word[0]).slice(0, 2).join("") : (
        <img src={src} alt="" width={64} height={64} loading="lazy" decoding="async" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </span>
  );
}