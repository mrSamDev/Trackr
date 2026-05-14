# Trackr Documentation

This directory contains the Docusaurus documentation site for Trackr.

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run start

# Build for production
bun run build

# Preview production build
bun run serve
```

## Structure

```
docs/
├── docs/           # Documentation markdown files
├── blog/           # Blog posts
├── src/
│   └── css/        # Custom CSS
├── static/
│   └── img/        # Static images
├── docusaurus.config.ts  # Site configuration
├── sidebars.ts     # Navigation sidebar
└── package.json    # Dependencies
```

## Deployment

Documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

See `.github/workflows/deploy-docs.yml` for deployment configuration.

## Writing Documentation

- Use `.md` or `.mdx` files
- Add frontmatter with `sidebar_position` for ordering
- Use Docusaurus admonitions: `:::tip`, `:::warning`, `:::note`
- Link to other docs with `/docs/path/to/doc`

## Customization

- Edit `docusaurus.config.ts` for site configuration
- Modify `src/css/custom.css` for styling
- Update `sidebars.ts` for navigation

## License

MIT
