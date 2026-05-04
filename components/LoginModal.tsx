"use client";

import { useEffect, useRef, useState } from "react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}

export function LoginModal({ open, onClose, onSubmit }: LoginModalProps) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPw("");
      setErr("");
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const ok = await onSubmit(pw);
    setBusy(false);
    if (!ok) setErr("Incorrect password. Please try again.");
  };

  return (
    <div className="modal-scrim" onMouseDown={onClose}>
      <form
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="modal__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
        <h2 className="modal__title">Sign in to edit</h2>
        <p className="modal__subtitle">
          Enter the admin password to enable editing of every section of the portfolio.
        </p>
        <input
          ref={inputRef}
          type="password"
          className="modal__input"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="current-password"
        />
        {err && <div className="modal__error">{err}</div>}
        <div className="modal__row">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={busy || !pw}>
            {busy ? "Verifying…" : "Continue"}
          </button>
        </div>
        <p className="modal__hint">
          Changes sync automatically to the database after sign-in.
        </p>
      </form>
    </div>
  );
}
