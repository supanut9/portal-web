import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { clearSessionHeaders } from "@/lib/session";

export async function GET() {
  const response = NextResponse.redirect(new URL("/", env.portalWebBaseUrl));
  const headers = await clearSessionHeaders();
  const setCookie = headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }
  return response;
}
