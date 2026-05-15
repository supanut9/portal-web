import Link from "next/link";

import type { LauncherApp } from "@/lib/apps";
import { cn } from "@/lib/utils";

export function AppCard({ app }: { app: LauncherApp }) {
  return (
    <Link
      href={app.href}
      className="group relative flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-white/20 hover:bg-[var(--muted)]"
    >
      <div
        className={cn(
          "size-12 rounded-xl bg-gradient-to-br",
          app.accent,
          "flex items-center justify-center text-lg font-semibold text-white",
        )}
      >
        {app.name[0]}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-base font-medium text-[var(--foreground)]">{app.name}</span>
        <span className="text-sm text-[var(--muted-foreground)]">{app.tagline}</span>
      </div>
    </Link>
  );
}
