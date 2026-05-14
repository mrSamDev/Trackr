---
sidebar_position: 3
---

# OAuth Setup

Configure OAuth 2.1 authentication for secure MCP integration and user authentication.

## Overview

Trackr uses [Better Auth](https://better-auth.com/) with GitHub OAuth for user authentication and OAuth 2.1 for MCP client authorization.

## GitHub OAuth Application

### Create OAuth App

1. Navigate to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in details:

   - **Application name**: `Trackr`
   - **Homepage URL**: `http://localhost:3000` (development) or your production URL
   - **Authorization callback URL**: `{VITE_APP_URL/docs/api/auth/callback/github`
   - **Enable Device Flow**: Optional (for CLI tools)

4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

### Environment Variables

Add to your `.env` file:

```env
GITHUB_CLIENT_ID=Iv1.abc123def456...
GITHUB_CLIENT_SECRET=your-client-secret-here
BETTER_AUTH_SECRET=your-auth-secret-here
VITE_APP_URL=http://localhost:3000
```

:::warning

Never commit `.env` files to version control. Add `.env` to your `.gitignore`.

:::

## OAuth 2.1 for MCP

### Authorization Server Discovery

Trackr implements OAuth 2.1 discovery endpoint:

```bash
curl http://localhost:3000/.well-known/oauth-authorization-server
```

**Response:**

```json
{
  "issuer": "http://localhost:3000",
  "authorization_endpoint": "http://localhost:3000/oauth/authorize",
  "token_endpoint": "http://localhost:3000/oauth/token",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code"],
  "code_challenge_methods_supported": ["S256"]
}
```

### Authorization Flow

1. **Client Registration** (optional for trusted clients)
   - MCP clients can register dynamically or use pre-configured credentials

2. **Authorization Request**
   ```
   GET /oauth/authorize?
     response_type=code&
     client_id=CLIENT_ID&
     redirect_uri=REDIRECT_URI&
     scope=read write&
     code_challenge=CHALLENGE&
     code_challenge_method=S256
   ```

3. **User Authorization**
   - User logs in and approves scope
   - Redirected to `redirect_uri` with authorization code

4. **Token Exchange**
   ```
   POST /oauth/token
   Content-Type: application/json

   {
     "grant_type": "authorization_code",
     "code": "AUTH_CODE",
     "redirect_uri": "REDIRECT_URI",
     "client_id": "CLIENT_ID",
     "code_verifier": "VERIFIER"
   }
   ```

5. **Access Token**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIs...",
     "token_type": "Bearer",
     "expires_in": 3600,
     "refresh_token": "refresh-token-here"
   }
   ```

## Testing OAuth

### Test Discovery Endpoint

```bash
curl http://localhost:3000/.well-known/oauth-authorization-server | jq .
```

Expected: Valid JSON with OAuth 2.1 metadata ✅

### Run Test Suite

```bash
bun test scripts/test-mcp-oauth.test.ts
```

Expected: All 8 tests pass ✅

### Get Access Token

Use the provided script:

```bash
bun run scripts/get-oauth-token.ts
```

This will:
1. Open browser for authentication
2. Authorize the application
3. Return access token to clipboard

### Test MCP Endpoint

```bash
bun run scripts/test-mcp-with-token.ts eyJhbGciOiJIUzI1NiIs...
```

Expected: Successful MCP tool invocation ✅

## Client Configuration

### Cursor

1. Open Settings (Cmd+,)
2. Navigate to **MCP** → **Add New MCP Server**
3. Enter:
   - **Name**: `Trackr`
   - **URL**: `http://localhost:3000/mcp`
   - **Auth**: `OAuth`
4. Click **Connect**
5. Complete OAuth flow in browser
6. Done!

### Claude Code

```bash
# Copy configuration
cp mcp-configs/claude-code-mcp.json ~/.claude/mcp.json

# Restart Claude
claude
```

### VS Code

1. Install **MCP** extension
2. Copy `mcp-configs/vscode-settings.json` to `.vscode/settings.json`
3. `Cmd+Shift+P` → **MCP: Connect to Server**

## Token Management

### Token Lifetime

- **Access tokens**: 1 hour (3600 seconds)
- **Refresh tokens**: 7 days (604800 seconds)
- **Session cookies**: 7 days

### Refreshing Tokens

```typescript
// Example token refresh
const response = await fetch('/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'refresh_token',
    refresh_token: 'your-refresh-token',
    client_id: 'your-client-id',
  }),
});

const { access_token } = await response.json();
```

### Token Storage

