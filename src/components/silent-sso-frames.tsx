"use client";

import { useEffect, useState } from "react";

import type { LauncherApp } from "@/lib/apps";

type Status = "pending" | "ok" | "unauth" | "error";

type Props = {
  apps: Pick<LauncherApp, "id" | "silentSsoUrl">[];
  onStatusChange?: (id: LauncherApp["id"], status: Status) => void;
};

type FrameMessage = {
  source: "portal-silent-sso";
  app: LauncherApp["id"];
  status: "ok" | "unauth" | "error";
};

function isFrameMessage(data: unknown): data is FrameMessage {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return d.source === "portal-silent-sso" && typeof d.app === "string" && typeof d.status === "string";
}

export function SilentSSOFrames({ apps, onStatusChange }: Props) {
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(apps.map((a) => [a.id, "pending" as Status])),
  );

  useEffect(() => {
    function handle(event: MessageEvent) {
      if (!isFrameMessage(event.data)) return;
      setStatuses((prev) => ({ ...prev, [event.data.app]: event.data.status }));
      onStatusChange?.(event.data.app, event.data.status);
    }
    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, [onStatusChange]);

  return (
    <div aria-hidden className="absolute size-0 overflow-hidden">
      {apps.map((app) => (
        <iframe
          key={app.id}
          title={`silent-sso-${app.id}`}
          src={app.silentSsoUrl}
          sandbox="allow-scripts allow-same-origin allow-forms"
          // status is reported via postMessage; statuses[app.id] is local-only and reserved for future UI feedback
          data-status={statuses[app.id]}
        />
      ))}
    </div>
  );
}
