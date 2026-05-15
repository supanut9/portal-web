import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { clearSessionHeaders } from "@/lib/session";

export async function GET() {
  const url = new URL("/v1/auth/logout/global", env.authServerBaseUrl);
  url.searchParams.set("post_logout_redirect_uri", `${env.portalWebBaseUrl}/`);
  const response = NextResponse.redirect(url);
  const headers = await clearSessionHeaders();
  const setCookie = headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }
  return response;
}
