"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { Editable } from "./Editable";
import { ProjectLinks } from "./ProjectLinks";

const STATUS_OPTIONS = [
  "Shipping", "Active", "Production", "Beta",
  "OSS", "Field", "Draft", "Delivered", "Acquired",
];

interface ProjectCardProps {
  readonly p: Project;
  readonly editable: boolean;
  readonly onUpdate: (key: keyof Project, value: string) => void;
  readonly onUpdateStack: (stack: string[]) => void;
  readonly onRemove: () => void;
  readonly onOpen: () => void;
}

export function ProjectCard({ p, editable, onUpdate, onUpdateStack, onRemove, onOpen }: ProjectCardProps) {
  const [stackDraft, setStackDraft] = useState("");

  const commitStack = () => {
    const val = stackDraft.trim();
    if (val) {
      onUpdateStack([...p.stack, val]);
      setStackDraft("");
    }
  };

  return (
    <div className="hd-card">
      {/* Transparent click target in view mode — semantically a button */}
      {!editable && (
        <button
          type="button"
          className="hd-card__open"
          aria-label={`View ${p.title} details`}
          onClick={onOpen}
        />
      )}

      {/* Color tile */}
      <div className="hd-card__tile" style={{ background: p.tone }}>
        <div className="hd-card__tile-shine" />
        {editable ? (
          <input
            className="hd-card__tile-input"
            value={p.initials}
            maxLength={3}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onUpdate("initials", e.target.value.toUpperCase())}
          />
        ) : (
          <span>{p.initials}</span>
        )}
        {editable && (
          <input
            type="color"
            className="hd-card__tone-pick"
            value={p.tone}
            title="Pick tile colour"
            onChange={(e) => onUpdate("tone", e.target.value)}
          />
        )}
      </div>

      <div className="hd-card__body">
        <div className="hd-card__row">
          <h3 className="hd-card__title">
            <Editable value={p.title} editing={editable} onChange={(v) => onUpdate("title", v)} />
          </h3>
          <span className="hd-card__year">
            <Editable value={p.year} editing={editable} onChange={(v) => onUpdate("year", v)} />
          </span>
        </div>

        <p className="hd-card__role">
          <Editable value={p.role} editing={editable} onChange={(v) => onUpdate("role", v)} />
        </p>

        {editable && (
          <select
            className="hd-card__status-pick"
            value={p.status}
            onChange={(e) => onUpdate("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        <p className="hd-card__summary">
          <Editable
            value={p.summary}
            editing={editable}
            multiline
            onChange={(v) => onUpdate("summary", v)}
          />
        </p>

        <ul className="hd-card__stack">
          {(editable ? p.stack : p.stack.slice(0, 4)).map((s) => (
            <li key={s} className={editable ? "is-del" : ""}>
              {s}
              {editable && (
                <button
                  className="ed__chip-remove"
                  type="button"
                  aria-label={`Remove ${s}`}
                  onClick={() => onUpdateStack(p.stack.filter((x) => x !== s))}
                >×</button>
              )}
            </li>
          ))}
          {!editable && p.stack.length > 4 && (
            <li className="hd-card__stack-more">+{p.stack.length - 4}</li>
          )}
        </ul>

        {editable && (
          <div className="ed__inline-add">
            <input
              value={stackDraft}
              placeholder="add tag"
              onChange={(e) => setStackDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitStack(); }}
            />
            <button type="button" onClick={commitStack}>+</button>
          </div>
        )}

        <ProjectLinks
          liveUrl={p.liveUrl}
          repoUrl={p.repoUrl}
          onChange={(k, v) => onUpdate(k, v)}
          editing={editable}
          size="sm"
        />
      </div>

      {editable && (
        <button
          className="hd-card__remove"
          type="button"
          onClick={onRemove}
          title="Remove project"
        >
          ×
        </button>
      )}
    </div>
  );
}

/* Project detail modal */
interface ProjectModalProps {
  readonly project: Project;
  readonly onClose: () => void;
}

export function ProjectModal({ project: p, onClose }: ProjectModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="project-modal"
      onClose={onClose}
    >
      <button className="project-modal__close" onClick={onClose} type="button">
        Close ×
      </button>
      <div className="project-modal__tile" style={{ background: p.tone }}>
        {p.initials}
      </div>
      <h3>{p.title}</h3>
      <p className="project-modal__meta">
        {p.role} · {p.year} · {p.status}
      </p>
      <p className="project-modal__summary">{p.summary}</p>
      <ul className="ed__stack" style={{ marginBottom: 16 }}>
        {p.stack.map((s) => (
          <li key={s} className="ed__stack-item">{s}</li>
        ))}
      </ul>
      <ProjectLinks liveUrl={p.liveUrl} repoUrl={p.repoUrl} editing={false} />
    </dialog>
  );
}
