"use client";

import { useCallback, useRef, useState } from "react";
import type { PortfolioData, Project, WritingPost } from "@/lib/types";
import { Editable } from "./Editable";
import { ThemeToggle } from "./ThemeToggle";
import { SyncBadge } from "./SyncBadge";
import { Portrait } from "./Portrait";
import { LoginModal } from "./LoginModal";
import { ProjectCard, ProjectModal } from "./ProjectCard";

type SyncStatus = "loading" | "ready" | "saving" | "error";
type Stance = "engineer" | "builder";

const SKILL_HUES: Record<string, string> = {
  Languages: "oklch(0.62 0.14 30)",
  Frontend:  "oklch(0.62 0.14 240)",
  Backend:   "oklch(0.62 0.13 145)",
  Infra:     "oklch(0.62 0.13 75)",
  Practice:  "oklch(0.62 0.13 305)",
};

interface PortfolioProps {
  initialData: PortfolioData;
}

export function Portfolio({ initialData }: PortfolioProps) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("ready");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [authed, setAuthed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [stance, setStance] = useState<Stance>("engineer");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Draft state for skill group inline inputs
  const [skillDrafts, setSkillDrafts] = useState<Record<string, string>>({});
  const [newGroupDraft, setNewGroupDraft] = useState("");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const update = useCallback((mutator: (d: PortfolioData) => PortfolioData) => {
    setData((prev) => {
      const next = mutator(structuredClone(prev));
      setSyncStatus("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        fetch("/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
          credentials: "include",
        })
          .then((r) => setSyncStatus(r.ok ? "ready" : "error"))
          .catch(() => setSyncStatus("error"));
      }, 600);
      return next;
    });
  }, []);

  // ── Profile ──────────────────────────────────────────────
  const setProfile = useCallback(
    (key: keyof PortfolioData["profile"], val: string) =>
      update((d) => { d.profile[key] = val; return d; }),
    [update]
  );

  // ── Projects ─────────────────────────────────────────────
  const setProject = useCallback(
    (id: string, key: keyof Project, val: string) =>
      update((d) => {
        const p = d.projects.find((x) => x.id === id);
        if (p) Object.assign(p, { [key]: val });
        return d;
      }),
    [update]
  );

  const setProjectStack = useCallback(
    (id: string, stack: string[]) =>
      update((d) => {
        const p = d.projects.find((x) => x.id === id);
        if (p) p.stack = stack;
        return d;
      }),
    [update]
  );

  const removeProject = useCallback(
    (id: string) => update((d) => { d.projects = d.projects.filter((p) => p.id !== id); return d; }),
    [update]
  );

  const addProject = useCallback(() =>
    update((d) => {
      const num = Math.max(0, ...d.projects.map((p) => +p.id.replace("p", ""))) + 1;
      d.projects.unshift({
        id: `p${num}`,
        initials: "NN",
        tone: "#3a4a4a",
        title: "New project",
        role: "Role",
        year: String(new Date().getFullYear()),
        summary: "Short summary.",
        stack: ["Tag"],
        status: "Draft",
        liveUrl: "",
        repoUrl: "",
      });
      return d;
    }),
    [update]
  );

  // ── Skills ───────────────────────────────────────────────
  const addSkill = useCallback(
    (group: string, skill: string) =>
      update((d) => {
        if (!d.skills[group]) d.skills[group] = [];
        if (!d.skills[group].includes(skill)) d.skills[group].push(skill);
        return d;
      }),
    [update]
  );

  const removeSkill = useCallback(
    (group: string, skill: string) =>
      update((d) => {
        d.skills[group] = (d.skills[group] ?? []).filter((s) => s !== skill);
        return d;
      }),
    [update]
  );

  const addSkillGroup = useCallback(
    (group: string) =>
      update((d) => {
        if (!d.skills[group]) d.skills[group] = [];
        return d;
      }),
    [update]
  );

  const removeSkillGroup = useCallback(
    (group: string) =>
      update((d) => { delete d.skills[group]; return d; }),
    [update]
  );

  // ── Writing ──────────────────────────────────────────────
  const setWriting = useCallback(
    (id: string, key: keyof WritingPost, val: string) => {
      if (!editing) return;
      update((d) => {
        const w = d.writing.find((x) => x.id === id);
        if (w) Object.assign(w, { [key]: val });
        return d;
      });
    },
    [update, editing]
  );

  const removeWriting = useCallback(
    (id: string) => {
      if (!editing) return;
      update((d) => { d.writing = d.writing.filter((w) => w.id !== id); return d; });
    },
    [update, editing]
  );

  const addWriting = useCallback(() => {
    if (!editing) return;
    update((d) => {
      const num = Math.max(0, ...d.writing.map((w) => +w.id.replace("w", ""))) + 1;
      d.writing.unshift({
        id: `w${num}`,
        title: "New post",
        date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        read: "5 min",
      });
      return d;
    });
  }, [update, editing]);

  // ── Auth ─────────────────────────────────────────────────
  const handleSignIn = async (password: string): Promise<boolean> => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    });
    if (res.ok) {
      setAuthed(true);
      setLoginOpen(false);
      setEditing(true);
      showToast("Signed in — edits sync to DB automatically");
      return true;
    }
    return false;
  };

  const handleSignOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE", credentials: "include" });
    setAuthed(false);
    setEditing(false);
    showToast("Signed out.");
  };

  const editable = authed && editing;

  const filteredProjects = editable
    ? data.projects
    : stance === "engineer"
      ? data.projects.filter((p) => /shipping|production|active|delivered/i.test(p.status))
      : data.projects.filter(
          (p) =>
            /oss|beta|acquired|field|draft/i.test(p.status) ||
            /solo|founding|co-founder|maintainer/i.test(p.role)
        );

  const firstName = data.profile.name.split(" ")[0] ?? data.profile.name;

  return (
    <div className={`hd hd--${theme}`}>
      {/* ── NAVBAR ── */}
      <header className="hd__chrome">
        <span className="hd__mark">
          eom<span className="hd__mark-dot">.</span>
        </span>

        <nav className="hd__nav">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#writing">Writing</a>
          <span className="hd__nav-locale">
            <span className="is-on">EN</span>
          </span>
        </nav>

        <div className="hd__chrome-r">
          <SyncBadge status={syncStatus} />
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />

          {!authed ? (
            <button className="hd__contact" onClick={() => setLoginOpen(true)} type="button">
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ marginRight: 4 }}>
                <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              admin
            </button>
          ) : (
            <>
              <button
                className={`hd__contact${editing ? " is-on" : ""}`}
                onClick={() => setEditing((e) => !e)}
                type="button"
              >
                {editing ? "done editing" : "edit"}
              </button>
              <button className="ed__signout" onClick={handleSignOut} type="button">
                sign out
              </button>
            </>
          )}

          <a
            className="hd__contact hd__contact--solid"
            href={`mailto:${data.profile.email}`}
          >
            {data.profile.email}
          </a>
        </div>
      </header>

      {editable && (
        <div className="ed__edit-banner">
          Edit mode · changes sync to DB automatically
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hd__hero">
        <p className="hd__eyebrow">
          <span className="hd__wave" aria-hidden="true">✦</span>
          {", my name is "}
          <span className="hd__eyebrow-name">
            {editable ? (
              <Editable
                value={firstName}
                editing={editable}
                onChange={(v) => {
                  const rest = data.profile.name.split(" ").slice(1).join(" ");
                  setProfile("name", rest ? `${v} ${rest}` : v);
                }}
              />
            ) : firstName}
          </span>
          {" and I am a freelance"}
        </p>

        <div className="hd__display-stack">
          <h1 className="hd__display hd__display--filled">
            Software&nbsp;Engineer
          </h1>
          <h1 className="hd__display hd__display--outline">&amp; Builder</h1>

          <div className="hd__portrait">
            <Portrait
              src={data.profile.portrait}
              tone={data.profile.portraitTone}
              name={data.profile.name}
              size={400}
              shape="square"
              editing={editable}
              onSrcChange={(v) => setProfile("portrait", v)}
              onToneChange={(v) => setProfile("portraitTone", v)}
            />
          </div>
        </div>

        <div className="hd__hero-foot">
          <p className="hd__based">
            based in{" "}
            <Editable
              value={data.profile.location}
              editing={editable}
              onChange={(v) => setProfile("location", v)}
            />
          </p>

          <div className="hd__chips">
            <button
              className={`hd__pill${stance === "engineer" ? " is-on" : ""}`}
              onClick={() => setStance("engineer")}
              type="button"
            >
              You need an engineer
            </button>
            <button
              className={`hd__pill${stance === "builder" ? " is-on" : ""}`}
              onClick={() => setStance("builder")}
              type="button"
            >
              You need a builder
            </button>
          </div>

          <ul className="hd__logos" aria-label="Worked with">
            {data.experience.slice(0, 5).map((e) => (
              <li key={e.id} className="hd__logo">{e.company}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="hd__about">
        <div className="hd__about-row">
          <span className="hd__num">01 — about</span>
          <p className="hd__about-text">
            <Editable
              value={data.profile.blurb}
              editing={editable}
              multiline
              onChange={(v) => setProfile("blurb", v)}
            />
          </p>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="hd__section">
        <header className="hd__sh">
          <span className="hd__num">02 — toolkit</span>
          <h2>What I work with</h2>
        </header>
        <div className="hd__skill-grid">
          {Object.entries(data.skills).map(([group, list]) => (
            <div
              key={group}
              className="hd__skill-card"
              style={{ "--chip-hue": SKILL_HUES[group] } as React.CSSProperties}
            >
              <div className="hd__skill-card__hd">
                <h3 style={{ color: SKILL_HUES[group] }}>{group}</h3>
                {editable && (
                  <button
                    className="ed__group-remove"
                    type="button"
                    title={`Remove ${group}`}
                    onClick={() => removeSkillGroup(group)}
                  >×</button>
                )}
              </div>
              <ul>
                {list.map((s) => (
                  <li key={s} className={`ed__chip${editable ? " ed__chip--del" : ""}`}>
                    {s}
                    {editable && (
                      <button
                        className="ed__chip-remove"
                        type="button"
                        aria-label={`Remove ${s}`}
                        onClick={() => removeSkill(group, s)}
                      >×</button>
                    )}
                  </li>
                ))}
              </ul>
              {editable && (
                <div className="ed__inline-add">
                  <input
                    value={skillDrafts[group] ?? ""}
                    placeholder="add skill"
                    onChange={(e) =>
                      setSkillDrafts((prev) => ({ ...prev, [group]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = (skillDrafts[group] ?? "").trim();
                        if (val) {
                          addSkill(group, val);
                          setSkillDrafts((prev) => ({ ...prev, [group]: "" }));
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = (skillDrafts[group] ?? "").trim();
                      if (val) {
                        addSkill(group, val);
                        setSkillDrafts((prev) => ({ ...prev, [group]: "" }));
                      }
                    }}
                  >+</button>
                </div>
              )}
            </div>
          ))}

          {editable && (
            <div className="ed__add-group">
              <input
                value={newGroupDraft}
                placeholder="new group name"
                onChange={(e) => setNewGroupDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newGroupDraft.trim()) {
                    addSkillGroup(newGroupDraft.trim());
                    setNewGroupDraft("");
                  }
                }}
              />
              <button
                className="ed__add-btn"
                type="button"
                onClick={() => {
                  if (newGroupDraft.trim()) {
                    addSkillGroup(newGroupDraft.trim());
                    setNewGroupDraft("");
                  }
                }}
              >+ add group</button>
            </div>
          )}
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="work" className="hd__section">
        <header className="hd__sh">
          <span className="hd__num">03 — work</span>
          <h2>Selected projects</h2>
          <span className="hd__sh-meta">
            showing <strong>{filteredProjects.length}</strong> of {data.projects.length} ·
            stance: <strong>{stance}</strong>
          </span>
          {editable && (
            <button className="ed__add-btn" onClick={addProject} type="button">
              + add project
            </button>
          )}
        </header>
        <div className="hd__cards">
          {filteredProjects.map((p) => (
            <ProjectCard
              key={p.id}
              p={p}
              editable={editable}
              onUpdate={(k, v) => setProject(p.id, k, v)}
              onUpdateStack={(stack) => setProjectStack(p.id, stack)}
              onRemove={() => removeProject(p.id)}
              onOpen={() => !editable && setActiveProject(p)}
            />
          ))}
        </div>
      </section>

      {/* ── WRITING ── */}
      <section id="writing" className="hd__section">
        <header className="hd__sh">
          <span className="hd__num">04 — writing</span>
          <h2>Recent</h2>
          {editable && (
            <button className="ed__add-btn" onClick={addWriting} type="button">
              + add post
            </button>
          )}
        </header>
        <ul className="hd__writing">
          {data.writing.map((w) => (
            <li key={w.id} className={editable ? "is-editing" : ""}>
              <span>
                <Editable
                  value={w.date}
                  editing={editable}
                  onChange={(v) => setWriting(w.id, "date", v)}
                />
              </span>
              <h3>
                {!editable && w.slug ? (
                  <a href={`/writing/${w.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {w.title}
                  </a>
                ) : (
                  <Editable
                    value={w.title}
                    editing={editable}
                    onChange={(v) => setWriting(w.id, "title", v)}
                  />
                )}
              </h3>
              <span>
                <Editable
                  value={w.read}
                  editing={editable}
                  onChange={(v) => setWriting(w.id, "read", v)}
                />
              </span>
              {editable && (
                <button
                  className="ed__row-remove"
                  type="button"
                  title="Remove post"
                  onClick={() => removeWriting(w.id)}
                >×</button>
              )}
            </li>
          ))}
        </ul>
        {!editable && (
          <div style={{ marginTop: 24, textAlign: "right" }}>
            <a
              href="/writing"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--fg-3)",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              view all writing →
            </a>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="hd__footer">
        <div className="hd__footer-l">
          <h2 className="hd__footer-cta">Let&apos;s build something quietly excellent.</h2>
          <a className="btn btn--primary" href={`mailto:${data.profile.email}`}>
            {data.profile.email} →
          </a>
        </div>
        <div className="hd__footer-r">
          {data.social.map((s) => (
            <a key={s.id} href={s.url}>
              <span>{s.label}</span>
              <span>{s.handle}</span>
            </a>
          ))}
          <span>© {data.profile.name} · MMXXVI</span>
        </div>
      </footer>

      {/* ── PROJECT MODAL ── */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}

      {/* ── LOGIN MODAL ── */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleSignIn}
      />

      {/* ── TOAST ── */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
