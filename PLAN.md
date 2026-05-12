# Migration Plan: better-sqlite3 → Drizzle ORM

## Overview

Replace raw `better-sqlite3` SQL with Drizzle ORM for type safety, migrations, and better DX.

---

## Phase 1: Setup & Dependencies

### 1.1 Install packages

```bash
bun add drizzle-orm better-sqlite3
bun add -D drizzle-kit @types/better-sqlite3
```

Keep `better-sqlite3` — Drizzle uses it as the driver.

### 1.2 Create Drizzle config

`drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "data/tracker.db",
  },
});
```

### 1.3 Add migration scripts to `package.json`

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Phase 2: Define Schema

### 2.1 Create `src/server/db/schema.ts`

Define all tables using Drizzle's SQLite API:

- `applications` — main tracking table
- `settings` — key-value config
- `user`, `session`, `account`, `verification` — better-auth tables

Use Drizzle's `sqliteTable`, `text`, `integer`, `real` columns. Add indexes where the raw SQL had them.

Export both the table definitions and the inferred TypeScript types using `InferSelectModel`.

---

## Phase 3: Initialize Drizzle

### 3.1 Replace `src/server/db.ts`

Current: exports a Proxy wrapper around `better-sqlite3`.

New: export a Drizzle instance:

```typescript
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./db/schema";

const sqlite = new Database("data/tracker.db");
export const db = drizzle(sqlite, { schema });
```

Keep lazy initialization if needed for backward compat.

### 3.2 Run initial migration

```bash
bun db:generate
bun db:migrate
```

This creates the `drizzle/` folder with migration files and applies them.

---

## Phase 4: Refactor Queries

### 4.1 Update `src/server/queries.ts`

Replace each raw SQL function with Drizzle equivalents.

**Examples:**

```typescript
// Before
export function appGetById(id: number) {
  return db.prepare("SELECT * FROM applications WHERE id = ?").get(id);
}

// After
import { eq, like, desc, sql } from "drizzle-orm";
import { applications } from "#/server/db/schema";

export function appGetById(id: number) {
  return db.select().from(applications).where(eq(applications.id, id)).get();
}
```

```typescript
// Before
export function appList(opts = {}) {
  // manual SQL building with conditions/params
}

// After
export function appList(opts: { status?: string; search?: string; limit?: number } = {}) {
  let query = db.select().from(applications).orderBy(desc(applications.createdAt));
  
  if (opts.status) {
    query = query.where(eq(applications.status, opts.status));
  }
  if (opts.search?.trim()) {
    query = query.where(
      or(
        like(applications.title, `%${opts.search.trim()}%`),
        like(applications.company, `%${opts.search.trim()}%`)
      )
    );
  }
  if (opts.limit) {
    query = query.limit(opts.limit);
  }
  
  return query.all();
}
```

### 4.2 Functions to migrate

| Function | Drizzle equivalent |
|----------|-------------------|
| `appGetById` | `select().where(eq())` |
| `appGetHeardBackAt` | `select({ heardBackAt: applications.heardBackAt }).where()` |
| `appList` | `select().where().orderBy().limit()` |
| `appCreate` | `insert().values().returning()` |
| `appUpdate` | `update().set().where().returning()` |
| `appUpdateStatus` | `update().set({ status, heardBackAt, updatedAt }).where()` |
| `appDelete` | `delete().where()` |
| `analyticsStatusCounts` | `select({ count: count() }).from()` with conditional sums |
| `analyticsAvgResponseDays` | `select({ avgDays: avg(...) }).from()` |
| `analyticsWeeklyActivity` | `select().groupBy()` with `strftime` |
| `analyticsTopSources` | `select().groupBy().orderBy().limit()` |
| `analyticsTopCompanies` | same as above |
| `settingsGet` | `select().where(eq())` |
| `settingsUpsert` | `insert().onConflictDoUpdate()` |

### 4.3 SQL functions

Drizzle supports `sql` template tag for SQLite functions:

- `julianday()` → `sql` template
- `strftime()` → `sql` template
- `AVG()`, `COUNT()`, `SUM()` → Drizzle aggregations

---

## Phase 5: Update Auth Tables

The `user`, `session`, `account`, `verification` tables are used by better-auth.

### 5.1 Check better-auth Drizzle integration

better-auth has a Drizzle adapter. If using it:

```typescript
import { drizzleAdapter } from "better-auth/adapters/drizzle";

betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { ... }
  }),
  // ...
});
```

### 5.2 If keeping custom auth

Define the tables in `schema.ts` matching the current schema. better-auth will work as long as table structure is unchanged.

---

## Phase 6: Testing

### 6.1 Type checking

```bash
bun tsc --noEmit
```

Drizzle provides full TypeScript types. Fix any type errors.

### 6.2 Run existing tests

```bash
bun test
bun playwright test
```

Verify all queries work correctly.

### 6.3 Manual testing

- Create/edit/delete applications
- Check analytics dashboard
- Verify auth flows work

---

## Phase 7: Cleanup

### 7.1 Remove old code

- Delete `bootstrapSchema()` function
- Remove raw SQL strings from `queries.ts`
- Remove `Proxy` wrapper if no longer needed

### 7.2 Update imports

Ensure all files import `db` from the new `db.ts`.

### 7.3 Document migration commands

Add to `README.md`:

```bash
# After schema changes
bun db:generate  # create migration
bun db:migrate   # apply migration
bun db:studio    # browse data
```

---

## File Structure After Migration

```
src/server/
├── db/
│   ├── index.ts       # Drizzle instance export
│   └── schema.ts      # Table definitions
├── queries.ts         # Refactored to use Drizzle
└── auth.ts            # better-auth config (if separate)

drizzle/               # Migration files (generated)
├── 0000_initial.sql
└── ...

drizzle.config.ts      # Drizzle kit config
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Schema mismatch | Run `drizzle-kit generate` on existing DB, review migration SQL before applying |
| Query behavior changes | Test each query function, compare output |
| better-auth compatibility | Keep table structure identical, only change access layer |
| Performance | Drizzle adds minimal overhead; add indexes if needed |

---

## Estimated Effort

- Setup: 30 min
- Schema definition: 1 hour
- Query refactoring: 2-3 hours
- Testing: 1 hour
- Cleanup: 30 min

**Total: ~5-6 hours**

---

## Next Steps

1. Install dependencies
2. Create `drizzle.config.ts`
3. Define schema in `src/server/db/schema.ts`
4. Generate and run initial migration
5. Refactor `queries.ts` incrementally (one function at a time)
6. Test after each refactor
7. Clean up old code
