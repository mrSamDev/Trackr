---
sidebar_position: 2
---

# MCP Tools

Model Context Protocol server implementation for AI assistant integration.

## Overview

Trackr provides an MCP server that allows AI assistants to interact with your job applications through natural language.

## Server Location

```
src/
├── mcp-applications.ts    # MCP server entry point
├── mcp-tools/             # Tool implementations
│   ├── list.ts
│   ├── add.ts
│   ├── get.ts
│   ├── update-status.ts
│   ├── delete.ts
│   └── settings.ts
└── utils/
    └── mcp-handler.ts     # Request handler
```

## Available Tools

### list_applications

List job applications with optional filtering.

**Tool Name:** `list_applications`

**Description:** Retrieve a list of job applications from the tracker.

**Input Schema:**
```typescript
{
  status?: "applied" | "screening" | "interview" | "offer" | "rejected" | "withdrawn";
  limit?: number;
  offset?: number;
  search?: string;
}
```

**Output:**
```typescript
{
  content: [{
    type: "text";
    text: string; // JSON stringified applications
  }];
}
```

**Example Usage:**
```
"List all my job applications"
"Show me applications in interview status"
"What applications did I submit this week?"
```

**Implementation:**
```typescript
// src/mcp-tools/list.ts
export function registerListTool(server: McpServer) {
  server.tool(
    "list_applications",
    "List job applications with optional filtering",
    {
      status: z.enum(STATUS_VALUES).optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
      search: z.string().optional(),
    },
    async (args) => {
      const ctx = mcpContext.getStore();
      if (!ctx) throw new Error("No user context");
      
      const apps = await appList({ userId: ctx.userId, ...args });
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(apps, null, 2),
        }],
      };
    }
  );
}
```

### create_application

Create a new job application.

**Tool Name:** `create_application`

**Description:** Add a new job application to the tracker.

**Input Schema:**
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

**Required Fields:**
- `company` - Company name
- `position` - Job title
- `status` - Initial status

**Example Usage:**
```
"Add a new application for Senior Engineer at Acme Corp"
"Create application: Company 'TechStart', Position 'Frontend Dev'"
"Log a new application for Google - Software Engineer role"
```

**Implementation:**
```typescript
// src/mcp-tools/add.ts
export function registerAddTool(server: McpServer) {
  server.tool(
    "create_application",
    "Create a new job application",
    {
      company: z.string().min(1),
      position: z.string().min(1),
      status: z.enum(STATUS_VALUES),
      location: z.string().optional(),
      salary: z.string().optional(),
      notes: z.string().optional(),
      url: z.string().url().optional(),
      dateApplied: z.string().optional(),
    },
    async (args) => {
      const ctx = mcpContext.getStore();
      const app = await appCreate({ userId: ctx.userId, ...args });
      return {
        content: [{
          type: "text" as const,
          text: `Created application for ${args.position} at ${args.company}`,
        }],
      };
    }
  );
}
```

### get_application

Retrieve a specific application.

**Tool Name:** `get_application`

**Description:** Get details of a single job application by ID.

**Input Schema:**
```typescript
{
  id: string;
}
```

**Example Usage:**
```
"Show me details for application ID abc123"
"Get the Google application details"
"What's the status of my Acme Corp application?"
```

### update_application

Update application details.

**Tool Name:** `update_application`

**Description:** Update an existing job application.

**Input Schema:**
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

**Example Usage:**
```
"Update Acme Corp application to interview status"
"Change the notes for my Google application"
"Mark the TechStart application as rejected"
```

### update_status

Quick status update.

**Tool Name:** `update_status`

**Description:** Update only the status of an application.

**Input Schema:**
```typescript
{
  id: string;
  status: ApplicationStatus;
}
```

**Example Usage:**
```
"Mark application abc123 as interviewed"
"Update status to offer for the Google role"
```

### delete_application

Remove an application.

**Tool Name:** `delete_application`

**Description:** Delete a job application from the tracker.

**Input Schema:**
```typescript
{
  id: string;
}
```

**Example Usage:**
```
"Delete the application for Acme Corp"
"Remove application ID xyz789"
```

### get_settings

Retrieve user settings.

**Tool Name:** `get_settings`

**Description:** Get current user preferences and settings.

**Output:**
```typescript
{
  theme: "light" | "dark";
  notifications: boolean;
  // ... other settings
}
```

### update_settings

