---
sidebar_position: 1
---

# Installation

Get Trackr up and running on your local machine in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) >= 1.x
- [Git](https://git-scm.com/)
- A [GitHub account](https://github.com/signup)

## Step 1: Clone the Repository

```bash
git clone https://github.com/mrsamdev/trackr.git
cd trackr
```

## Step 2: Install Dependencies

```bash
bun install
```

This will install all required dependencies including:
- TanStack Start and React 19
- tRPC for type-safe APIs
- Better Auth for authentication
- Drizzle ORM for database operations
- Tailwind CSS for styling

## Step 3: Create GitHub OAuth App

Trackr uses GitHub OAuth for authentication. You'll need to create an OAuth app in your GitHub account:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: `Trackr` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:300/docs/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID** and generate a new **Client Secret**

## Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Required: Random secret for session encryption
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-here

# Required: GitHub OAuth credentials
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Required: Application URL
VITE_APP_URL=http://localhost:3000
```

:::tip

Generate a secure `BETTER_AUTH_SECRET` using:

```bash
openssl rand -base64 32
```

:::

## Step 5: Run Database Migrations

Trackr uses SQLite with Drizzle ORM. Generate and apply migrations:

```bash
# Generate migrations (if needed)
bun run db:generate

# Apply migrations
bun run db:migrate
```

## Step 6: Start the Development Server

```bash
bun run dev
```

Trackr will start at [http://localhost:3000](http://localhost:3000).

## Verify Installation

1. Open your browser to `http://localhost:3000`
2. Click **"Login with GitHub"**
3. Authorize the application
4. You should be redirected to your dashboard

## Next Steps

- [Configuration](/docs/getting-started/configuration) - Advanced configuration options
- [Quickstart](/docs/getting-started/quickstart) - Start tracking your applications
- [MCP Integration](./guides/mcp-integration) - Connect AI assistants

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, specify a different port:

```bash
bun run dev --port 3001
```

Update `VITE_APP_URL` in your `.env` file accordingly.

### Database Migration Errors

If you encounter migration errors, try resetting the database:

```bash
rm trackr.db
bun run db:migrate
```

:::warning

This will delete all local data. Only do this in development.

:::

### OAuth Callback Errors

Double-check your OAuth callback URL in GitHub settings matches exactly:

```
http://localhost:300/docs/api/auth/callback/github
```

Make sure there are no trailing slashes.
