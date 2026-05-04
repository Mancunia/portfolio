import type { PortfolioData } from "./types";

// ── identity ─────────────────────────────────────────────────────────────────
// Set these in .env.local (copy .env.example to get started).
export const OWNER_NAME      = process.env.NEXT_PUBLIC_OWNER_NAME      ?? "Your Name";
export const OWNER_TITLE     = process.env.NEXT_PUBLIC_OWNER_TITLE     ?? "Your title";
export const OWNER_LOCATION  = process.env.NEXT_PUBLIC_OWNER_LOCATION  ?? "City · remote";
export const OWNER_EMAIL     = process.env.NEXT_PUBLIC_OWNER_EMAIL     ?? "";
export const OWNER_BLURB     = process.env.NEXT_PUBLIC_OWNER_BLURB     ?? "";
export const PORTRAIT_TONE   = process.env.NEXT_PUBLIC_PORTRAIT_TONE   ?? "#3a4a4a";

export const GITHUB_HANDLE   = process.env.NEXT_PUBLIC_GITHUB_HANDLE   ?? "";
export const GITHUB_URL      = process.env.NEXT_PUBLIC_GITHUB_URL      ?? "";
export const LINKEDIN_HANDLE = process.env.NEXT_PUBLIC_LINKEDIN_HANDLE ?? "";
export const LINKEDIN_URL    = process.env.NEXT_PUBLIC_LINKEDIN_URL    ?? "";

// ── site metadata ─────────────────────────────────────────────────────────────
export const SITE_TITLE       = process.env.NEXT_PUBLIC_SITE_TITLE       ?? `${OWNER_NAME} — Portfolio`;
export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? `${OWNER_TITLE} · ${OWNER_LOCATION}`;

// ── fallback data (used when Supabase is not configured) ──────────────────────
// Structured content (projects, experience, writing) lives in Supabase.
// Only identity fields are seeded here so the page renders without a database.
export const FALLBACK_DATA: PortfolioData = {
  profile: {
    name:         OWNER_NAME,
    title:        OWNER_TITLE,
    location:     OWNER_LOCATION,
    blurb:        OWNER_BLURB,
    portrait:     "",
    portraitTone: PORTRAIT_TONE,
    email:        OWNER_EMAIL,
  },
  social: [
    ...(GITHUB_HANDLE   ? [{ id: "s1", label: "GitHub",   handle: GITHUB_HANDLE,   url: GITHUB_URL   }] : []),
    ...(LINKEDIN_HANDLE ? [{ id: "s2", label: "LinkedIn", handle: LINKEDIN_HANDLE, url: LINKEDIN_URL }] : []),
  ],
  skills:     {},
  projects:   [],
  experience: [],
  writing:    [],
};
