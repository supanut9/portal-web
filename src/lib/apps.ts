import { env } from "./env";

export type LauncherApp = {
  id: "community" | "knowledge" | "language" | "macro";
  name: string;
  tagline: string;
  href: string;
  silentSsoUrl: string;
  accent: string;
};

export function getLauncherApps(): LauncherApp[] {
  return [
    {
      id: "community",
      name: "Community",
      tagline: "Spaces, channels, and live chat.",
      href: env.communityWebBaseUrl,
      silentSsoUrl: new URL("/api/auth/silent", env.communityWebBaseUrl).toString(),
      accent: "from-indigo-500 to-violet-500",
    },
    {
      id: "knowledge",
      name: "Knowledge",
      tagline: "Notes, docs, and references.",
      href: env.knowledgeWebBaseUrl,
      silentSsoUrl: new URL("/api/auth/silent", env.knowledgeWebBaseUrl).toString(),
      accent: "from-emerald-500 to-teal-500",
    },
    {
      id: "macro",
      name: "Macro",
      tagline: "Releases, curves, inflation, sectors.",
      href: env.macroWebBaseUrl,
      silentSsoUrl: new URL("/api/auth/silent", env.macroWebBaseUrl).toString(),
      accent: "from-violet-500 to-sky-500",
    },
    {
      id: "language",
      name: "Language",
      tagline: "Practice and coach sessions.",
      href: env.languageWebBaseUrl,
      silentSsoUrl: new URL("/api/auth/silent", env.languageWebBaseUrl).toString(),
      accent: "from-rose-500 to-orange-500",
    },
  ];
}
