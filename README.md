# Portfolio

A minimal, durable personal portfolio and blog template built with Next.js and Neon. Designed for speed, longevity, and ease of content management.

## Features

- **Next.js 15 (App Router)**: Leveraging the latest React features and server components.
- **Neon Backend**: Serverless Postgres plus S3-compatible object storage for images, both branchable.
- **Custom Admin CMS**: Built-in editor for writing and managing portfolio content.
- **Dynamic Content**: Experience, projects, and skills managed via the built-in admin.
- **Fallback Mode**: Gracious degradation if the database is not yet configured.
- **Minimal Design**: Clean, typography-focused aesthetic using Vanilla CSS.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Neon](https://neon.com/) Postgres (`@neondatabase/serverless`)
- **Image storage**: Neon Object Storage (S3 API via `@aws-sdk/client-s3`)
- **Authentication**: Custom JWT-based admin session.
- **Styling**: Vanilla CSS with CSS Variables.

## How to run locally

### Prerequisites

- **Node.js**: Version 20.x or higher.
- **Neon**: A Neon project (free tier works great) and the CLI: `npm i -g neon && neon login`.

### Setup Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Mancunia/portfolio
    cd portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure environment variables**
    Copy the example environment file and fill in your values.
    ```bash
    cp .env.example .env.local
    ```
    You will need a `JWT_SECRET`; the Neon variables (including `NEON_AUTH_BASE_URL`) are filled in by the next step. To create your admin account, see the [Admin Setup](#admin-setup) section.

4.  **Database Setup**
    Link the project and create the `assets` image bucket declared in `neon.ts`. This writes `DATABASE_URL` and the `AWS_*` storage credentials to `.env`:
    ```bash
    neon link --project-id <your-project-id> --branch production -y
    neon deploy
    ```
    Then create the tables and starter content (`db/schema.sql`, `db/seed.sql`):
    ```bash
    node --env-file=.env scripts/db-setup.mjs --seed
    ```

5.  **Run the application**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

## Admin Setup

Admin sign-in uses [Neon Auth](https://neon.com/docs/auth/overview) (Managed Better Auth, declared with `auth: true` in `neon.ts`). Anyone can read the site; only Neon Auth users with the `admin` role can edit.

1.  **Create your account** while public sign-up is still on (one time):
    ```bash
    curl -X POST "$NEON_AUTH_BASE_URL/sign-up/email" -H "Content-Type: application/json" -H "Origin: http://localhost:3000" \
      -d '{"email":"you@example.com","password":"a-strong-password","name":"Your Name"}'
    ```
2.  **Grant the admin role** (user id from `neon neon-auth status` / the Neon Console Auth users list):
    ```bash
    neon neon-auth user set-role <user-id> --roles admin
    ```
3.  **Close sign-up** so nobody else can create accounts:
    ```bash
    neon neon-auth config email-password update --disable-sign-up
    ```
4.  **Trust your production origin** (localhost is allowed by default):
    ```bash
    neon neon-auth domain add https://your-domain.com
    ```
5.  **Login**: click the lock in the nav and enter your email and password. The server signs in against Neon Auth, checks the role, and sets an 8-hour `portfolio_session` cookie.

## How to test

Run the linter to check for code quality issues:

```bash
npm run lint
```

## Documentation

For more detailed documentation on architecture and operations, see the [docs/](docs/index.md) directory.
