function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  authServerBaseUrl: requireEnv("AUTH_SERVER_BASE_URL", "http://localhost:8050"),
  portalWebBaseUrl: requireEnv("PORTAL_WEB_BASE_URL", "http://localhost:3009"),
  portalApiBaseUrl: requireEnv("PORTAL_API_BASE_URL", "http://localhost:8080"),
  oidcClientId: requireEnv("OIDC_CLIENT_ID", "portal-web"),
  oidcClientSecret: requireEnv("OIDC_CLIENT_SECRET", "portal-web-secret"),
  oidcScope: requireEnv("OIDC_SCOPE", "openid email profile offline_access"),
  communityWebBaseUrl: requireEnv("NEXT_PUBLIC_COMMUNITY_WEB_BASE_URL", "http://localhost:3006"),
  knowledgeWebBaseUrl: requireEnv("NEXT_PUBLIC_KNOWLEDGE_WEB_BASE_URL", "http://localhost:3007"),
  languageWebBaseUrl: requireEnv("NEXT_PUBLIC_LANGUAGE_WEB_BASE_URL", "http://localhost:3008"),
  macroWebBaseUrl: requireEnv("NEXT_PUBLIC_MACRO_WEB_BASE_URL", "http://localhost:3013"),
  betterAuthSecret: requireEnv(
    "BETTER_AUTH_SECRET",
    process.env.SESSION_COOKIE_SECRET ?? "change-me-to-a-long-random-string",
  ),
};
