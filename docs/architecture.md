# Architecture

## Technical Stack

- **Frontend**: Next.js 15 with React Server Components.
- **Data Fetching**: Server-side fetching using the Supabase Service Role for admin operations and Anon Key for public reads.
- **State Management**: React state for local UI; Supabase for persistent state.
- **Authentication**: Custom JWT implementation using `jose`. Session is stored in a `portfolio_session` cookie.
- **Styling**: Modern CSS using variables for theming (Dark/Light mode).

## Data Flow

1.  **Public Access**:
    - Users visit the site.
    - Next.js Server Components fetch data from Supabase using `fetchPortfolioData`.
    - If Supabase is unavailable, `FALLBACK_DATA` from `lib/site.config.ts` is used.
    - Pages are revalidated every 60 seconds.

2.  **Admin Operations**:
    - Admin logs in via `/api/admin/login`.
    - Credentials are verified against `ADMIN_PASSWORD_HASH`.
    - A JWT is issued and stored in a cookie.
    - Admin can then access protected routes (e.g., `/writing/new`, `/writing/[slug]/edit`).
    - Writes to the database are performed via API routes using the Supabase Service Role key.

## Key Directories

- `app/`: Next.js App Router routes and API endpoints.
- `components/`: Reusable React components.
- `lib/`: Utility functions, authentication logic, and Supabase client configuration.
- `supabase/`: Database schema and migrations.
- `docs/`: Project documentation.
