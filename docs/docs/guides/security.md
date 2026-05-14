---
sidebar_position: 7
---

# Security Best Practices

Secure your Trackr deployment.

## Overview

Important security considerations for production deployments.

## Key Practices

### Secrets Management

- Never commit `.env` files
- Use strong, random secrets
- Rotate secrets periodically

### HTTPS

Always use HTTPS in production:

```env
VITE_APP_URL=https://trackr.yourdomain.com
```

### Authentication

- Require authentication for all protected routes
- Use OAuth 2.1 for MCP clients
- Implement rate limiting

### Database Security

- Use parameterized queries (Drizzle ORM does this)
- Backup regularly
- Encrypt sensitive data at rest

## For More Details

See [Configuration](/docs/getting-started/configuration) and [OAuth Setup](./guides/oauth-setup) for detailed security configuration.
