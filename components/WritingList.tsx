"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import { LoginModal } from "./LoginModal";

interface Props {
  posts: BlogPost[];
}

export function WritingList({ posts }: Readonly<Props>) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const editable = authed && editing;

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b));

  const visible = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

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
      return true;
    }
    return false;
  };

  return (
    <div className={`hd hd--${theme}`}>
      <header className="hd__chrome">
        <Link href="/" className="hd__mark" style={{ textDecoration: "none" }}>
          eom<span className="hd__mark-dot">.</span>
        </Link>
        <nav className="hd__nav">
          <Link href="/#about">About</Link>
          <Link href="/#work">Work</Link>
          <Link href="/writing" style={{ opacity: 1 }}>Writing</Link>
        </nav>
        <div className="hd__chrome-r">
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
          {authed ? (
            <button
              className={`hd__contact${editing ? " is-on" : ""}`}
              onClick={() => setEditing((e) => !e)}
              type="button"
            >
              {editing ? "done editing" : "edit"}
            </button>
          ) : (
            <button className="hd__contact" onClick={() => setLoginOpen(true)} type="button">
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ marginRight: 4 }}>
                <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              admin
            </button>
          )}
          {editable && (
            <Link href="/writing/new" className="wl__new-btn">
              + new post
            </Link>
          )}
        </div>
      </header>

      {editable && (
        <div className="ed__edit-banner">
          Edit mode · create and manage posts
        </div>
      )}

      <div className="wl__hero">
        <p className="wl__eyebrow">04 — writing</p>
        <h1 className="wl__title">Writing</h1>
        <p className="wl__subtitle">
          Notes on building software, systems thinking, and the craft of making things that last.
        </p>
        {allTags.length > 0 && (
          <div className="wl__tags">
            <button
              className={`wl__tag${activeTag === null ? " is-on" : ""}`}
              onClick={() => setActiveTag(null)}
              type="button"
            >
              all
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`wl__tag${activeTag === tag ? " is-on" : ""}`}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="wl__list">
        {visible.length === 0 ? (
          <p className="wl__empty">Nothing here yet.</p>
        ) : (
          visible.map((post) => (
            <Link key={post.id} href={`/writing/${post.slug}`} className="wl__row">
              <span className="wl__date">{post.date}</span>
              <div className="wl__body">
                <h2 className="wl__post-title">
                  {post.title}
                  {!post.published && editable && (
                    <span className="pr__draft-badge" style={{ marginLeft: 10, fontSize: 10, verticalAlign: "middle" }}>draft</span>
                  )}
                </h2>
                {post.excerpt && <p className="wl__excerpt">{post.excerpt}</p>}
                {post.tags.length > 0 && (
                  <div className="wl__post-tags">
                    {post.tags.map((t) => (
                      <span key={t} className="wl__post-tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="wl__read">{post.read}</span>
            </Link>
          ))
        )}
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleSignIn}
      />
    </div>
  );
}
