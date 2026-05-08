# Implementation Todos

## 1. Scaffold
- [x] Create TODOS.md
- [ ] Initialize TanStack Start project structure
- [ ] Configure Tailwind with cartoon design tokens
- [ ] Set up global styles (gradient bg, fonts)
- [ ] Configure `app.config.ts` and root layout

## 2. Database Layer
- [ ] `db.ts` — bun:sqlite singleton + schema bootstrap
- [ ] `applications.ts` — list/create/update/delete server fns
- [ ] `settings.ts` — get/set visible fields

## 3. List View (`/`)
- [ ] Hero strip, search, status filters
- [ ] Application cards/table
- [ ] Empty state
- [ ] Wire `listApplications` server fn

## 4. Add/Edit Form (`/new`, `/$id`)
- [ ] Modal route pattern (overlay on `/`)
- [ ] ApplicationForm component with Zod validation
- [ ] Create + update flows
- [ ] Delete with confirmation

## 5. Search + Filter
- [ ] Debounced search (client)
- [ ] Server-side `LIKE` filter
- [ ] Status chip filters

## 6. Settings (`/settings`)
- [ ] Field visibility toggles
- [ ] Persist to `settings` table
- [ ] Plumb through form + list

## 7. Polish
- [ ] Empty state illustration/message
- [ ] Loading states
- [ ] Hover lifts, decorative touches
- [ ] Final responsive pass