**Best practices:**
- Store in secure, httpOnly cookies for web apps
- Use keychain/credential manager for desktop apps
- Never store in localStorage for sensitive applications
- Encrypt tokens at rest

## Production Configuration

### HTTPS Requirement

OAuth 2.1 requires HTTPS in production:

```env
VITE_APP_URL=https://trackr.yourdomain.com
```

Configure SSL/TLS:
- Use [Let's Encrypt](https://letsencrypt.org/) for free certificates
- Configure reverse proxy (Nginx, Caddy)
- Or use platforms with built-in HTTPS (Vercel, Netlify)

### CORS Configuration

Add allowed origins to `src/lib/auth.ts`:

```typescript
const auth = betterAuth({
  // ... other config
  oauthProvider: {
    corsOrigins: [
      'https://cursor.sh',
      'https://claude.ai',
      'https://yourdomain.com',
    ],
  },
});
```

### Rate Limiting

Implement rate limiting for OAuth endpoints:

```typescript
// Example rate limiting
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many authentication attempts',
};
```

## Security Best Practices

### PKCE (Proof Key for Code Exchange)

Always use PKCE for authorization code flow:

```typescript
// Generate code verifier and challenge
const verifier = generateCodeVerifier();
const challenge = await generateCodeChallenge(verifier);

// Include in authorization request
const authUrl = `/oauth/authorize?${new URLSearchParams({
  code_challenge: challenge,
  code_challenge_method: 'S256',
})}`;
```

### Scope Management

Request minimal required scopes:

```typescript
const scopes = ['read:applications', 'write:applications'];
// Not: ['*'] or overly broad permissions
```

### Client Authentication

Authenticate MCP clients:

```typescript
// Verify client credentials
if (!isValidClient(clientId, clientSecret)) {
  return error('invalid_client');
}
```

### Audit Logging

Log OAuth events for security monitoring:

```typescript
// Log authentication events
await logAuthEvent({
  eventType: 'token_issued',
  clientId,
  userId,
  timestamp: new Date(),
  ipAddress,
  userAgent,
});
```

## Troubleshooting

### Invalid Redirect URI

**Error:** `redirect_uri_mismatch`

**Cause:** Redirect URI doesn't match registered URI

**Solution:**
1. Check exact match (including trailing slash)
2. Verify `VITE_APP_URL` matches registered URI
3. Update GitHub OAuth app settings

### Token Expired

**Error:** `token_expired` or `401 Unauthorized`

**Solution:**
```bash
# Get new token
bun run scripts/get-oauth-token.ts
```

### CORS Errors

**Error:** `CORS policy blocked`

**Solution:**
1. Add origin to `corsOrigins` in auth config
2. Ensure server sends proper CORS headers
3. Use HTTPS in production

### Discovery Endpoint Not Found

**Error:** `404 Not Found` on `/.well-known/oauth-authorization-server`

**Solution:**
1. Verify server is running: `bun run dev`
2. Check route registration in `src/routes/oauth.ts`
3. Ensure no middleware blocking the endpoint

## Advanced Configuration

### Custom Scopes

Define custom scopes in `src/lib/auth.ts`:

```typescript
const scopes = {
  'read:applications': 'View your applications',
  'write:applications': 'Create and update applications',
  'delete:applications': 'Delete applications',
  'read:analytics': 'View analytics',
};
```

### Dynamic Client Registration

Allow clients to register dynamically:

```typescript
// POST /oauth/register
{
  "client_name": "My MCP Client",
  "redirect_uris": ["https://client.com/callback"],
  "grant_types": ["authorization_code"],
  "response_types": ["code"]
}
```

### Token Introspection

Implement token introspection endpoint:

```typescript
// POST /oauth/introspect
{
  "token": "access-token-here",
  "token_type_hint": "access_token"
}

// Response
{
  "active": true,
  "scope": "read:applications write:applications",
  "client_id": "client-id",
  "exp": 1234567890
}
```

## Resources

- [OAuth 2.1 Specification](https://oauth.net/2.1/)
- [Better Auth OAuth Docs](https://better-auth.com/docs/oauth)
- [RFC 6749 - OAuth 2.0](https://tools.ietf.org/html/rfc6749)
- [RFC 7636 - PKCE](https://tools.ietf.org/html/rfc7636)

## Next Steps

- [MCP Integration](/docs/guides/mcp-integration) - Connect AI assistants
- [MCP Auth Setup](/docs/guides/mcp-auth-setup) - Complete auth guide
- [Security Best Practices](/docs/guides/security) - Secure your deployment
