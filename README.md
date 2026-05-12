# Trackr

[![CI](https://github.com/mrsamdev/trackr/actions/workflows/ci.yml/badge.svg)](https://github.com/mrsamdev/trackr/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/Docs-online-blue)](https://mrsamdev.github.io/trackr/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Track every application. Land your next job.**

A full-stack job application tracker with an analytics dashboard, GitHub OAuth, and an MCP server for AI assistant integration.

## Stack

- **Framework** — [TanStack Start](https://tanstack.com/start) (React 19, file-based routing)
- **API** — [tRPC](https://trpc.io/) v11
- **Auth** — [Better Auth](https://better-auth.com/) with GitHub OAuth
- **Database** — SQLite via [Drizzle ORM](https://orm.drizzle.team/) + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) v4 + [shadcn/ui](https://ui.shadcn.com/)
- **Charts** — [Recharts](https://recharts.org/)
- **Linting** — [Biome](https://biomejs.dev/)
- **MCP** — [@modelcontextprotocol/sdk](https://modelcontextprotocol.io/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.x
- A GitHub OAuth App ([create one here](https://github.com/settings/applications/new))

### Setup

```bash
# Clone and install
git clone https://github.com/mrsamdev/trackr.git
cd trackr
bun install
```

Create a `.env` file in the root:

```env
BETTER_AUTH_SECRET=your-secret-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
VITE_APP_URL=http://localhost:3000
```

### Run

```bash
bun run dev       # Development server at http://localhost:3000
bun run build     # Production build
bun run preview   # Preview production build
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server |
| `bun run build` | Build for production |
| `bun run lint` | Lint with Biome |
| `bun run format` | Format with Biome |
| `bun run check` | Lint + format check |
| `bun run test` | Run tests with Vitest |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply pending migrations |
| `bun run db:studio` | Open Drizzle Studio (database GUI) |

## Project Structure

```
src/
├── components/         # Shared UI components
│   ├── analytics/      # Dashboard chart components
│   └── ui/             # shadcn/ui primitives
├── integrations/
│   ├── tanstack-query/ # React Query setup
│   └── trpc/           # tRPC router + procedures
├── lib/                # Auth config (Better Auth)
├── mcp-tools/          # MCP server tool handlers
├── routes/             # File-based routes
│   ├── index.tsx       # Applications list
│   ├── new.tsx         # Add application
│   ├── $id.tsx         # Application detail
│   ├── analytics.tsx   # Analytics dashboard
│   ├── settings.tsx    # User settings
│   ├── login.tsx       # Login page
│   └── register.tsx    # Register page
├── server/
│   ├── db/
│   │   ├── index.ts        # Drizzle database client
│   │   └── schema.ts       # Table definitions
│   ├── queries.ts          # Database queries using Drizzle
│   └── auth.ts             # Better Auth configuration
drizzle/                    # Generated migration files
├── 0000_initial.sql
└── ...
drizzle.config.ts           # Drizzle Kit configuration
└── utils/              # Shared utilities
```

## MCP Integration

Trackr ships an [MCP server](https://modelcontextprotocol.io/) so AI assistants (Claude, Cursor, etc.) can manage your applications directly.

Available tools: `list`, `add`, `get`, `update-status`, `delete`, `settings`.

Add to your MCP client config:

```json
{
  "mcpServers": {
    "trackr": {
      "command": "bun",
      "args": ["run", "src/mcp-applications.ts"]
    }
  }
}
```

## Documentation

Detailed documentation available at [trackr.mrsamdev.com](https://mrsamdev.github.io/trackr/):

- [Getting Started](https://mrsamdev.github.io/trackr/docs/getting-started/installation)
- [Configuration](https://mrsamdev.github.io/trackr/docs/getting-started/configuration)
- [MCP Integration](https://mrsamdev.github.io/trackr/docs/guides/mcp-integration)
- [Analytics Dashboard](https://mrsamdev.github.io/trackr/docs/guides/analytics-dashboard)
- [Contributing Guide](https://mrsamdev.github.io/trackr/docs/community/contributing)

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a PR — lint runs automatically on every PR

## License

MIT
