import { fetchPortfolioData } from "@/lib/supabase-server";
import { Portfolio } from "@/components/Portfolio";
import type { PortfolioData } from "@/lib/types";

// Revalidate every 60 seconds so content stays fresh without a full rebuild
export const revalidate = 60;

const FALLBACK_DATA: PortfolioData = {
  profile: {
    name: "Emmanuel Osei Mensah",
    title: "Full-stack engineer",
    location: "Accra · remote",
    blurb:
      "I build durable, well-considered web products end-to-end — from data model and API surface to interface and motion. Currently focused on developer-facing tools and quiet interfaces that disappear into the work.",
    portrait: "",
    portraitTone: "#3a4a4a",
    email: "mancuniamoe@gmail.com",
  },
  social: [
    { id: "s1", label: "GitHub",   handle: "eoseim",    url: "#" },
    { id: "s2", label: "LinkedIn", handle: "in/eoseim", url: "#" },
  ],
  skills: {
    Languages: ["TypeScript", "Python", "Go", "SQL", "Rust"],
    Frontend:  ["React", "Next.js", "Svelte", "Tailwind", "Framer Motion"],
    Backend:   ["Node.js", "FastAPI", "PostgreSQL", "Redis", "GraphQL"],
    Infra:     ["Docker", "AWS", "Terraform", "GitHub Actions", "Cloudflare"],
    Practice:  ["Systems design", "API design", "Design engineering", "Code review"],
  },
  projects: [
    { id: "p1", initials: "LD", tone: "#3a4a3f", title: "Ledgerly", role: "Tech lead", year: "2025", summary: "Multi-tenant accounting ledger with double-entry semantics and an audit-grade event log.", stack: ["TypeScript", "PostgreSQL", "Next.js", "tRPC", "Stripe"], status: "Shipping", liveUrl: "", repoUrl: "" },
    { id: "p2", initials: "OR", tone: "#5b3f4a", title: "Orbit Routes", role: "Founding engineer", year: "2025", summary: "Logistics planner for last-mile delivery teams. Real-time route optimization with offline-first PWAs.", stack: ["React", "Go", "Mapbox", "Redis", "AWS"], status: "Active", liveUrl: "", repoUrl: "" },
    { id: "p3", initials: "FN", tone: "#3d4a5b", title: "Fern Notes", role: "Solo build", year: "2024", summary: "Local-first markdown editor with bidirectional links, sync over CRDTs, end-to-end encryption.", stack: ["Rust", "Tauri", "Yjs", "Svelte"], status: "Beta", liveUrl: "", repoUrl: "" },
  ],
  experience: [
    { id: "e1", company: "Ledgerly",     role: "Tech lead",         period: "2024 — Now",  note: "Leading platform engineering for a Series A accounting startup." },
    { id: "e2", company: "Marsh Studio", role: "Frontend lead",     period: "2022 — 2024", note: "Owned the rendering pipeline and collaborative editing layer until acquisition." },
    { id: "e3", company: "Independent",  role: "Contract engineer", period: "2020 — 2022", note: "Shipped products for fintech, logistics and maritime clients across three continents." },
    { id: "e4", company: "Paystack",     role: "Software engineer", period: "2018 — 2020", note: "Payments infrastructure on the disbursements team." },
  ],
  writing: [
    { id: "w1", title: "On building durable interfaces",            date: "Mar 2026", read: "8 min" },
    { id: "w2", title: "Local-first is a stance, not a stack",       date: "Jan 2026", read: "12 min" },
    { id: "w3", title: "Why I rewrote my editor in Rust (and back)", date: "Sep 2025", read: "15 min" },
  ],
};

export default async function HomePage() {
  let data: PortfolioData;

  try {
    data = await fetchPortfolioData();
  } catch {
    // Supabase not configured yet — serve fallback so the app renders
    data = FALLBACK_DATA;
  }

  return <Portfolio initialData={data} />;
}
