"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BlogPost, BlogAsset, Reference } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import { markdownToHtml } from "@/lib/markdown";

type Mode = "edit" | "preview";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function newId(): string {
  return Math.random().toString(36).slice(2, 9);
}

const EMPTY_POST: Omit<BlogPost, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  read: "5 min",
  tags: [],
  assets: [],
  references: [],
  published: false,
};

interface Props {
  initial?: BlogPost;
}

export function PostEditor({ initial }: Props) {
  const router = useRouter();
  const isNew = !initial;

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [post, setPost] = useState<Omit<BlogPost, "id">>(
    initial
      ? {
          slug: initial.slug,
          title: initial.title,
          excerpt: initial.excerpt,
          content: initial.content,
          date: initial.date,
          read: initial.read,
          tags: initial.tags,
          assets: initial.assets,
          references: initial.references,
          published: initial.published,
        }
      : EMPTY_POST
  );
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<Mode>("edit");
  const [toast, setToast] = useState<string | null>(null);
  const [tagDraft, setTagDraft] = useState("");
  const [slugManual, setSlugManual] = useState(!!initial);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const set = useCallback(<K extends keyof typeof post>(key: K, val: (typeof post)[K]) => {
    setPost((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (!slugManual) set("slug", slugify(title));
  };

  // ── Tags ──────────────────────────────────────────────────
  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t && !post.tags.includes(t)) set("tags", [...post.tags, t]);
    setTagDraft("");
  };

  const removeTag = (tag: string) => set("tags", post.tags.filter((t) => t !== tag));

  // ── Assets ────────────────────────────────────────────────
  const addAsset = (type: BlogAsset["type"]) => {
    const asset: BlogAsset = { id: newId(), type };
    set("assets", [...post.assets, asset]);
  };

  const updateAsset = (id: string, patch: Partial<BlogAsset>) => {
    set(
      "assets",
      post.assets.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  const removeAsset = (id: string) => set("assets", post.assets.filter((a) => a.id !== id));

  // ── References ────────────────────────────────────────────
  const addRef = () => {
    set("references", [...post.references, { id: newId(), label: "", url: "", note: "" }]);
  };

  const updateRef = (id: string, patch: Partial<Reference>) => {
    set(
      "references",
      post.references.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const removeRef = (id: string) =>
    set("references", post.references.filter((r) => r.id !== id));

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async () => {
    if (!post.title.trim()) { showToast("Title is required"); return; }
    if (!post.slug.trim()) { showToast("Slug is required"); return; }
    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/writing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
          credentials: "include",
        });
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(error);
        }
        const created: BlogPost = await res.json();
        showToast("Post created");
        router.push(`/writing/${created.slug}/edit`);
      } else {
        const res = await fetch(`/api/writing/${initial!.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
          credentials: "include",
        });
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(error);
        }
        showToast("Saved");
        if (post.slug !== initial!.slug) router.push(`/writing/${post.slug}/edit`);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial) return;
    if (!confirm(`Delete "${initial.title}"? This cannot be undone.`)) return;
    await fetch(`/api/writing/${initial.slug}`, { method: "DELETE", credentials: "include" });
    router.push("/writing");
  };

  // ── Upload image ──────────────────────────────────────────
  const uploadImage = async (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("kind", "blog");
    const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
    if (res.ok) {
      const { url } = await res.json();
      updateAsset(id, { url });
    }
  };

  return (
    <div className={`hd hd--${theme} pe`}>
      <header className="pe__chrome">
        <Link href={initial ? `/writing/${initial.slug}` : "/writing"} className="pe__back">
          ← {initial ? "post" : "writing"}
        </Link>
        <span className="pe__chrome-title">
          {isNew ? "new post" : post.slug}
        </span>
        <div className="pe__chrome-r">
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
          <button
            type="button"
            className="pe__pub-toggle"
            onClick={() => set("published", !post.published)}
          >
            <span className={`pe__pub-dot${post.published ? " is-pub" : ""}`} />
            {post.published ? "published" : "draft"}
          </button>
          {!isNew && (
            <button type="button" className="pe__del-btn" onClick={handleDelete}>
              delete
            </button>
          )}
          <button
            type="button"
            className="pe__save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "saving…" : "save"}
          </button>
        </div>
      </header>

      <div className="pe__body">
        {/* ── Title ── */}
        <div className="pe__field">
          <label className="pe__label">Title</label>
          <input
            className="pe__title-input"
            placeholder="Post title"
            value={post.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>

        {/* ── Slug ── */}
        <div className="pe__field">
          <label className="pe__label">Slug</label>
          <input
            className="pe__input"
            placeholder="url-slug"
            value={post.slug}
            onChange={(e) => {
              setSlugManual(true);
              set("slug", e.target.value);
            }}
          />
        </div>

        {/* ── Excerpt ── */}
        <div className="pe__field">
          <label className="pe__label">Excerpt</label>
          <textarea
            className="pe__textarea"
            placeholder="A one-paragraph summary shown in the list."
            value={post.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>

        {/* ── Meta row ── */}
        <div className="pe__meta-row">
          <div className="pe__field">
            <label className="pe__label">Date</label>
            <input
              className="pe__input"
              placeholder="Mar 2026"
              value={post.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className="pe__field">
            <label className="pe__label">Read time</label>
            <input
              className="pe__input"
              placeholder="8 min"
              value={post.read}
              onChange={(e) => set("read", e.target.value)}
            />
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="pe__field">
          <label className="pe__label">Tags</label>
          <div className="pe__tags-input">
            {post.tags.map((tag) => (
              <span key={tag} className="pe__tag-chip">
                {tag}
                <button
                  type="button"
                  className="pe__tag-remove"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              className="pe__tag-field"
              placeholder="add tag, Enter"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag(tagDraft);
                }
                if (e.key === "Backspace" && !tagDraft && post.tags.length) {
                  removeTag(post.tags[post.tags.length - 1]);
                }
              }}
            />
          </div>
        </div>

        <hr className="pe__sep" />

        {/* ── Content ── */}
        <div className="pe__field">
          <div className="pe__section-head">
            <label className="pe__label">Content (Markdown)</label>
            <button
              type="button"
              className="pe__preview-toggle"
              onClick={() => setMode((m) => (m === "edit" ? "preview" : "edit"))}
            >
              {mode === "edit" ? "preview" : "edit"}
            </button>
          </div>
          {mode === "edit" ? (
            <textarea
              className="pe__content-area"
              placeholder={`# Heading\n\nYour post content in **Markdown**.\n\n\`\`\`ts\nconsole.log("hello")\n\`\`\``}
              value={post.content}
              onChange={(e) => set("content", e.target.value)}
            />
          ) : (
            <div
              className="pr__prose pe__preview-area"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
            />
          )}
        </div>

        <hr className="pe__sep" />

        {/* ── Assets ── */}
        <div className="pe__field">
          <label className="pe__label">Attachments</label>
          <div className="pe__assets">
            {post.assets.map((asset) => (
              <AssetEditor
                key={asset.id}
                asset={asset}
                onChange={(patch) => updateAsset(asset.id, patch)}
                onRemove={() => removeAsset(asset.id)}
                onImageUpload={(file) => uploadImage(asset.id, file)}
              />
            ))}
          </div>
          <div className="pe__add-asset-row" style={{ marginTop: post.assets.length ? 12 : 0 }}>
            <button type="button" className="pe__add-asset-btn" onClick={() => addAsset("code")}>
              + code block
            </button>
            <button type="button" className="pe__add-asset-btn" onClick={() => addAsset("image")}>
              + image
            </button>
            <button type="button" className="pe__add-asset-btn" onClick={() => addAsset("link")}>
              + link
            </button>
          </div>
        </div>

        <hr className="pe__sep" />

        {/* ── References ── */}
        <div className="pe__field">
          <label className="pe__label">References</label>
          <div className="pe__refs">
            {post.references.map((ref, i) => (
              <div key={ref.id} className="pe__ref-row">
                <span className="pe__ref-num-badge">{i + 1}.</span>
                <div className="pe__ref-fields">
                  <input
                    className="pe__input"
                    placeholder="Label / title"
                    value={ref.label}
                    onChange={(e) => updateRef(ref.id, { label: e.target.value })}
                  />
                  <input
                    className="pe__input"
                    placeholder="https://..."
                    value={ref.url}
                    onChange={(e) => updateRef(ref.id, { url: e.target.value })}
                  />
                  <input
                    className="pe__input"
                    placeholder="Note (optional)"
                    value={ref.note ?? ""}
                    onChange={(e) => updateRef(ref.id, { note: e.target.value })}
                  />
                </div>
                <button
                  type="button"
                  className="pe__ref-remove"
                  onClick={() => removeRef(ref.id)}
                  aria-label="Remove reference"
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="pe__add-asset-btn" onClick={addRef}>
              + add reference
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ── Asset sub-editor ─────────────────────────────────────────

interface AssetEditorProps {
  asset: BlogAsset;
  onChange: (patch: Partial<BlogAsset>) => void;
  onRemove: () => void;
  onImageUpload: (file: File) => void;
}

function AssetEditor({ asset, onChange, onRemove, onImageUpload }: AssetEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="pe__asset">
      <div className="pe__asset-head">
        <span className="pe__asset-type">{asset.type}</span>
        <button type="button" className="pe__asset-remove" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      </div>

      <div className="pe__asset-body">
        {asset.type === "code" && (
          <>
            <div className="pe__asset-row">
              <input
                className="pe__input"
                placeholder="Language (ts, python, go…)"
                value={asset.lang ?? ""}
                onChange={(e) => onChange({ lang: e.target.value })}
              />
              <input
                className="pe__input"
                placeholder="Filename (optional)"
                value={asset.filename ?? ""}
                onChange={(e) => onChange({ filename: e.target.value })}
              />
            </div>
            <textarea
              className="pe__code-ta"
              placeholder="Paste code here…"
              value={asset.code ?? ""}
              onChange={(e) => onChange({ code: e.target.value })}
            />
          </>
        )}

        {asset.type === "image" && (
          <>
            <div className="pe__asset-row">
              <input
                className="pe__input"
                placeholder="Image URL"
                value={asset.url ?? ""}
                onChange={(e) => onChange({ url: e.target.value })}
              />
              <button
                type="button"
                className="pe__add-asset-btn"
                onClick={() => fileRef.current?.click()}
              >
                upload
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImageUpload(f);
                }}
              />
            </div>
            <input
              className="pe__input"
              placeholder="Alt text"
              value={asset.alt ?? ""}
              onChange={(e) => onChange({ alt: e.target.value })}
            />
            <input
              className="pe__input"
              placeholder="Caption (optional)"
              value={asset.caption ?? ""}
              onChange={(e) => onChange({ caption: e.target.value })}
            />
            {asset.url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={asset.url}
                alt={asset.alt || "preview"}
                style={{ maxHeight: 200, borderRadius: 6, objectFit: "cover" }}
              />
            )}
          </>
        )}

        {asset.type === "link" && (
          <>
            <input
              className="pe__input"
              placeholder="https://..."
              value={asset.href ?? ""}
              onChange={(e) => onChange({ href: e.target.value })}
            />
            <input
              className="pe__input"
              placeholder="Link title"
              value={asset.linkTitle ?? ""}
              onChange={(e) => onChange({ linkTitle: e.target.value })}
            />
            <input
              className="pe__input"
              placeholder="Description (optional)"
              value={asset.linkDesc ?? ""}
              onChange={(e) => onChange({ linkDesc: e.target.value })}
            />
          </>
        )}
      </div>
    </div>
  );
}
