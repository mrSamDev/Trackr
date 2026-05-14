---
sidebar_position: 1
---

# tRPC Routes

Type-safe API endpoints built with tRPC v11.

## Overview

Trackr uses [tRPC](https://trpc.io/) for end-to-end type safety. All API routes are defined in `src/integrations/trpc/`.

## Router Structure

```
src/integrations/trpc/
├── init.ts           # tRPC instance initialization
├── applications.ts   # Application CRUD operations
└── settings.ts       # User settings management
```

## Applications Router

### List Applications

Retrieve all applications for the authenticated user.

**Endpoint:** `applications.list`

**Procedure:** `protectedProcedure`

**Input:**
```typescript
{
  status?: ApplicationStatus;
  limit?: number;
  offset?: number;
  search?: string;
}
```

**Output:**
```typescript
{
  applications: Application[];
  total: number;
  hasMore: boolean;
}
```

**Example:**
```typescript
const { data } = await trpc.applications.list.query({
  status: 'interview',
  limit: 10,
});
```

**Implementation:**
```typescript
// src/integrations/trpc/applications.ts
export const applicationsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(STATUS_VALUES).optional(),
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const apps = await appList({ userId, ...input });
      return apps;
    }),
});
```

### Get Application

Retrieve a single application by ID.

**Endpoint:** `applications.get`

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
Application | null
```

**Example:**
```typescript
const application = await trpc.applications.get.query({
  id: "app-123",
});
```

### Create Application

Create a new job application.

**Endpoint:** `applications.create`

**Input:**
```typescript
{
  company: string;
  position: string;
  status: ApplicationStatus;
  location?: string;
  salary?: string;
  notes?: string;
  url?: string;
  dateApplied?: string;
}
```

**Output:**
```typescript
Application
```

**Example:**
```typescript
const newApp = await trpc.applications.create.mutate({
  company: "Acme Corp",
  position: "Senior Engineer",
  status: "applied",
  location: "Remote",
  salary: "$150k-180k",
});
```

### Update Application

Update an existing application.

**Endpoint:** `applications.update`

**Input:**
```typescript
{
  id: string;
  company?: string;
  position?: string;
  status?: ApplicationStatus;
  location?: string;
  salary?: string;
  notes?: string;
  url?: string;
}
```

**Output:**
```typescript
Application
```

**Example:**
```typescript
const updated = await trpc.applications.update.mutate({
  id: "app-123",
  status: "interview",
  notes: "Technical round scheduled for next week",
});
```

### Update Status

Quick update for application status only.

**Endpoint:** `applications.updateStatus`

**Input:**
```typescript
{
  id: string;
  status: ApplicationStatus;
}
```

**Output:**
```typescript
Application
```

**Example:**
```typescript
const updated = await trpc.applications.updateStatus.mutate({
  id: "app-123",
  status: "offer",
});
```

### Delete Application

Remove an application.

**Endpoint:** `applications.delete`

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{ success: boolean }
```

**Example:**
```typescript
await trpc.applications.delete.mutate({
  id: "app-123",
});
```

## Settings Router

### Get Settings

Retrieve user settings.

**Endpoint:** `settings.get`

**Output:**
```typescript
{
  theme: "light" | "dark";
  notifications: boolean;
  // ... other settings
}
```

**Example:**
```typescript
const settings = await trpc.settings.get.query();
```

### Update Settings

Update user settings.

**Endpoint:** `settings.update`

**Input:**
```typescript
{
  theme?: "light" | "dark";
  notifications?: boolean;
  // ... other settings
}
```

**Output:**
```typescript
Settings
```

**Example:**
```typescript
await trpc.settings.update.mutate({
  theme: "dark",
  notifications: false,
});
```

## Analytics Queries

### Get Application Stats

**Endpoint:** `applications.getStats`

**Output:**
```typescript
{
  total: number;
  active: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
}
```

### Get Status Distribution

**Endpoint:** `applications.getStatusDistribution`

**Output:**
```typescript
{
  status: string;
  count: number;
}[]
```

### Get Applications Over Time

**Endpoint:** `applications.getApplicationsOverTime`

**Input:**
```typescript
{
  days: number; // e.g., 30, 60, 90
}
```

**Output:**
```typescript
{
  date: string;
  count: number;
}[]
```

## Error Handling

### Standard Errors

tRPC errors follow standard format:

```typescript
{
  code: "BAD_REQUEST" | "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR";
  message: string;
  data?: any;
}
```

### Custom Error Messages

```typescript
import { TRPCError } from "@trpc/server";

throw new TRPCError({
  code: "NOT_FOUND",
  message: `Application with ID ${id} not found`,
});
```

### Client-Side Error Handling

```typescript
try {
  await trpc.applications.create.mutate(data);
} catch (error) {
  if (error instanceof TRPCClientError) {
    console.error(error.message);
    // Handle specific error codes
    if (error.code === "UNAUTHORIZED") {
      // Redirect to login
    }
  }
}
```

## Authentication

### Protected Procedures

All application and settings routes use `protectedProcedure`:

```typescript
// src/integrations/trpc/init.ts
export const protectedProcedure = procedure.use(isAuthenticated);

// Middleware
export const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
```

### User Context

Authenticated procedures receive user context:

```typescript
.list(async ({ ctx, input }) => {
  const userId = ctx.user.id; // Available in protected procedures
  // ... query logic
});
```

## Type Safety

### Input Validation

All inputs validated with Zod:

```typescript
import { z } from "zod";

const createApplicationSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  status: z.enum(["applied", "interview", "offer", "rejected"]),
  location: z.string().optional(),
  salary: z.string().optional(),
});

// Usage
.input(createApplicationSchema)
```

### Type Inference

Types automatically inferred on client:

```typescript
// Client-side types (no manual definition needed)
type ApplicationListInput = inferRouterInputs<AppRouter>["applications"]["list"];
type ApplicationListOutput = inferRouterOutputs<AppRouter>["applications"]["list"];
```

## React Query Integration

Trackr integrates tRPC with TanStack Query:

```typescript
// In components
const { data, isLoading } = trpc.applications.list.useQuery({
  status: "active",
});

const createMutation = trpc.applications.create.useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries(["applications"]);
  },
});
```

### Prefetching

```typescript
// Prefetch data for faster navigation
await queryClient.prefetchQuery(
  trpc.applications.list.queryOptions({ limit: 10 })
);
```

## Best Practices

### Query Optimization

- Use pagination for large lists
- Implement cursor-based pagination for infinite scroll
- Cache frequently accessed data
- Invalidate queries on mutation

### Security

- Always use protected procedures for user data
- Validate all inputs
- Sanitize user-generated content
- Implement rate limiting

### Performance

```typescript
// Good: Batched queries
const [applications, settings] = await Promise.all([
  trpc.applications.list.query(),
  trpc.settings.get.query(),
]);

// Bad: Sequential queries
const applications = await trpc.applications.list.query();
const settings = await trpc.settings.get.query();
```

## Testing

### Unit Tests

```typescript
// src/integrations/trpc/__tests__/applications.test.ts
import { createCaller } from "../init";

test("list returns user applications", async () => {
  const caller = createCaller({ user: mockUser });
  const result = await caller.applications.list({});
  expect(result.applications).toBeDefined();
});
```

### Integration Tests

```typescript
import { app } from "../init";

test("protected route requires auth", async () => {
  const caller = createCaller({ user: null });
  await expect(caller.applications.list({})).rejects.toThrow("UNAUTHORIZED");
});
```

## Next Steps

- [MCP Tools](./api/mcp-tools) - MCP server API reference
- [Database Schema](./api/database-schema) - Complete database documentation
- [Contributing](/docs/community/contributing) - Contribute to the API
