# Portfolio

A minimal, durable personal portfolio and blog template built with Next.js and Supabase. Designed for speed, longevity, and ease of content management.

## Features

- **Next.js 15 (App Router)**: Leveraging the latest React features and server components.
- **Supabase Backend**: Real-time database and row-level security.
- **Custom Admin CMS**: Built-in editor for writing and managing portfolio content.
- **Dynamic Content**: Experience, projects, and skills managed via Supabase.
- **Fallback Mode**: Gracious degradation if Supabase is not yet configured.
- **Minimal Design**: Clean, typography-focused aesthetic using Vanilla CSS.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **Authentication**: Custom JWT-based admin session.
- **Styling**: Vanilla CSS with CSS Variables.

## How to run locally

### Prerequisites

- **Node.js**: Version 20.x or higher.
- **Supabase**: A Supabase project (free tier works great).

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
    You will need your Supabase URL and keys, and a `JWT_SECRET`. To generate the `ADMIN_PASSWORD_HASH`, see the [Admin Setup](#admin-setup) section.

4.  **Database Setup**
    - Go to your Supabase project's **SQL Editor**.
    - Copy the contents of `supabase/schema.sql` and run it. This will create the necessary tables and seed initial data.

5.  **Run the application**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

## Admin Setup

To access the admin features (like creating new writing posts), you need to set up an admin password.

1.  **Generate a password hash**:
    ```bash
    node -e "require('bcryptjs').hash('yourpassword',12).then(console.log)"
    ```
2.  **Add to `.env.local`**:
    ```env
    ADMIN_PASSWORD_HASH="the-generated-hash"
    ```
3.  **Login**:
    Visit any protected route (like `/writing/new`) or click the sync icon in the UI to be prompted for login.

## How to test

Run the linter to check for code quality issues:

```bash
npm run lint
```

## Documentation

For more detailed documentation on architecture and operations, see the [docs/](docs/index.md) directory.