Update user settings.

**Tool Name:** `update_settings`

**Description:** Modify user preferences.

**Input Schema:**
```typescript
{
  theme?: "light" | "dark";
  notifications?: boolean;
  // ... other settings
}
```

## Authentication

### Context Management

MCP tools use `AsyncLocalStorage` to propagate user context:

```typescript
// src/utils/mcp-context.ts
import { AsyncLocalStorage } from "async_hooks";

export interface McpContext {
  userId: string;
}

export const mcpContext = new AsyncLocalStorage<McpContext>();
```

### Handler Setup

```typescript
// src/utils/mcp-handler.ts
export async function handleMcpRequest(request: Request) {
  // Extract session from headers
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  if (!session) {
    return jsonRpcError(-32001, "Unauthorized");
  }
  
  // Wrap transport in ALS context
  return mcpContext.run({ userId: session.user.id }, async () => {
    // Process MCP request
    const response = await clientTransport.send(jsonRpcRequest);
    return response;
  });
}
```

## Error Handling

### JSON-RPC Errors

```typescript
// Standard error codes
const errors = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  UNAUTHORIZED: -32001,
};

// Return error response
return {
  jsonrpc: "2.0",
  id: requestId,
  error: {
    code: -32001,
    message: "Unauthorized: Invalid or missing token",
  },
};
```

### Validation Errors

```typescript
try {
  const result = await toolHandler(args);
  return success(result);
} catch (error) {
  if (error instanceof ZodError) {
    return jsonRpcError(-32602, `Invalid params: ${error.message}`);
  }
  throw error;
}
```

## Testing

### Unit Tests

```typescript
// scripts/test-mcp-oauth.test.ts
import { describe, it, expect } from "bun:test";

describe("MCP OAuth", () => {
  it("discovers OAuth configuration", async () => {
    const response = await fetch(
      "http://localhost:3000/.well-known/oauth-authorization-server"
    );
    expect(response.status).toBe(200);
    const config = await response.json();
    expect(config.issuer).toBeDefined();
  });
  
  it("lists applications with valid token", async () => {
    const token = await getTestToken();
    const response = await fetch("http://localhost:3000/mcp", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "list_applications",
        params: {},
      }),
    });
    expect(response.status).toBe(200);
  });
});
```

### Integration Tests

```bash
# Run test suite
bun test scripts/test-mcp-oauth.test.ts

# Get test token
bun run scripts/get-oauth-token.ts

# Test with token
bun run scripts/test-mcp-with-token.ts <token>
```

## Client Configuration

### Cursor

```json
{
  "mcpServers": {
    "trackr": {
      "command": "bun",
      "args": ["run", "src/mcp-applications.ts"],
      "cwd": "/path/to/trackr"
    }
  }
}
```

### Claude Desktop

```json
{
  "mcpServers": {
    "trackr": {
      "command": "bun",
      "args": ["run", "src/mcp-applications.ts"],
      "env": {
        "DATABASE_URL": "file:./trackr.db"
      }
    }
  }
}
```

### VS Code

```json
{
  "mcp": {
    "servers": {
      "trackr": {
        "command": "bun",
        "args": ["run", "src/mcp-applications.ts"]
      }
    }
  }
}
```

## Best Practices

### Tool Design

- **Single responsibility:** Each tool does one thing well
- **Descriptive names:** Clear, action-oriented names
- **Validation:** Validate all inputs with Zod
- **Error messages:** Helpful, actionable errors

### Security

- **Authentication required:** All tools require valid session
- **User isolation:** Filter all queries by `userId`
- **Input sanitization:** Sanitize user input
- **Rate limiting:** Implement rate limits

### Performance

- **Pagination:** Support limit/offset for list operations
- **Caching:** Cache frequently accessed data
- **Batching:** Support batch operations when possible

## Debugging

### Enable Logging

```typescript
// Add logging to tool handlers
console.log("[MCP] Tool called:", {
  tool: "list_applications",
  args,
  userId: ctx.userId,
});
```

### Check Server Logs

```bash
tail -f /tmp/dev-server.log
```

### Test with curl

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "list_applications",
    "params": {}
  }'
```

## Next Steps

- [MCP Integration Guide](./guides/mcp-integration) - Complete integration tutorial
- [OAuth Setup](./guides/oauth-setup) - Configure authentication
- [tRPC Routes](/docs/api/trpc-routes) - Web API reference
