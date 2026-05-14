---
sidebar_position: 1
---

# MCP Integration

Connect Trackr to AI assistants using the Model Context Protocol (MCP) for natural language application management.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) allows AI assistants like Claude, Cursor, and others to interact with external tools and data sources. Trackr's MCP server enables these assistants to:

- List your job applications
- Create new applications
- Update application status
- Delete applications
- Manage settings

## Quick Setup

### Prerequisites

- Trackr server running (`bun run dev`)
- An AI assistant that supports MCP (Claude Desktop, Cursor, etc.)

### Basic Configuration

Add Trackr to your MCP client configuration:

**Cursor:**
1. Open Settings (Cmd+,)
2. Navigate to MCP
3. Click "Add New MCP Server"
4. Enter:
   - Name: `Trackr`
   - URL: `http://localhost:3000/mcp`
   - Auth: `OAuth` (if enabled)
5. Click **Connect**

**Claude Desktop:**
Add to your Claude config file:

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

**VS Code:**
1. Install the MCP extension
2. Add to `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "trackr": {
      "command": "bun",
      "args": ["run", "src/mcp-applications.ts"]
    }
  }
}
```

## Available Tools

### list_applications

List all your job applications with optional filtering.

**Example prompts:**
```
List all my job applications
Show me applications in "interview" status
What applications have I submitted this week?
```

**Parameters:**
- `status` (optional) - Filter by status
- `limit` (optional) - Maximum results (default: 50)

### create_application

Create a new job application.

**Example prompts:**
```
Add a new application for Senior Engineer at Acme Corp
Create application: Company "TechStart", Position "Frontend Dev", Status "Applied"
Log a new application for Google - Software Engineer role
```

**Required parameters:**
- `company` - Company name
- `position` - Job title
- `status` - Initial status

**Optional parameters:**
- `location` - Job location
- `salary` - Salary range
- `notes` - Additional notes
- `url` - Job posting URL
- `dateApplied` - Application date

### update_application

Update an existing application's details.

**Example prompts:**
```
Update Acme Corp application to "interview" status
Change the notes for my Google application
Mark the TechStart application as rejected
```

**Parameters:**
- `id` - Application ID
- `status` (optional) - New status
- `notes` (optional) - Updated notes
- Other fields as needed

### delete_application

Remove an application from your tracker.

**Example prompts:**
```
Delete the application for Acme Corp
Remove application ID "abc123"
```

**Parameters:**
- `id` - Application ID to delete

### get_application

Retrieve details of a specific application.

**Example prompts:**
```
Show me details for the Google application
Get application by ID "xyz789"
What's the status of my Acme Corp application?
```

**Parameters:**
- `id` - Application ID

## OAuth 2.1 Authentication

Trackr supports OAuth 2.1 for secure MCP access. This is recommended for production use.

### Setup OAuth for MCP

1. **Start Trackr server:**
   ```bash
   bun run dev
   ```

2. **Verify OAuth endpoints:**
   ```bash
   curl http://localhost:3000/.well-known/oauth-authorization-server
   ```

3. **Get access token:**
   ```bash
   bun run scripts/get-oauth-token.ts
   ```
   This opens a browser for authentication and returns an access token.

4. **Test with token:**
   ```bash
   bun run scripts/test-mcp-with-token.ts <access-token>
   ```

### OAuth Configuration

OAuth settings are in `src/lib/auth.ts`:

```typescript
const auth = betterAuth({
  oauthProvider: {
    enabled: true,
    authorizationUrl: '/oauth/authorize',
    tokenUrl: '/oauth/token',
  },
});
```

## Example Workflows

### Daily Check-in

```
Good morning! What's the status of my job applications?
```

**Assistant will:**
- Call `list_applications`
- Summarize applications by status
- Highlight recent updates

### Add Application from Job Posting

```
I just applied for a Senior Backend Engineer role at StartupXYZ. 
The job is remote, salary range $150-180k. 
Here's the URL: https://startupxyz.com/jobs/backend-engineer
```

**Assistant will:**
- Call `create_application` with extracted details
- Confirm the application was added

### Update After Interview

```
I just finished my interview with Acme Corp. 
It went well! Update the status to "interview" and add a note: 
"Technical round completed. Discussed system design and React patterns."
```

**Assistant will:**
- Find the Acme Corp application
- Call `update_application` with new status and notes

### Weekly Review

```
Show me all applications I haven't heard back from in over 2 weeks
```

**Assistant will:**
- Call `list_applications`
- Filter by date and status
- Present applications needing follow-up

## Troubleshooting

### "Unauthorized" Error

**Cause:** Token expired or missing authentication

**Solution:**
```bash
# Get new token
bun run scripts/get-oauth-token.ts
```

### "Connection Refused"

**Cause:** Trackr server not running

**Solution:**
```bash
bun run dev
```

### "Tool Not Found"

**Cause:** MCP server not properly configured

**Solution:**
1. Verify MCP config in your AI assistant
2. Restart the AI assistant
3. Check server logs: `tail -f /tmp/dev-server.log`

### CORS Errors

**Cause:** Browser-based clients blocked by CORS

**Solution:**
Add origins to `src/lib/auth.ts`:

```typescript
oauthProvider({
  corsOrigins: ["https://cursor.sh", "https://claude.ai"],
})
```

## Advanced Usage

### Custom MCP Tools

Add custom tools in `src/mcp-tools/`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export function registerCustomTool(server: McpServer) {
  server.tool(
    "custom-tool-name",
    "Description of what the tool does",
    {
      param1: z.string(),
      param2: z.number(),
    },
    async ({ param1, param2 }) => {
      // Tool implementation
      return { result: "success" };
    }
  );
}
```

### Batch Operations

For bulk operations, use multiple tool calls:

```
Add applications for these companies: Google, Meta, Amazon - all for Senior Engineer positions, status "Applied"
```

The assistant will make multiple `create_application` calls.

## Security Best Practices

- Use OAuth in production environments
- Never share access tokens
- Rotate tokens periodically
- Use HTTPS for production MCP endpoints
- Limit MCP access to necessary tools only

## Next Steps

- [OAuth Setup Guide](/docs/guides/oauth-setup) - Detailed OAuth configuration
- [MCP Auth Setup](/docs/guides/mcp-auth-setup) - Complete authentication guide
- [MCP Client Setup](/docs/guides/mcp-client-setup) - Client-specific configurations

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Trackr MCP Tools](https://github.com/mrsamdev/trackr/tree/main/src/mcp-tools)
