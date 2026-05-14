---
sidebar_position: 2
---

# Configuration

Configure Trackr for your environment and requirements.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BETTER_AUTH_SECRET` | Secret key for session encryption | `random-base64-string` |
| `GITHUB_CLIENT_ID` | GitHub OAuth application client ID | `Iv1.abc123...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth application client secret | `your-secret-key` |
| `VITE_APP_URL` | Base URL of your application | `http://localhost:3000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Custom database path | `file:./trackr.db` |
| `NODE_ENV` | Environment mode | `development` |

## Database Configuration

Trackr uses SQLite by default, stored in `trackr.db` in the root directory.

### Custom Database Location

```env
DATABASE_URL=file:/path/to/your/database.db
```

### Database Migrations

Trackr uses Drizzle Kit for schema management:

```bash
# Generate new migrations after schema changes
bun run db:generate

# Apply pending migrations
bun run db:migrate

# Open database GUI
bun run db:studio
```

### Schema Location

Database schema is defined in `src/server/db/schema.ts`:

```typescript
// applications table
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  status: text("status").notNull(),
  // ... more fields
});
```

## Authentication Configuration

### GitHub OAuth Settings

Configure your GitHub OAuth app with these settings:

- **Homepage URL**: Your app's URL (e.g., `http://localhost:3000`)
- **Authorization callback URL**: `{VITE_APP_URL/docs/api/auth/callback/github`

### Session Configuration

Session settings are configured in `src/lib/auth.ts`:

```typescript
const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  // ... other config
});
```

## Production Deployment

### Environment-Specific Settings

For production, update your environment variables:

```env
# Production .env
BETTER_AUTH_SECRET=<strong-random-secret>
GITHUB_CLIENT_ID=<production-client-id>
GITHUB_CLIENT_SECRET=<production-client-secret>
VITE_APP_URL=https://trackr.yourdomain.com
```

### Build Configuration

Trackr uses Vite for building:

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Docker Deployment

Trackr includes Docker configuration:

```bash
# Build Docker image
docker build -t trackr .

# Run with Docker Compose
docker-compose up -d
```

See `Dockerfile` and `docker-compose.yml` for configuration details.

## Customization

### Branding

Modify the UI theme in `DESIGN.md` for design tokens and `src/styles.css` for global styles.

### Features

Enable/disable features by modifying the configuration in `src/env.ts`:

```typescript
const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
  },
  client: {
    VITE_APP_URL: z.string(),
  },
});
```

## Security Considerations

### Secrets Management

- Never commit `.env` files to version control
- Use environment-specific secrets in production
- Rotate secrets periodically
- Use strong, randomly generated values for `BETTER_AUTH_SECRET`

### CORS Configuration

If deploying to a different domain, configure CORS in `src/lib/auth.ts`:

```typescript
const auth = betterAuth({
  // ... other config
  trustedOrigins: ['https://yourdomain.com'],
});
```

### Rate Limiting

Consider implementing rate limiting for production deployments to prevent abuse.

## Next Steps

- [Quickstart](/docs/getting-started/quickstart) - Start using Trackr
- [OAuth Setup](/docs/guides/oauth-setup) - Detailed OAuth configuration
- [Database Migrations](/docs/guides/database-migrations) - Managing schema changes
