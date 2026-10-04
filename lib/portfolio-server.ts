import type { PortfolioData } from "./types";
import { getDb } from "./db";
import { toPublicUrl, toStoredRef } from "./storage";
import { OWNER_NAME, OWNER_TITLE, OWNER_LOCATION, PORTRAIT_TONE } from "./site.config";

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const sql = getDb();

  const [profiles, social, skills, projects, experience, writing] = await Promise.all([
    sql`select * from portfolio_profile limit 1`,
    sql`select * from portfolio_social order by sort_order`,
    sql`select * from portfolio_skills order by sort_order`,
    sql`select * from portfolio_projects order by sort_order`,
    sql`select * from portfolio_experience order by sort_order`,
    sql`select * from portfolio_writing order by sort_order`,
  ]);

  const profile = profiles[0] as Record<string, string> | undefined;

  // Group skills by group_name
  const skillGroups: Record<string, string[]> = {};
  for (const s of skills as Array<{ group_name: string; skill_name: string }>) {
    if (!skillGroups[s.group_name]) skillGroups[s.group_name] = [];
    skillGroups[s.group_name].push(s.skill_name);
  }

  return {
    profile: {
      name: profile?.name ?? OWNER_NAME,
      title: profile?.title ?? OWNER_TITLE,
      location: profile?.location ?? OWNER_LOCATION,
      blurb: profile?.blurb ?? "",
      portrait: toPublicUrl(profile?.portrait_url ?? ""),
      portraitTone: profile?.portrait_tone ?? PORTRAIT_TONE,
      email: profile?.email ?? "",
    },
    social: (social as Array<{ id: string; label: string; handle: string; url: string }>).map(
      (s) => ({ id: s.id, label: s.label, handle: s.handle, url: s.url })
    ),
    skills: skillGroups,
    projects: (projects as Array<{
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
    experience: (experience as Array<{
      id: string; company: string; role: string; period: string; note: string;
    }>).map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      period: e.period,
      note: e.note,
    })),
    writing: (writing as Array<{
      id: string; title: string; date_display: string; read_time: string;
    }>).map((w) => ({
      id: w.id,
      title: w.title,
      date: w.date_display,
      read: w.read_time,
    })),
  };
}

// Replaces all portfolio content in one transaction, so a failed insert
// rolls everything back instead of leaving a section empty.
export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const sql = getDb();
  const p = data.profile;
  const portrait = toStoredRef(p.portrait);

  const skillRows: Array<{ group: string; skill: string; order: number }> = [];
  for (const [group, list] of Object.entries(data.skills)) {
    for (const [i, skill] of list.entries()) skillRows.push({ group, skill, order: i });
  }

  await sql.transaction([
    // Update the single profile row, or create it on an empty database
    sql`
      with updated as (
        update portfolio_profile set
          name = ${p.name}, title = ${p.title}, location = ${p.location}, blurb = ${p.blurb},
          portrait_url = ${portrait}, portrait_tone = ${p.portraitTone}, email = ${p.email},
          updated_at = now()
        returning id
      )
      insert into portfolio_profile (name, title, location, blurb, portrait_url, portrait_tone, email)
      select ${p.name}, ${p.title}, ${p.location}, ${p.blurb}, ${portrait}, ${p.portraitTone}, ${p.email}
      where not exists (select 1 from updated)`,

    sql`delete from portfolio_social`,
    ...data.social.map((s, i) => sql`
      insert into portfolio_social (label, handle, url, sort_order)
      values (${s.label}, ${s.handle}, ${s.url}, ${i})`),

    sql`delete from portfolio_skills`,
    ...skillRows.map((s) => sql`
      insert into portfolio_skills (group_name, skill_name, sort_order)
      values (${s.group}, ${s.skill}, ${s.order})`),

    sql`delete from portfolio_projects`,
    ...data.projects.map((pr, i) => sql`
      insert into portfolio_projects
        (id, initials, tone, title, role, year, summary, stack, status, live_url, repo_url, sort_order)
      values (${pr.id}, ${pr.initials}, ${pr.tone}, ${pr.title}, ${pr.role}, ${pr.year}, ${pr.summary},
        ${pr.stack}, ${pr.status}, ${pr.liveUrl}, ${pr.repoUrl}, ${i})`),

    sql`delete from portfolio_experience`,
    ...data.experience.map((e, i) => sql`
      insert into portfolio_experience (id, company, role, period, note, sort_order)
      values (${e.id}, ${e.company}, ${e.role}, ${e.period}, ${e.note}, ${i})`),

    sql`delete from portfolio_writing`,
    ...data.writing.map((w, i) => sql`
      insert into portfolio_writing (id, title, date_display, read_time, sort_order)
      values (${w.id}, ${w.title}, ${w.date}, ${w.read}, ${i})`),
  ]);
}
