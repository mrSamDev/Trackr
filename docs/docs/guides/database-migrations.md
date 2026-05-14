---
sidebar_position: 4
---

# Database Migrations

Manage database schema changes with Drizzle Kit.

## Overview

Trackr uses [Drizzle ORM](https://orm.drizzle.team/) with SQLite for database management. Drizzle Kit provides migration tooling for schema versioning.

## Schema Location

Database schema is defined in:
- `src/server/db/schema.ts` - Table definitions
- `drizzle/` - Migration files

## Schema Definition

### Applications Table

```typescript
// src/server/db/schema.ts
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  status: text("status").notNull(),
  location: text("location"),
  salary: text("salary"),
  notes: text("notes"),
  url: text("url"),
  dateApplied: text("date_applied"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
```

### Settings Table

```typescript
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  theme: text("theme").default("light"),
  notifications: integer("notifications", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
```

### Users Table (Better Auth)

```typescript
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
```

## Migration Commands

### Generate Migrations

After modifying the schema:

```bash
bun run db:generate
```

This creates a new migration file in `drizzle/`:

```
drizzle/
├── 0000_initial.sql
├── 0001_add_user_id.sql
└── 0002_add_salary_field.sql
```

### Apply Migrations

```bash
bun run db:migrate
```

This applies pending migrations to your database.

### View Database

Open Drizzle Studio to inspect your database:

```bash
bun run db:studio
```

Access at: `http://localhost:3000`

## Migration Workflow

### 1. Modify Schema

Edit `src/server/db/schema.ts`:

```typescript
// Add new field
export const applications = sqliteTable("applications", {
  // ... existing fields
  coverLetter: text("cover_letter"), // New field
});
```

### 2. Generate Migration

```bash
bun run db:generate
```

Output:
```
✓ Generated migration: drizzle/0003_add_cover_letter.sql
```

### 3. Review Migration

Check the generated SQL:

```sql
-- drizzle/0003_add_cover_letter.sql
ALTER TABLE applications ADD COLUMN cover_letter TEXT;
```

### 4. Apply Migration

```bash
bun run db:migrate
```

Output:
```
✓ Applied migration: 0003_add_cover_letter
```

### 5. Test Changes

Verify the schema in Drizzle Studio:

```bash
bun run db:studio
```

## Manual Migrations

### Create Manual Migration

Sometimes you need custom SQL:

```bash
mkdir -p drizzle/manual
cat > drizzle/manual/001_custom.sql << EOF
-- Custom migration
UPDATE applications SET status = 'archived' WHERE created_at < '2024-01-01';
EOF
```

### Apply Manual Migration

```bash
sqlite3 trackr.db < drizzle/manual/001_custom.sql
```

## Rollback Migrations

:::warning

Drizzle Kit doesn't support automatic rollback. Always backup before migrations.

:::

### Backup Database

```bash
cp trackr.db trackr.db.backup
```

### Manual Rollback

1. Restore backup:
   ```bash
   cp trackr.db.backup trackr.db
   ```

2. Or write reverse SQL:
   ```sql
   ALTER TABLE applications DROP COLUMN cover_letter;
   ```

## Production Migrations

### Migration Strategy

For production deployments:

1. **Backup first:**
   ```bash
   sqlite3 trackr.db ".backup 'production-backup.db'"
   ```

2. **Run migrations:**
   ```bash
   bun run db:migrate
   ```

3. **Verify:**
   ```bash
   sqlite3 trackr.db ".schema"
   ```

### Docker Migrations

Include migration in Docker deployment:

```dockerfile
# Dockerfile
RUN bun run db:migrate
```

Or run as init container:

```yaml
# docker-compose.yml
services:
  app:
    image: trackr
    depends_on:
      migrate:
        condition: service_completed_successfully
  
  migrate:
    image: trackr
    command: bun run db:migrate
    volumes:
      - db-data:/app/data
```

## Schema Changes Examples

### Adding a Column

```typescript
// Before
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
});

// After
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(), // New column
});
```

Generate migration:
```bash
bun run db:generate
```

### Adding an Index

```typescript
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  status: text("status").notNull(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId), // New index
  statusIdx: index("status_idx").on(table.status), // New index
}));
```

### Adding a Foreign Key

```typescript
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, {
    onDelete: "cascade",
  }),
});
```

## Data Seeding

### Create Seed Script

```typescript
// scripts/seed.ts
import { db } from "../src/server/db";
import { applications } from "../src/server/db/schema";

await db.insert(applications).values([
  {
    id: "seed-1",
    userId: "user-1",
    company: "Acme Corp",
    position: "Software Engineer",
    status: "applied",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ... more seed data
]);
```

### Run Seed

```bash
bun run scripts/seed.ts
```

## Performance Optimization

### Indexing Strategy

Add indexes for frequently queried fields:

```typescript
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
  userStatusIdx: index("user_status_idx").on(table.userId, table.status),
}));
```

### Query Optimization

Use indexes in queries:

```typescript
// Good: Uses index
const apps = await db
  .select()
  .from(applications)
  .where(and(
    eq(applications.userId, userId),
    eq(applications.status, "interview")
  ));

// Bad: Full table scan
const apps = await db
  .select()
  .from(applications)
  .where(sql`LOWER(status) = 'interview'`);
```

## Troubleshooting

### Migration Fails

**Error:** `SQLITE_ERROR: duplicate column name`

**Cause:** Column already exists

**Solution:**
1. Check if migration already applied
2. Remove duplicate migration file
3. Or use `ALTER TABLE ADD COLUMN IF NOT EXISTS`

### Schema Drift

**Error:** Schema doesn't match migrations

**Solution:**
1. Drop and recreate database (development only):
   ```bash
   rm trackr.db
   bun run db:migrate
   ```

2. Or manually sync schema

### Locked Database

**Error:** `SQLITE_LOCKED`

**Cause:** Database locked by another process

**Solution:**
1. Close Drizzle Studio
2. Kill any running queries
3. Restart the server

## Best Practices

### Version Control

- ✅ Commit migration files
- ✅ Commit schema changes
- ❌ Never commit database files
- ❌ Never commit `.env` with database paths

### Naming Conventions

- Use snake_case for database columns
- Use descriptive migration names: `add_user_id.sql`
- Prefix with timestamp or sequence: `0001_`, `0002_`

### Testing Migrations

1. Test on development database first
2. Backup production before applying
3. Have rollback plan ready
4. Test with production-like data volume

### Incremental Changes

Make small, incremental schema changes:
- One column per migration
- Test each migration independently
- Document breaking changes

## Next Steps

- [API Reference](/docs/api/database-schema) - Complete schema documentation
- [OAuth Setup](/docs/guides/oauth-setup) - Configure authentication
- [Contributing](/docs/community/contributing) - Contribute improvements
