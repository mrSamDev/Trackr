---
sidebar_position: 3
---

# Database Schema

Complete reference for Trackr's database structure.

## Overview

Trackr uses SQLite with [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations. All tables are defined in `src/server/db/schema.ts`.

## Tables

### users

Managed by Better Auth for user authentication.

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

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Unique user identifier |
| `name` | text | NOT NULL | User's display name |
| `email` | text | NOT NULL, UNIQUE | User's email address |
| `emailVerified` | integer | NOT NULL | Email verification status (0/1) |
| `image` | text | NULLABLE | Profile picture URL |
| `createdAt` | text | NOT NULL | Account creation timestamp |
| `updatedAt` | text | NOT NULL | Last update timestamp |

**Indexes:**
- `email` (unique)

**Relations:**
- One-to-many with `applications`
- One-to-one with `settings`

### applications

Core table for tracking job applications.

```typescript
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, {
    onDelete: "cascade",
  }),
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
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
  userStatusIdx: index("user_status_idx").on(table.userId, table.status),
}));
```

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Unique application identifier |
| `userId` | text | NOT NULL, FK | Reference to user |
| `company` | text | NOT NULL | Company name |
| `position` | text | NOT NULL | Job title |
| `status` | text | NOT NULL | Application status |
| `location` | text | NULLABLE | Job location (remote, hybrid, etc.) |
| `salary` | text | NULLABLE | Salary range |
| `notes` | text | NULLABLE | Additional notes |
| `url` | text | NULLABLE | Job posting URL |
| `dateApplied` | text | NULLABLE | Application submission date |
| `createdAt` | text | NOT NULL | Record creation timestamp |
| `updatedAt` | text | NOT NULL | Last update timestamp |

**Indexes:**
- `user_id_idx` - Fast lookup by user
- `status_idx` - Filter by status
- `created_at_idx` - Sort by date
- `user_status_idx` - Composite index for common queries

**Status Values:**
```typescript
type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";
```

**Relations:**
- Many-to-one with `users` (cascade delete)

**Example Queries:**

```typescript
// List applications for user
const apps = await db
  .select()
  .from(applications)
  .where(eq(applications.userId, userId))
  .orderBy(desc(applications.createdAt));

// Filter by status
const interviews = await db
  .select()
  .from(applications)
  .where(
    and(
      eq(applications.userId, userId),
      eq(applications.status, "interview")
    )
  );

// Count by status
const stats = await db
  .select({
    status: applications.status,
    count: sql`count(*)`,
  })
  .from(applications)
  .where(eq(applications.userId, userId))
  .groupBy(applications.status);
```

### settings

User preferences and configuration.

```typescript
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, {
    onDelete: "cascade",
  }),
  theme: text("theme").default("light"),
  notifications: integer("notifications", { mode: "boolean" }).default(true),
  emailDigest: integer("email_digest", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
```

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Unique settings identifier |
| `userId` | text | NOT NULL, FK, UNIQUE | Reference to user |
| `theme` | text | DEFAULT 'light' | UI theme preference |
| `notifications` | integer | DEFAULT true | Push notification setting |
| `emailDigest` | integer | DEFAULT false | Email digest subscription |
| `createdAt` | text | NOT NULL | Record creation timestamp |
| `updatedAt` | text | NOT NULL | Last update timestamp |

**Relations:**
- One-to-one with `users` (cascade delete)

**Example Queries:**

```typescript
// Get user settings
const settings = await db
  .select()
  .from(settings)
  .where(eq(settings.userId, userId))
  .get();

// Upsert settings
await db
  .insert(settings)
  .values({
    userId,
    theme: "dark",
    notifications: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  .onConflictDoUpdate({
    target: settings.userId,
    set: {
      theme: "dark",
      updatedAt: new Date().toISOString(),
    },
  });
```

### sessions (Better Auth)

OAuth and session management.

```typescript
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
```

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Unique session identifier |
| `userId` | text | NOT NULL, FK | Reference to user |
| `expiresAt` | text | NOT NULL | Session expiration timestamp |
| `ipAddress` | text | NULLABLE | Client IP address |
| `userAgent` | text | NULLABLE | Client user agent string |
| `createdAt` | text | NOT NULL | Session creation timestamp |
| `updatedAt` | text | NOT NULL | Last update timestamp |

**Relations:**
- Many-to-one with `users` (cascade delete)

### accounts (Better Auth)

Linked OAuth accounts.

```typescript
export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: text("access_token_expires_at"),
  refreshTokenExpiresAt: text("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
```

**Fields:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Unique account identifier |
| `userId` | text | NOT NULL, FK | Reference to user |
| `accountId` | text | NOT NULL | Provider's account ID |
| `providerId` | text | NOT NULL | Provider name (e.g., "github") |
| `accessToken` | text | NULLABLE | OAuth access token |
| `refreshToken` | text | NULLABLE | OAuth refresh token |
| `accessTokenExpiresAt` | text | NULLABLE | Access token expiration |
| `refreshTokenExpiresAt` | text | NULLABLE | Refresh token expiration |
| `scope` | text | NULLABLE | OAuth scopes granted |
| `idToken` | text | NULLABLE | OIDC ID token |
| `password` | text | NULLABLE | Hashed password (for email auth) |
| `createdAt` | text | NOT NULL | Account link creation timestamp |
| `updatedAt` | text | NOT NULL | Last update timestamp |

**Relations:**
- Many-to-one with `users` (cascade delete)

### verifications (Better Auth)

Email verification and password reset tokens.

```typescript
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});
```

## Relationships Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│applications │    │  settings   │
│  (many)     │    │   (one)     │
└─────────────┘    └─────────────┘

       │
       ▼
┌─────────────┐
│  sessions   │
│   (many)    │
└─────────────┘

       │
       ▼
┌─────────────┐
│  accounts   │
│   (many)    │
└─────────────┘
```

## Migrations

### Generate Migration

```bash
bun run db:generate
```

### Apply Migration

```bash
bun run db:migrate
```

### View Schema

```bash
bun run db:studio
```

## Common Queries

### Get User with Applications

```typescript
const userWithApps = await db
  .select({
    user: user,
    application: applications,
  })
  .from(user)
  .leftJoin(applications, eq(applications.userId, user.id))
  .where(eq(user.id, userId));
```

### Cascade Delete

When a user is deleted, all related data is automatically removed:

```typescript
// This automatically deletes applications, settings, sessions, accounts
await db.delete(user).where(eq(user.id, userId));
```

### Analytics Queries

```typescript
// Applications per day
const appsPerDay = await db
  .select({
    date: sql<string>`date(created_at)`,
    count: sql<number>`count(*)`,
  })
  .from(applications)
  .where(eq(applications.userId, userId))
  .groupBy(sql`date(created_at)`)
  .orderBy(sql`date(created_at) DESC`);

// Status distribution
const statusDist = await db
  .select({
    status: applications.status,
    count: sql<number>`count(*)`,
  })
  .from(applications)
  .where(eq(applications.userId, userId))
  .groupBy(applications.status);
```

## Best Practices

### Indexing

- Index foreign keys (`userId`)
- Index frequently filtered columns (`status`, `createdAt`)
- Use composite indexes for common query patterns

### Data Types

- Use `text` for all string fields (SQLite doesn't have VARCHAR)
- Use `integer` with `mode: "boolean"` for booleans
- Store dates as ISO 8601 strings in `text` fields

### Constraints

- Always define `ON DELETE CASCADE` for foreign keys
- Use `NOT NULL` where appropriate
- Add `UNIQUE` constraints for natural keys

### Performance

- Use `.get()` for single row queries
- Use pagination for large result sets
- Avoid `SELECT *` in production code

## Next Steps

- [tRPC Routes](/docs/api/trpc-routes) - API endpoints
- [MCP Tools](/docs/api/mcp-tools) - AI assistant integration
- [Database Migrations](./guides/database-migrations) - Schema management
