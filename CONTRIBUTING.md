# Contributing

Thanks for considering a contribution.

## Setup

```bash
bun install
bun run dev
```

## Before you PR

```bash
bun run check
```

This runs Biome lint + format. CI enforces it.

## Branch naming

- `feat/short-description`
- `fix/short-description`
- `docs/short-description`

## E2E tests

```bash
bun run playwright:install
bun run playwright
```

Keep tests self-contained — they seed their own data.
