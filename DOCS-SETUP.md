# Documentation Setup Guide

This guide explains how to set up and deploy the Trackr documentation site using Docusaurus on GitHub Pages.

## 📁 Documentation Structure

```
docs/
├── docs/                      # Documentation markdown files
│   ├── intro.md              # Landing page
│   ├── getting-started/      # Installation, config, quickstart
│   ├── guides/               # MCP, analytics, OAuth, migrations
│   ├── api/                  # tRPC, MCP tools, database schema
│   └── community/            # Contributing, code of conduct, changelog
├── blog/                      # Blog posts
├── src/css/custom.css        # Custom styling (Trackr theme)
├── static/img/               # Static assets (logo, images)
├── docusaurus.config.ts      # Site configuration
├── sidebars.ts               # Navigation sidebar
├── package.json              # Dependencies
└── README.md                 # Quick reference
```

## 🚀 Quick Start

### Install Dependencies

```bash
cd docs
bun install
```

### Start Development Server

```bash
bun run start
```

Visit http://localhost:3000 to preview.

### Build for Production

```bash
bun run build
```

Output: `docs/build/`

### Preview Production Build

```bash
bun run serve
```

## 🎨 Theme

The documentation uses Trackr's playful cartoon theme:

- **Colors**: Navy ink (#21204c), cream panel (#fff7dc), pink CTA, mint, bluey
- **Fonts**: Baloo 2 (display), Nunito (body)
- **Style**: Bold borders (3-4px), rounded corners (24-32px), hard shadows

Custom styling is in `src/css/custom.css`.

## 📝 Writing Documentation

### File Format

```markdown
---
sidebar_position: 1
---

# Page Title

Content here...
```

### Admonitions

```markdown
:::tip
Helpful tip here
:::

:::warning
Warning message here
:::

:::note
Note here
:::
```

### Links

```markdown
[Internal link](/docs/guides/mcp-integration)
[External link](https://github.com/mrsamdev/trackr)
```

### Code Blocks

````markdown
```typescript
// Code example
const app = await trpc.applications.create.mutate({...});
```
````

## 🌐 Deployment to GitHub Pages

### Automatic Deployment

Documentation is automatically deployed when you push to `main`:

1. GitHub Actions workflow: `.github/workflows/deploy-docs.yml`
2. Builds with `bun run build`
3. Deploys to `gh-pages` branch
4. Live at: `https://mrsamdev.github.io/trackr/`

### Manual Deployment

```bash
# Build
cd docs
bun run build

# Deploy with gh-pages
bun add -d gh-pages
bunx gh-pages -d build
```

### Configuration

Update `docusaurus.config.ts`:

```typescript
const config: Config = {
  url: 'https://mrsamdev.github.io',
  baseUrl: '/trackr/',
  organizationName: 'mrsamdev',
  projectName: 'trackr',
  // ...
};
```

## 📋 Documentation Sections

### Getting Started
- Installation
- Configuration
- Quickstart
- Deployment

### Guides
- MCP Integration
- Analytics Dashboard
- OAuth Setup
- Database Migrations

### API Reference
- tRPC Routes
- MCP Tools
- Database Schema

### Community
- Contributing
- Code of Conduct
- Changelog

## 🧪 Testing

### Check Build

```bash
bun run build
```

Ensure no errors or warnings.

### Test Locally

```bash
bun run start
```

Navigate through all pages to verify:
- Links work
- Images load
- Code blocks render
- Navigation functions

### Validate Links

```bash
bun run build
bun run serve
```

Check for broken links in console.

## 📊 Adding Blog Posts

Create file: `blog/YYYY-MM-DD-title.md`

```markdown
---
slug: my-post
title: My Blog Post
authors: [yourname]
tags: [tag1, tag2]
---

Blog content here...
```

## 🎯 Best Practices

### Content
- Keep pages focused (one topic per page)
- Use clear headings
- Include code examples
- Add screenshots for UI features
- Link to related documentation

### Style
- Follow existing tone (friendly, technical but accessible)
- Use active voice
- Avoid jargon when possible
- Explain acronyms on first use

### Maintenance
- Update docs when features change
- Remove outdated information
- Keep examples current
- Test code snippets

## 🔧 Troubleshooting

### Build Errors

```bash
# Check TypeScript
bunx tsc --noEmit

# Check for syntax errors in markdown
# Look for unclosed tags, invalid frontmatter
```

### Missing Images

Ensure images are in `static/img/` and referenced correctly:

```markdown
![Alt text](/img/image-name.png)
```

### Navigation Issues

Check `sidebars.ts` for correct document IDs:

```typescript
items: ['getting-started/installation'] // matches docs/getting-started/installation.md
```

## 📚 Resources

- [Docusaurus Docs](https://docusaurus.io/docs)
- [Docusaurus API](https://docusaurus.io/docs/api)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages](https://pages.github.com/)

## 🆘 Need Help?

- Check existing docs in `docs/`
- Review Docusaurus documentation
- Open an issue on GitHub

---

**Last Updated**: May 14, 2025
**Version**: 1.2.0
