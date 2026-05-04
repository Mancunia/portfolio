"use client";

interface ProjectLinksProps {
  liveUrl: string;
  repoUrl: string;
  editing?: boolean;
  onChange?: (key: "liveUrl" | "repoUrl", value: string) => void;
  size?: "sm" | "md";
}

export function ProjectLinks({ liveUrl, repoUrl, editing, onChange, size = "md" }: ProjectLinksProps) {
  if (editing) {
    return (
      <div className="proj-links proj-links--edit" onClick={(e) => e.stopPropagation()}>
        <label>
          <span>Live URL</span>
          <input
            type="url"
            placeholder="https://app.example.com"
            value={liveUrl ?? ""}
            onChange={(e) => onChange?.("liveUrl", e.target.value)}
          />
        </label>
        <label>
          <span>Repo URL</span>
          <input
            type="url"
            placeholder="https://github.com/…"
            value={repoUrl ?? ""}
            onChange={(e) => onChange?.("repoUrl", e.target.value)}
          />
        </label>
      </div>
    );
  }

  if (!liveUrl && !repoUrl) return null;

  return (
    <div
      className={`proj-links proj-links--${size}`}
      onClick={(e) => e.stopPropagation()}
    >
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="proj-link proj-link--live"
          title="Open live app"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8a1.5 1.5 0 0 0 1.5-1.5V10M9 2h5v5M14 2 7 9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Live</span>
        </a>
      )}
      {repoUrl && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="proj-link proj-link--repo"
          title="Open repository"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8c0 2.9 1.9 5.3 4.4 6.2.3.1.4-.1.4-.3v-1.1c-1.8.4-2.2-.8-2.2-.8-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.5.7 1.9.6 0-.4.2-.7.4-.9-1.4-.2-2.9-.7-2.9-3.2 0-.7.3-1.3.7-1.7-.1-.2-.3-.9.1-1.8 0 0 .6-.2 1.8.7.5-.1 1-.2 1.6-.2.6 0 1.1.1 1.6.2 1.2-.8 1.8-.7 1.8-.7.4.9.1 1.6.1 1.8.4.4.7 1 .7 1.7 0 2.4-1.5 3-2.9 3.2.2.2.4.6.4 1.3v1.9c0 .2.1.4.4.3 2.6-.9 4.4-3.3 4.4-6.2 0-3.6-2.9-6.5-6.5-6.5z"
              fill="currentColor"
            />
          </svg>
          <span>Code</span>
        </a>
      )}
    </div>
  );
}
