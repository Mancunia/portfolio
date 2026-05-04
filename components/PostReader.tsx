"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost, BlogAsset, Reference } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import { LoginModal } from "./LoginModal";

interface Props {
  post: BlogPost;
}

function CodeAsset({ asset }: { asset: BlogAsset }) {
  return (
    <div className="pr__code-block">
      <div className="pr__code-header">
        <span className="pr__code-filename">{asset.filename || "snippet"}</span>
        <span className="pr__code-lang">{asset.lang || "text"}</span>
      </div>
      <pre className="pr__code-body">{asset.code}</pre>
    </div>
  );
}

function ImageAsset({ asset }: { asset: BlogAsset }) {
  return (
    <div className="pr__image-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.url} alt={asset.alt || ""} />
      {asset.caption && <p className="pr__image-caption">{asset.caption}</p>}
    </div>
  );
}

function LinkAsset({ asset }: { asset: BlogAsset }) {
  return (
    <a
      href={asset.href}
      target="_blank"
      rel="noopener noreferrer"
      className="pr__link-block"
    >
      <div className="pr__link-icon">↗</div>
      <div className="pr__link-body">
        <span className="pr__link-title">{asset.linkTitle || asset.href}</span>
        {asset.linkDesc && <span className="pr__link-desc">{asset.linkDesc}</span>}
        <span className="pr__link-href">{asset.href}</span>
      </div>
    </a>
  );
}

function RefList({ refs }: { refs: Reference[] }) {
  if (!refs.length) return null;
  return (
    <div className="pr__refs">
      <p className="pr__refs-title">References</p>
      <ol className="pr__ref-list">
        {refs.map((ref, i) => (
          <li key={ref.id} className="pr__ref-item">
            <span className="pr__ref-num">{i + 1}.</span>
            <div className="pr__ref-body">
              <span className="pr__ref-label">{ref.label}</span>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pr__ref-url"
              >
                {ref.url}
              </a>
              {ref.note && <span className="pr__ref-note">{ref.note}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PostReader({ post }: Readonly<Props>) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [authed, setAuthed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const editable = authed && editing;

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

  const hasAssets = post.assets.length > 0;
  const hasRefs = post.references.length > 0;

  return (
    <div className={`hd hd--${theme} pr`}>
      <header className="hd__chrome">
        <Link href="/" className="hd__mark" style={{ textDecoration: "none" }}>
          eom<span className="hd__mark-dot">.</span>
        </Link>
        <nav className="hd__nav">
          <Link href="/#about">About</Link>
          <Link href="/#work">Work</Link>
          <Link href="/writing">Writing</Link>
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
            <Link href={`/writing/${post.slug}/edit`} className="hd__contact hd__contact--solid">
              open editor
            </Link>
          )}
        </div>
      </header>

      <div className="pr__header">
        <Link href="/writing" className="pr__back">
          ← writing
        </Link>

        <div className="pr__meta-row">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.read} read</span>
          {!post.published && (
            <>
              <span>·</span>
              <span className="pr__draft-badge">draft</span>
            </>
          )}
        </div>

        <h1 className="pr__title">{post.title}</h1>

        {post.excerpt && <p className="pr__excerpt">{post.excerpt}</p>}

        {post.tags.length > 0 && (
          <div className="pr__tags">
            {post.tags.map((t) => (
              <span key={t} className="pr__tag">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="pr__divider" />

      {post.content && (
        <div
          className="pr__prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {hasAssets && (
        <div className="pr__assets">
          <p className="pr__asset-label">Attachments</p>
          {post.assets.map((asset) => {
            if (asset.type === "code") return <CodeAsset key={asset.id} asset={asset} />;
            if (asset.type === "image") return <ImageAsset key={asset.id} asset={asset} />;
            if (asset.type === "link") return <LinkAsset key={asset.id} asset={asset} />;
            return null;
          })}
        </div>
      )}

      {hasRefs && <RefList refs={post.references} />}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleSignIn}
      />
    </div>
  );
}
