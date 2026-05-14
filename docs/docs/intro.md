---
sidebar_position: 1
---

# Trackr Documentation

**Track every application. Land your next job.**

Trackr is a full-stack job application tracker designed to help you manage your job search efficiently. Built with modern technologies and featuring AI assistant integration through MCP (Model Context Protocol).

## Features

- 📊 **Analytics Dashboard** - Visualize your application pipeline with charts and statistics
- 🔐 **GitHub OAuth** - Secure authentication using your GitHub account
- 🤖 **MCP Server** - AI assistant integration for managing applications via Claude, Cursor, and other MCP clients
- 📱 **Responsive UI** - Clean, modern interface that works on any device
- 🗄️ **SQLite Database** - Lightweight, file-based database with Drizzle ORM
- ⚡ **Real-time Updates** - Built on TanStack Start with tRPC for type-safe APIs

## Quick Links

- [Installation Guide](./getting-started/installation) - Get Trackr running locally
- [Configuration](./getting-started/configuration) - Set up OAuth and environment variables
- [MCP Integration](/docs/guides/mcp-integration) - Connect AI assistants to Trackr
- [API Reference](/docs/api/trpc-routes) - Technical documentation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19) |
| API | [tRPC](https://trpc.io/) v11 |
| Auth | [Better Auth](https://better-auth.com/) with GitHub OAuth |
| Database | SQLite via [Drizzle ORM](https://orm.drizzle.team/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 + [shadcn/ui](https://ui.shadcn.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Linting | [Biome](https://biomejs.dev/) |
| MCP | [@modelcontextprotocol/sdk](https://modelcontextprotocol.io/) |

## Getting Help

- 📖 Browse the documentation
- 🐛 [Report a bug](https://github.com/mrsamdev/trackr/issues)
- 💡 [Request a feature](https://github.com/mrsamdev/trackr/issues)
- 📝 [Contributing Guide](./community/contributing)

## License

MIT License - see [LICENSE](https://github.com/mrsamdev/trackr/blob/main/LICENSE) for details.
