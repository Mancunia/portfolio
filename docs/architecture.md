# Architecture

## Technical Stack

- **Frontend**: Next.js 15 with React Server Components.
- **Data Fetching**: Server-side SQL against Neon Postgres via `@neondatabase/serverless` (`lib/db.ts`). The database is never reached from the browser.
- **Images**: Neon Object Storage `assets` bucket (public read), written through the S3 API (`lib/storage.ts`). The DB stores bucket keys; full URLs are built on read.
- **State Management**: React state for local UI; Postgres for persistent state.
- **Authentication**: Custom JWT implementation using `jose`. Session is stored in a `portfolio_session` cookie.
- **Styling**: Modern CSS using variables for theming (Dark/Light mode).

## Data Flow

1.  **Public Access**:
    - Users visit the site.
    - Next.js Server Components fetch data from Postgres using `fetchPortfolioData`.
    - If the database is unavailable, `FALLBACK_DATA` from `lib/site.config.ts` is used.
    - Pages are revalidated every 60 seconds.

2.  **Admin Operations**:
    - Admin logs in via `/api/admin/login`.
    - Credentials are verified against `ADMIN_PASSWORD_HASH`.
    - A JWT is issued and stored in a cookie.
    - Admin can then access protected routes (e.g., `/writing/new`, `/writing/[slug]/edit`).
    - Writes to the database are performed via API routes; a portfolio save runs as a single transaction.

## Key Directories

- `app/`: Next.js App Router routes and API endpoints.
- `components/`: Reusable React components.
- `lib/`: Utility functions, authentication logic, database and storage clients.
- `db/`: Database schema and starter content.
- `scripts/`: `db-setup.mjs` applies the schema.
- `neon.ts`: Neon infrastructure config (image bucket, branch policy).
- `docs/`: Project documentation.
