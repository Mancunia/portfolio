"use client";

import { useRef, useState } from "react";

interface PortraitProps {
  src: string;
  tone: string;
  name: string;
  size?: number;
  shape?: "circle" | "square";
  editing?: boolean;
  onSrcChange?: (v: string) => void;
  onToneChange?: (v: string) => void;
}

export function Portrait({
  src,
  tone,
  name,
  size = 96,
  shape = "circle",
  editing,
  onSrcChange,
  onToneChange,
}: PortraitProps) {
  const [popOpen, setPopOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase() || "—";

  const radius = shape === "circle" ? "50%" : "8px";

  return (
    <div className="portrait-wrap" style={{ width: size, height: size }}>
      <div
        className="portrait"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: src ? tone : tone,
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="portrait__img" />
        ) : (
          <>
            <span className="portrait__initials" style={{ fontSize: size * 0.3 }}>
              {initials}
            </span>
            <svg
              className="portrait__grain"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`pg-${tone.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" fill={`url(#pg-${tone.replace("#", "")})`} />
            </svg>
          </>
        )}
      </div>

      {editing && (
        <button
          className="portrait__edit"
          onClick={() => setPopOpen((o) => !o)}
          title="Edit portrait"
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 14h12M3 11l8-8 2 2-8 8H3v-2z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {editing && popOpen && (
        <div className="portrait__pop" onMouseDown={(e) => e.stopPropagation()}>
          <label>
            Upload photo
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const form = new FormData();
                form.append("file", file);
                try {
                  const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
                  const json = await res.json();
                  if (json.url) onSrcChange?.(json.url);
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ width: "100%", marginTop: 4 }}
            >
              {uploading ? "Uploading…" : "Choose file"}
            </button>
          </label>
          <label>
            or paste URL
            <input
              type="text"
              value={src ?? ""}
              placeholder="https://…"
              onChange={(e) => onSrcChange?.(e.target.value)}
            />
          </label>
          <label>
            Fallback tone
            <input
              type="color"
              value={tone ?? "#3a4a4a"}
              onChange={(e) => onToneChange?.(e.target.value)}
            />
          </label>
          <button type="button" onClick={() => setPopOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}
