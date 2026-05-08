# Job Application Tracker — Build Plan

A single-user, no-auth, local-first job application tracker. TanStack Start handles routing, tRPC handles type-safe API calls, Bun runs everything, SQLite persists data. Sea/lagoon UI theme already scaffolded in `styles.css`.

---

## 1. Stack & rationale

- **TanStack Start** — file-based routing, SSR/SSG capable, route-level server handlers.
- **tRPC** — type-safe end-to-end RPC layer (already wired with `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `superjson`). Used instead of raw `createServerFn` for consistency with the existing scaffold.
- **Bun** — runtime + package manager + bundler. Native SQLite driver (`bun:sqlite`) means zero DB dependencies.
- **bun:sqlite** — built-in, synchronous, fast. No ORM needed at this scale; a thin query module keeps things tidy.
- **Tailwind CSS v4** — already configured via `@tailwindcss/vite`, using CSS-native theming (no `tailwind.config.ts`). Custom sea/lagoon tokens in `styles.css`. Includes `@tailwindcss/typography` and `tw-animate-css` for shadcn animations.
- **TanStack Query** — list invalidation after mutations (already wired via root provider with superjson dehydration/hydration for SSR).
- **TanStack React Router** — file-based routing with scroll restoration, intent-based preloading, and `@tanstack/react-router-ssr-query` for seamless SSR query prefetching.
- **TanStack React Table** — for sortable/filterable application list. Paired with `@tanstack/match-sorter-utils` for fuzzy text filtering.
- **TanStack React Form** — form state management for add/edit.
- **Zod v4** — input validation for tRPC and env vars (beta line, API differs from v3).
- **shadcn/ui** — present components: `button`, `input`, `label`, `select`, `slider`, `switch`, `textarea`. Built on Radix UI primitives + `class-variance-authority` + `tailwind-merge`.
- **Lucide React** — icon library.
- **@faker-js/faker** — seeding demo / test data.
- **@t3-oss/env-core** — type-safe environment validation.
- **Model Context Protocol (MCP)** — AI agent integration via `@modelcontextprotocol/sdk`. Exposes app data as tools that external AI clients can invoke over HTTP at `POST /mcp`.
- **Biome** — linting, formatting, and checking via `bun run lint` / `bun run format` / `bun run check`.
- **Vitest + jsdom + Testing Library** — unit testing stack already installed.
- **React 19** + **TypeScript 6.x** — latest React with compiler features; TS 6.0 is the Go-to-Definition rewrite (currently in beta).

No auth, no migrations framework — schema bootstraps on app start. Single-user assumption throughout.

**Path aliases:** `package.json` (imports) maps `#/*` → `./src/*`; `tsconfig.json` maps both `#/*` and `@/*` for shadcn compat. Prefer `#/*` everywhere and treat `@/*` as a fallback.

---

## 2. Installed packages

### Dependencies
```
@faker-js/faker          ^10.3.0
@modelcontextprotocol/sdk ^1.27.1
@t3-oss/env-core         ^0.13.10
@tailwindcss/vite        ^4.1.18
@tanstack/match-sorter-utils      latest
@tanstack/react-devtools           latest
@tanstack/react-form               latest
@tanstack/react-query              latest
@tanstack/react-query-devtools     latest
@tanstack/react-router             latest
@tanstack/react-router-devtools    latest
@tanstack/react-router-ssr-query   latest
@tanstack/react-start             latest
@tanstack/react-table             latest
@tanstack/router-plugin            ^1.132.0
@trpc/client             ^11.11.0
@trpc/server             ^11.11.0
@trpc/tanstack-react-query ^11.11.0
class-variance-authority ^0.7.1
clsx                     ^2.1.1
lucide-react             ^0.577.0
radix-ui                 ^1.4.3
react                    ^19.2.0
react-dom                ^19.2.0
superjson                ^2.2.2
tailwind-merge           ^3.0.2
tailwindcss              ^4.1.18
tw-animate-css           ^1.3.6
zod                      ^4.3.6
```

### Dev dependencies
```
@biomejs/biome           2.4.5
@tailwindcss/typography  ^0.5.16
@tanstack/devtools-vite  latest
@testing-library/dom      ^10.4.1
@testing-library/react    ^16.3.0
@types/node              ^22.10.2
@types/react             ^19.2.0
@types/react-dom         ^19.2.0
@vitejs/plugin-react     ^6.0.1
jsdom                    ^28.1.0
typescript               ^6.0.2
vite                     ^8.0.0
vitest                   ^4.1.5
```

---

## 3. Data model

One main table, one settings row. SQLite, all timestamps as ISO strings for sort simplicity.

### `applications`

| column | type | notes |
|---|---|---|
| id | INTEGER PK | autoincrement |
| title | TEXT NOT NULL | role title — required |
| company | TEXT NOT NULL | required |
| status | TEXT NOT NULL | `applied` \| `interview` \| `rejected` \| `offer` |
| applied_at | TEXT NOT NULL | ISO date, defaults to today |
| heard_back_at | TEXT NULL | ISO date, set when status leaves `applied` |
| location | TEXT NULL | optional preset field |
| salary | TEXT NULL | optional preset field, free text |
| job_url | TEXT NULL | optional preset field |
| source | TEXT NULL | optional preset field (LinkedIn, referral, etc.) |
| notes | TEXT NULL | optional preset field, multiline |
| created_at | TEXT NOT NULL | ISO datetime |
| updated_at | TEXT NOT NULL | ISO datetime |

Index on `status` and `company` for filtering/search.

### `settings`

Single-row key-value. Stores which optional fields the user wants visible in the add form.

| column | type | notes |
|---|---|---|
| key | TEXT PK | e.g. `visible_fields` |
| value | TEXT | JSON-stringified array: `["location","salary","job_url"]` |

Core fields (title, company, status, applied_at) are always visible — only the **optional** fields are togglable.

---

## 4. Field customization

When the user clicks **Add Job**, the form shows:

- **Always shown**: title, company, status, applied date
- **Conditionally shown**: location, salary, job_url, source, notes — based on user's saved preferences

A **Customize fields** button (gear icon) opens a small panel with checkboxes for each optional field. Selection persists to the `settings` table. Selection applies to both the add form and the table columns shown in the list view.

This avoids the complexity of fully user-defined fields while still feeling personal.

---

## 5. Routes & UI
Make sure follow DESIGN.md
```
/                  → Application list (default route)
/new               → Add modal overlay
/$id               → Detail/edit modal overlay
/settings          → Field visibility customization
/api/trpc/*        → tRPC API handler (fetchRequestHandler)
/mcp               → MCP JSON-RPC handler (POST only)
```

**Implementation note**: Use TanStack Start's modal-route pattern — `/new` and `/$id` render as overlays on top of `/` so the list stays in view. Falls back to standalone route if accessed directly.

### List view (`/`)

- Hero strip: app title, total count badge, "Add Job" CTA
- Search bar: filters by title + company (client-side debounce, server-side `LIKE`)
- Status filter chips: All / Applied / Interview / Rejected / Offer
- Application table: each row shows title, company, status pill, applied date, days-since-applied (TanStack Table for sorting)
- Empty state: illustration + "No applications yet" message

### Add/Edit form (`/new`, `/$id`)

- Modal panel (glass/island-shell style from `styles.css`)
- Required fields first, then optional (only the ones enabled in settings)
- Status as a select dropdown (or chip-style segmented control)
- Save → tRPC mutation → invalidate list query → close modal

### Settings (`/settings`)

- Simple checkbox list of optional fields
- Save persists to `settings` table via tRPC mutation

---

## 6. tRPC router structure

All routes in `src/integrations/trpc/router.ts` (or split into sub-routers):

- `applications.list({ search?, status? })` → filtered list
- `applications.get(id)` → single record
- `applications.create(data)` → validate w/ Zod, insert, return new record
- `applications.update(id, data)` → validate, update, bump `updated_at`, auto-set `heard_back_at` when status moves off `applied`
- `applications.delete(id)` → hard delete with confirm dialog
- `settings.getVisibleFields()` / `settings.setVisibleFields(fields[])` → settings CRUD

**Current placeholder code to replace:**
- `src/integrations/trpc/router.ts` contains a `todos` in-memory router (`todos.list`, `todos.add`). Replace with `applications` + `settings` sub-routers backed by SQLite.
- `src/mcp-todos.ts` registers an `addTodo` MCP tool against an in-memory JSON file. Replace with MCP tools that call the same SQLite layer as tRPC.

---

## 7. MCP integration

The project was scaffolded with the **MCP add-on** enabled (see `.cta.json`). MCP lets external AI agents interact with the job tracker programmatically over HTTP.

### How it works

- **`@modelcontextprotocol/sdk`** — provides the server SDK, `McpServer`, `InMemoryTransport`, and JSON-RPC message types.
- **`src/utils/mcp-handler.ts`** — generic HTTP handler. Accepts a JSON-RPC request, creates an in-memory transport pair, connects the `McpServer`, sends the request, captures the response, and returns it. This is framework-agnostic plumbing.
- **`src/routes/mcp.ts`** — TanStack Start route file that mounts the MCP server at `POST /mcp`. Defines tools (and optionally resources) the AI can call.
- **`src/mcp-todos.ts`** — example in-memory store stub demonstrating tool registration (currently registers an `addTodo` tool). This will be replaced with real application-management MCP tools.

### Planned MCP tools (for job applications)

| tool | input | description |
|---|---|---|
| `listApplications` | `{ search?, status?, limit? }` | Return all or filtered applications as structured text |
| `addApplication` | `{ title, company, status?, applied_at?, location?, salary?, job_url?, source?, notes? }` | Insert a new job application |
| `getApplication` | `{ id }` | Get details for a single application |
| `updateApplicationStatus` | `{ id, status }` | Move an application to a new status (auto-sets `heard_back_at`) |
| `deleteApplication` | `{ id }` | Hard delete an application |
| `getSettings` | — | Return visible fields configuration |
| `updateSettings` | `{ visible_fields }` | Toggle which optional fields are shown |

### Why MCP matters here

The tracker is single-user and local-first. MCP means an AI assistant (Cursor agent, Claude Desktop, etc.) can read and write application data directly through the same HTTP endpoint the app already exposes — no separate API key, no auth layer. This is useful for:
- Voice-adding a job application while browsing
- Bulk updates via natural language
- Dashboard queries from an AI assistant

---

## 8. Design system

Tailwind v4 CSS-native config in `src/styles.css`. Already implements sea/lagoon tokens:

- `--sea-ink`, `--lagoon`, `--palm`, `--sand`, `--foam`, `--surface`, `--line`, `--bg-base`, `--header-bg`, `--chip-bg`, `--chip-line`
- `--hero-a`, `--hero-b` for gradient accents
- Fraunces (display) + Manrope (body) via Google Fonts
- `.island-shell` — glassy panel with border, shadow, inset glint
- `.feature-card` — elevated card with hover lift
- `.page-wrap` — max-width container
- `.display-title` — serif display font
- `.nav-link` — animated underline hover
- `.rise-in` — entrance animation

Reusable component tokens already mapped to shadcn-compatible CSS variables (`--background`, `--foreground`, `--primary`, `--secondary`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`, etc.).

**Status → color mapping**:
- Applied → `--lagoon` / bluey
- Interview → `--palm` / mint
- Offer → yellow/gold
- Rejected → `--destructive` / pink-red

---

## 9. Project structure

```
job-tracker/
├── public/                 # static assets
├── data/
│   └── tracker.db          # gitignored SQLite db
├── src/
│   ├── routeTree.gen.ts    # AUTO-GENERATED by @tanstack/router-plugin (do not edit)
│   ├── components/
│   │   └── ui/               # shadcn/ui components (button, input, label, select, slider, switch, textarea)
│   ├── integrations/
│   │   ├── tanstack-query/
│   │   │   ├── devtools.tsx
│   │   │   └── root-provider.tsx   # QueryClient + TRPCProvider + superjson dehydrate/hydrate
│   │   └── trpc/
│   │       ├── init.ts             # tRPC init (superjson transformer)
│   │       ├── react.ts            # TRPCProvider + useTRPC hooks
│   │       └── router.ts           # tRPC routers: currently `todos` placeholder → refactor to `applications` + `settings`
│   ├── routes/
│   │   ├── __root.tsx      # root layout, fonts, gradient bg, TanStack devtools
│   │   ├── index.tsx       # application list
│   │   ├── new.tsx         # add modal route
│   │   ├── $id.tsx         # edit modal route
│   │   ├── settings.tsx    # field visibility settings
│   │   ├── mcp.ts          # MCP server route (POST /mcp)
│   │   └── api.trpc.$.tsx  # tRPC fetch handler
│   ├── lib/
│   │   └── utils.ts        # cn() helper (clsx + tailwind-merge)
│   ├── env.ts              # @t3-oss/env-core schema
│   ├── router.tsx          # TanStack Router setup (getRouter)
│   ├── styles.css          # Tailwind v4 + custom sea/lagoon design tokens
│   ├── mcp-todos.ts        # MCP todo-store stub (replace with app MCP tools)
│   └── utils/
│       └── mcp-handler.ts  # Generic MCP JSON-RPC handler over in-memory transport
├── biome.json              # Biome lint/format config
├── components.json         # shadcn/ui config
├── vite.config.ts          # Vite + tanstackStart() + tailwindcss() + devtools()
├── tsconfig.json           # ES2022, bundler resolution, #/@ aliases
├── package.json            # see §2
└── bun.lock
```

---

## 10. Build order (suggested)

1. **Scaffold done** ✅ — TanStack Start + Vite + Tailwind v4 + tRPC + TanStack Query + shadcn/ui already wired. **Cleanup required:** remove `todos` tRPC router and `mcp-todos.ts` stub before building real features.
2. **DB layer** — `src/server/db.ts` with `bun:sqlite` singleton + schema bootstrap, then wire into tRPC routers.
3. **List view** — render hardcoded data first to nail the island-shell/card visual treatment, then wire up `applications.list`.
4. **Add form** — modal route `/new`, all preset fields, Zod validation, create mutation end-to-end.
5. **Search + filter** — debounced search input + status chip filter, server-side tRPC query.
6. **Edit + delete** — `/$id` route, prefill form, update mutation, hard delete with confirm.
7. **Settings** — field visibility toggles, plumb through to form + list.
8. **MCP tools** — replace `mcp-todos.ts` stub with real `applications.*` and `settings.*` tools registered on `McpServer`.
9. **Polish** — empty state, loading states, hover lifts, entrance animations.

---

## 11. Things deliberately not included

- Auth — single user, runs locally or on your VPS behind whatever you already trust
- Migrations — schema bootstraps on start; if it changes later, write a one-off migration script
- File uploads (resumes per app) — out of scope, can be a `notes` link to Drive/Dropbox
- Calendar/reminders — out of scope
- Export — easy to add later (just dump the table to CSV/JSON)
- Multi-user / shared lists
- Dark mode — `styles.css` has dark tokens but not a priority
- Mobile-optimized UI — responsive but not a separate native app

---

## 12. Open question

The `heard_back_at` column auto-fills when status leaves `applied`. Want it editable too, or is auto-fill enough? My take: auto-fill on first status change, then leave it alone — simpler and matches what most people actually mean by "heard back."
