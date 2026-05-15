import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth, authProviderID } from "@/lib/better-auth";
import { env } from "@/lib/env";

function toHeaderInit(input: Headers): HeadersInit {
  return Array.from(input.entries());
}

function safeReturnTo(value: string | null): string {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"));
  const callbackURL = new URL(returnTo, env.portalWebBaseUrl).toString();
  const errorCallbackURL = new URL(returnTo, env.portalWebBaseUrl);
  errorCallbackURL.searchParams.set("error", "auth_failed");

  const result = await auth.api.signInWithOAuth2({
    headers: toHeaderInit(await headers()),
    body: {
      providerId: authProviderID,
      callbackURL,
      errorCallbackURL: errorCallbackURL.toString(),
    },
  });

  return NextResponse.redirect(result.url);
}
