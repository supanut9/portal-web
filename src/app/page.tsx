import Link from "next/link";

import { AppCard } from "@/components/app-card";
import { SilentSSOFrames } from "@/components/silent-sso-frames";
import { getLauncherApps } from "@/lib/apps";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await readSession();
  const apps = getLauncherApps();

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-semibold">Portal</h1>
          <p className="max-w-md text-[var(--muted-foreground)]">
            One sign-in for every app on the platform.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[var(--muted-foreground)]">
            Signed in as {session.profile.email ?? session.profile.sub}
          </span>
          <h1 className="text-2xl font-semibold">Your apps</h1>
        </div>
        <Link
          href="/auth/logout/global"
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)] transition hover:text-white"
        >
          Sign out
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </section>

      <SilentSSOFrames apps={apps.map(({ id, silentSsoUrl }) => ({ id, silentSsoUrl }))} />
    </main>
  );
}
