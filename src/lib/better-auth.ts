import { randomBytes } from "node:crypto";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

import { env } from "./env";

const providerID = "auth-server";
const sessionMaxAgeSeconds = 7 * 24 * 60 * 60;

type UserInfoPayload = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export function parseUserInfoResponse(rawBody: string): UserInfoPayload {
  if (!rawBody.trim()) {
    throw new Error("userinfo_empty_body");
  }
  try {
    return JSON.parse(rawBody) as UserInfoPayload;
  } catch {
    throw new Error("userinfo_invalid_json");
  }
}

export async function loadUserInfo(accessToken: string) {
  const response = await fetch(new URL("/v1/oidc/userinfo", env.authServerBaseUrl), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`userinfo_failed:${response.status}`);
  }

  const payload = parseUserInfoResponse(await response.text());

  return {
    id: payload.sub,
    email: payload.email ?? `${payload.sub}@local.invalid`,
    emailVerified: payload.email_verified ?? false,
    name: payload.name ?? payload.email ?? payload.sub,
    image: payload.picture,
    ...payload,
  };
}

function requireToken(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`missing_${name}`);
  }
  return value;
}

function randomNonce(): string {
  return randomBytes(16).toString("base64url");
}

export const auth = betterAuth({
  appName: "portal-web",
  baseURL: env.portalWebBaseUrl,
  basePath: "/api/auth",
  secret: env.betterAuthSecret,
  database: undefined,
  advanced: {
    cookiePrefix: "portal-auth",
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  session: {
    expiresIn: sessionMaxAgeSeconds,
    updateAge: 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: sessionMaxAgeSeconds,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: providerID,
          clientId: env.oidcClientId,
          clientSecret: env.oidcClientSecret,
          discoveryUrl: new URL("/.well-known/openid-configuration", env.authServerBaseUrl).toString(),
          scopes: env.oidcScope.split(/\s+/).filter(Boolean),
          pkce: true,
          authorizationUrlParams: () => ({
            nonce: randomNonce(),
          }),
          getUserInfo: async (tokens) =>
            loadUserInfo(requireToken(tokens.accessToken, "access_token")),
          mapProfileToUser: async (profile) => ({
            id: String(profile.sub ?? profile.id),
            email: profile.email,
            emailVerified: Boolean(profile.email_verified ?? profile.emailVerified),
            name: String(profile.name ?? profile.email ?? profile.sub ?? profile.id),
            image: typeof profile.picture === "string" ? profile.picture : profile.image,
          }),
        },
      ],
    }),
    nextCookies(),
  ],
});

export const authProviderID = providerID;
