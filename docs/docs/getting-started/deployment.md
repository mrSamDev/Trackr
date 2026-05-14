---
sidebar_position: 4
---

# Deployment to GitHub Pages

Deploy Trackr documentation to GitHub Pages using GitHub Actions.

## Prerequisites

- GitHub account
- Trackr repository on GitHub
- Documentation in `docs/` directory

## Quick Deploy

### 1. Verify Configuration

Ensure `docusaurus.config.ts` has correct settings:

```typescript
const config: Config = {
  url: 'https://mrsamdev.github.io',
  baseUrl: '/trackr/',
  organizationName: 'mrsamdev',
  projectName: 'trackr',
  // ... other config
};
```

**Important:**
- `url` - Your GitHub Pages URL (without `/trackr`)
- `baseUrl` - Your project name with trailing slash
- `organizationName` - Your GitHub username or org
- `projectName` - Your repository name

### 2. GitHub Actions Workflow

The workflow is already configured in `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - name: Install dependencies
        run: bun install
        working-directory: docs
      - name: Build website
        run: bun run build
        working-directory: docs
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` (or your deployment branch)
   - **Folder**: `/ (root)`
4. Click **Save**

### 4. Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**:
   - Select **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### 5. Deploy

Push your changes to trigger deployment:

```bash
git add .
git commit -m "docs: update documentation"
git push origin main
```

GitHub Actions will automatically:
1. Build the documentation
2. Deploy to GitHub Pages
3. Update the deployment status

Your docs will be live at: `https://mrsamdev.github.io/trackr/`

## Manual Deployment

### Build Locally

```bash
cd docs
bun install
bun run build
```

The build output will be in `docs/build/`.

### Test Locally

```bash
bun run serve
```

Visit `http://localhost:3000` to preview.

### Deploy Manually

Using `gh-pages` package:

```bash
# Install gh-pages
bun add -d gh-pages

# Deploy
bunx gh-pages -d build
```

## Custom Domain

### 1. Add CNAME File

Create `docs/static/CNAME`:

```
docs.yourdomain.com
```

### 2. Configure DNS

Add DNS records with your domain provider:

**For subdomain (docs.yourdomain.com):**
```
Type: CNAME
Name: docs
Value: mrsamdev.github.io
```

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### 3. Update Configuration

Update `docusaurus.config.ts`:

```typescript
const config: Config = {
  url: 'https://docs.yourdomain.com',
  baseUrl: '/',
  // ... other config
};
```

### 4. Wait for DNS Propagation

DNS changes can take up to 48 hours to propagate.

## Troubleshooting

### 404 Errors

**Cause:** Incorrect `baseUrl` configuration

**Solution:**
```typescript
// For https://mrsamdev.github.io/trackr/
baseUrl: '/trackr/',

// For https://mrsamdev.github.io/
baseUrl: '/',
```

### Build Fails

**Common issues:**

1. **Missing dependencies:**
   ```bash
   cd docs
   bun install
   ```

2. **TypeScript errors:**
   ```bash
   bunx tsc --noEmit
   ```

3. **Markdown syntax errors:**
   Check for unclosed tags or invalid frontmatter

### Deployment Not Triggering

**Check:**
1. GitHub Actions enabled in repository settings
2. Workflow file in correct location (`.github/workflows/`)
3. Branch name matches workflow trigger (`main`)
4. File changes in `docs/` directory (if using `paths` filter)

### Permissions Error

**Error:** `Resource not accessible by integration`

**Solution:**
1. Go to **Settings** → **Actions** → **General**
2. Enable **Read and write permissions**
3. Re-run the workflow

## CI/CD Best Practices

### Preview Deployments

For pull request previews, add a test workflow:

```yaml
name: Test Deploy

on:
  pull_request:
    branches:
      - main
    paths:
      - 'docs/**'

jobs:
  test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - name: Install dependencies
        run: bun install
        working-directory: docs
      - name: Test build
        run: bun run build
        working-directory: docs
```

### Deployment Notifications

Add Slack or email notifications:

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Documentation deployment failed!"
      }
```

### Version Control

Tag releases for documentation versioning:

```bash
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

## Performance Optimization

### Build Time

Reduce build time:

1. **Cache dependencies:**
   ```yaml
   - uses: actions/cache@v3
     with:
       path: |
         docs/node_modules
         ~/.bun
       key: ${{ runner.os }}-bun-${{ hashFiles('docs/bun.lock') }}
   ```

2. **Limit fetch depth:**
   ```yaml
   - uses: actions/checkout@v4
     with:
       fetch-depth: 0
   ```

### Bundle Size

Reduce bundle size:

1. **Remove unused dependencies**
2. **Optimize images** in `static/img/`
3. **Enable code splitting** in Docusaurus config

## Security

### Secrets Management

Never commit secrets. Use GitHub Secrets:

```yaml
- name: Deploy
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
  run: bun run deploy
```

### Dependency Auditing

Regularly audit dependencies:

```bash
bun audit
```

## Next Steps

- [Contributing](/docs/community/contributing) - Contribute to documentation
- [MCP Integration](./guides/mcp-integration) - AI assistant setup
- [Analytics Dashboard](./guides/analytics-dashboard) - Track usage

## Resources

- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)
- [GitHub Pages Documentation](https://pages.github.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
