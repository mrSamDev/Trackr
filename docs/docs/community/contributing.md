---
sidebar_position: 1
---

# Contributing

Thank you for considering contributing to Trackr!

## Quick Start

```bash
# Fork and clone
git clone https://github.com/your-username/trackr.git
cd trackr

# Install dependencies
bun install

# Start development server
bun run dev
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes
- `chore/` - Maintenance tasks

### 2. Make Changes

Follow the [Code Style Guide](./community/code-style) for all contributions.

**Key principles:**
- Keep files under 200 lines
- Write pure functions
- Use TypeScript properly (no `any`)
- Write tests for new features
- Comment the "why", not the "what"

### 3. Test Your Changes

```bash
# Run type checking
bun run ts-check

# Run linter
bun run lint

# Run formatter
bun run format

# Run all checks
bun run check

# Run unit tests
bun run test

# Run E2E tests
bun run playwright
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit message format:**
```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```
feat: add application filtering by status
fix: resolve OAuth token refresh issue
docs: update MCP integration guide
refactor: simplify analytics queries
```

### 5. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create a pull request on GitHub.

## Pull Request Guidelines

### PR Title

Follow the same format as commit messages:
```
feat: add application filtering
fix: resolve OAuth token issue
```

### PR Description

Use the provided template. Include:

- **What** - What changes does this PR make?
- **Why** - Why are these changes needed?
- **How** - How did you test these changes?
- **Screenshots** - For UI changes (if applicable)

### Before Submitting

Checklist:

- [ ] Code follows style guide
- [ ] Tests pass locally
- [ ] Linter passes
- [ ] Type checking passes
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear

## Code Review

### Reviewers Will Check

- Code quality and readability
- Test coverage
- Performance implications
- Security considerations
- Documentation completeness

### Responding to Feedback

- Be respectful and professional
- Ask clarifying questions if needed
- Make requested changes promptly
- Push new commits (don't force push during review)

## Testing

### Unit Tests

Located in `__tests__` directories alongside source files.

```typescript
// Example test
import { describe, it, expect } from "bun:test";

describe("application utils", () => {
  it("formats application status correctly", () => {
    expect(formatStatus("applied")).toBe("Applied");
  });
});
```

Run with:
```bash
bun run test
```

### E2E Tests

Located in `tests/` directory.

```typescript
// Example E2E test
import { test, expect } from "@playwright/test";

test("creates new application", async ({ page }) => {
  await page.goto("/new");
  await page.fill('[name="company"]', "Acme Corp");
  await page.fill('[name="position"]', "Engineer");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/applications\/.+/);
});
```

Run with:
```bash
bun run playwright
```

### Test Coverage

Aim for:
- 80%+ unit test coverage
- Critical paths covered by E2E tests
- All new features include tests

## Documentation

### When to Update Docs

- New features
- Changed behavior
- Bug fixes that affect users
- Configuration changes
- API changes

### Documentation Structure

```
docs/
├── docs/
│   ├── getting-started/
│   ├── guides/
│   ├── api/
│   └── community/
└── blog/
```

### Writing Style

- Clear and concise
- Include code examples
- Use active voice
- Avoid jargon when possible
- Link to related documentation

## MCP Tools

### Adding New MCP Tools

1. Create new file in `src/mcp-tools/`
2. Register tool in `src/mcp-applications.ts`
3. Add tests in `scripts/test-mcp-oauth.test.ts`
4. Update documentation

```typescript
// src/mcp-tools/your-tool.ts
export function registerYourTool(server: McpServer) {
  server.tool(
    "your_tool_name",
    "Description of what the tool does",
    {
      param1: z.string(),
    },
    async (args) => {
      // Implementation
      return { content: [{ type: "text", text: "result" }] };
    }
  );
}
```

## Database Migrations

### Adding New Tables

1. Update `src/server/db/schema.ts`
2. Generate migration: `bun run db:generate`
3. Test migration locally
4. Include migration in PR

### Modifying Existing Tables

```typescript
// Add new field
export const applications = sqliteTable("applications", {
  // ... existing fields
  newField: text("new_field"),
});
```

Then:
```bash
bun run db:generate
bun run db:migrate
```

## Security

### Security Checklist

- [ ] No sensitive data in logs
- [ ] All user input validated
- [ ] SQL injection prevented (use Drizzle ORM)
- [ ] XSS prevented (React escapes by default)
- [ ] CSRF protection enabled
- [ ] Authentication required for protected routes

### Reporting Security Issues

For security vulnerabilities, please email directly instead of creating a public issue.

## Release Process

### Version Numbering

Trackr follows [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- `MAJOR` - Breaking changes
- `MINOR` - New features (backwards compatible)
- `PATCH` - Bug fixes (backwards compatible)

### Changelog

Update `CHANGELOG.md` with:

```markdown
## [1.2.0] - 2025-01-15

### Added
- New application filtering feature
- MCP tool for bulk operations

### Changed
- Improved analytics performance

### Fixed
- OAuth token refresh issue
```

## Getting Help

- 💬 [GitHub Discussions](https://github.com/mrsamdev/trackr/discussions)
- 🐛 [Issue Tracker](https://github.com/mrsamdev/trackr/issues)
- 📧 Email maintainer

## Code of Conduct

Please read our [Code of Conduct](./community/code-of-conduct) before contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
