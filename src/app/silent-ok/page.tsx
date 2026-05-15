"use client";

import { useEffect } from "react";

function parentOrigin(): string {
  try {
    if (document.referrer) {
      return new URL(document.referrer).origin;
    }
  } catch {
    // fall through
  }
  return window.location.origin;
}

export default function SilentOk() {
  useEffect(() => {
    window.parent?.postMessage(
      { source: "portal-silent-sso", app: "portal", status: "ok" },
      parentOrigin(),
    );
  }, []);
  return null;
}
