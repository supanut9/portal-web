import { headers } from "next/headers";

import type { AppSession } from "./auth";
import { auth, authProviderID, loadUserInfo } from "./better-auth";

function toHeaderInit(input: Headers): HeadersInit {
  return Array.from(input.entries());
}

export async function readSession(): Promise<AppSession | null> {
  const requestHeaders = toHeaderInit(await headers());
  let session;
  try {
    session = await auth.api.getSession({ headers: requestHeaders });
  } catch (err) {
    console.error("[portal-web readSession] getSession threw:", err);
    return null;
  }
  if (!session) {
    console.log("[portal-web readSession] getSession returned null");
    return null;
  }

  let account;
  try {
    account = await auth.api.getAccessToken({
      headers: requestHeaders,
      body: { providerId: authProviderID },
    });
  } catch (err) {
    console.error("[portal-web readSession] getAccessToken threw:", err);
    return null;
  }

  let profile;
  try {
    profile = await loadUserInfo(account.accessToken);
  } catch (err) {
    console.error(
      "[portal-web readSession] loadUserInfo threw (token expiresAt=",
      account.accessTokenExpiresAt,
      "):",
      err,
    );
    return null;
  }

  return {
    accessToken: account.accessToken,
    accessTokenExpiresAt: account.accessTokenExpiresAt?.toISOString() ?? new Date().toISOString(),
    idToken: account.idToken ?? "",
    scope: account.scopes.join(" "),
    profile: {
      sub: profile.sub,
      email: profile.email,
      email_verified: profile.email_verified,
      name: profile.name,
      picture: profile.picture,
    },
  };
}

export async function clearSessionHeaders(): Promise<Headers> {
  const result = await auth.api.signOut({
    headers: toHeaderInit(await headers()),
    returnHeaders: true,
  });
  return result.headers;
}
