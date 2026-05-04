import { createClient } from "@supabase/supabase-js";
import type { PortfolioData } from "./types";
import { OWNER_NAME, OWNER_TITLE, OWNER_LOCATION, PORTRAIT_TONE } from "./site.config";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars are not set");
  return createClient(url, key);
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const db = getServiceClient();

  const [
    { data: profiles },
    { data: social },
    { data: skills },
    { data: projects },
    { data: experience },
    { data: writing },
  ] = await Promise.all([
    db.from("portfolio_profile").select("*").limit(1).single(),
    db.from("portfolio_social").select("*").order("sort_order"),
    db.from("portfolio_skills").select("*").order("sort_order"),
    db.from("portfolio_projects").select("*").order("sort_order"),
    db.from("portfolio_experience").select("*").order("sort_order"),
    db.from("portfolio_writing").select("*").order("sort_order"),
  ]);

  const profile = profiles as Record<string, string> | null;

  // Group skills by group_name
  const skillGroups: Record<string, string[]> = {};
  for (const s of (skills ?? []) as Array<{ group_name: string; skill_name: string }>) {
    if (!skillGroups[s.group_name]) skillGroups[s.group_name] = [];
    skillGroups[s.group_name].push(s.skill_name);
  }

  return {
    profile: {
      name: profile?.name ?? OWNER_NAME,
      title: profile?.title ?? OWNER_TITLE,
      location: profile?.location ?? OWNER_LOCATION,
      blurb: profile?.blurb ?? "",
      portrait: profile?.portrait_url ?? "",
      portraitTone: profile?.portrait_tone ?? PORTRAIT_TONE,
      email: profile?.email ?? "",
    },
    social: ((social ?? []) as Array<{ id: string; label: string; handle: string; url: string }>).map(
      (s) => ({ id: s.id, label: s.label, handle: s.handle, url: s.url })
    ),
    skills: skillGroups,
    projects: ((projects ?? []) as Array<{
      id: string; initials: string; tone: string; title: string; role: string;
      year: string; summary: string; stack: string[]; status: string;
      live_url: string; repo_url: string;
    }>).map((p) => ({
      id: p.id,
      initials: p.initials,
      tone: p.tone,
      title: p.title,
      role: p.role,
      year: p.year,
      summary: p.summary,
      stack: p.stack,
      status: p.status,
      liveUrl: p.live_url,
      repoUrl: p.repo_url,
    })),
    experience: ((experience ?? []) as Array<{
      id: string; company: string; role: string; period: string; note: string;
    }>).map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      period: e.period,
      note: e.note,
    })),
    writing: ((writing ?? []) as Array<{
      id: string; title: string; date_display: string; read_time: string;
    }>).map((w) => ({
      id: w.id,
      title: w.title,
      date: w.date_display,
      read: w.read_time,
    })),
  };
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const db = getServiceClient();

  // Update profile
  await db.from("portfolio_profile").update({
    name: data.profile.name,
    title: data.profile.title,
    location: data.profile.location,
    blurb: data.profile.blurb,
    portrait_url: data.profile.portrait,
    portrait_tone: data.profile.portraitTone,
    email: data.profile.email,
    updated_at: new Date().toISOString(),
  }).neq("id", "00000000-0000-0000-0000-000000000000");

  // Replace social links
  await db.from("portfolio_social").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (data.social.length > 0) {
    await db.from("portfolio_social").insert(
      data.social.map((s, i) => ({ label: s.label, handle: s.handle, url: s.url, sort_order: i }))
    );
  }

  // Replace skills
  await db.from("portfolio_skills").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const skillRows: Array<{ group_name: string; skill_name: string; sort_order: number }> = [];
  for (const [group, list] of Object.entries(data.skills)) {
    for (const [i, skill] of list.entries()) {
      skillRows.push({ group_name: group, skill_name: skill, sort_order: i });
    }
  }
  if (skillRows.length > 0) await db.from("portfolio_skills").insert(skillRows);

  // Upsert projects
  await db.from("portfolio_projects").delete().neq("id", "");
  if (data.projects.length > 0) {
    await db.from("portfolio_projects").insert(
      data.projects.map((p, i) => ({
        id: p.id,
        initials: p.initials,
        tone: p.tone,
        title: p.title,
        role: p.role,
        year: p.year,
        summary: p.summary,
        stack: p.stack,
        status: p.status,
        live_url: p.liveUrl,
        repo_url: p.repoUrl,
        sort_order: i,
      }))
    );
  }

  // Upsert experience
  await db.from("portfolio_experience").delete().neq("id", "");
  if (data.experience.length > 0) {
    await db.from("portfolio_experience").insert(
      data.experience.map((e, i) => ({
        id: e.id,
        company: e.company,
        role: e.role,
        period: e.period,
        note: e.note,
        sort_order: i,
      }))
    );
  }

  // Upsert writing
  await db.from("portfolio_writing").delete().neq("id", "");
  if (data.writing.length > 0) {
    await db.from("portfolio_writing").insert(
      data.writing.map((w, i) => ({
        id: w.id,
        title: w.title,
        date_display: w.date,
        read_time: w.read,
        sort_order: i,
      }))
    );
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) throw new Error("ADMIN_PASSWORD_HASH is not set");
  const bcrypt = await import("bcryptjs");
  console.log("passwords", { password, hash });
  return bcrypt.compare(password, hash);
}
