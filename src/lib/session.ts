import { headers } from "next/headers";

import type { AppSession } from "./auth";
import { auth, authProviderID, loadUserInfo } from "./better-auth";

function toHeaderInit(input: Headers): HeadersInit {
  return Array.from(input.entries());
}

export async function readSession(): Promise<AppSession | null> {
  const requestHeaders = toHeaderInit(await headers());
  try {
    const session = await auth.api.getSession({ headers: requestHeaders });
    if (!session) {
      return null;
    }

    const account = await auth.api.getAccessToken({
      headers: requestHeaders,
      body: { providerId: authProviderID },
    });

    const profile = await loadUserInfo(account.accessToken);

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
  } catch (err) {
    console.error("[portal-web readSession]", err);
    return null;
  }
}

export async function clearSessionHeaders(): Promise<Headers> {
  const result = await auth.api.signOut({
    headers: toHeaderInit(await headers()),
    returnHeaders: true,
  });
  return result.headers;
}
