"use client";

type SyncStatus = "loading" | "ready" | "saving" | "error";

interface SyncBadgeProps {
  status: SyncStatus;
}

const STATUS_MAP: Record<SyncStatus, { label: string; color: string }> = {
  loading: { label: "Loading…",  color: "var(--fg-3)" },
  ready:   { label: "Synced",    color: "oklch(0.62 0.12 145)" },
  saving:  { label: "Saving…",   color: "oklch(0.7 0.13 75)" },
  error:   { label: "Offline",   color: "oklch(0.6 0.18 25)" },
};

export function SyncBadge({ status }: SyncBadgeProps) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.ready;
  return (
    <span className="sync-badge">
      <span className="sync-badge__dot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}
