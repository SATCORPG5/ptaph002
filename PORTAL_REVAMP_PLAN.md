# Portal Revamp Plan — Peace Time Agency (Execution-Ready)

> **Companion doc:** [PORTAL_REVAMP_CONTEXT.md](PORTAL_REVAMP_CONTEXT.md) — read first for audit findings, brand anchors, and rationale.

**Goal:** Modernize all four portals (Creator `/portal`, CRM `/(dashboard)/crm`, Recruiters, Admin) while preserving the "Midnight-on-Rails" peace-time aesthetic — Outfit / Space Grotesk / Michroma type stack, teal `#14B8A6` accent on deep `#080812` surfaces. Output should feel like a cinematic command-center, not a generic SaaS dashboard.

---

## Phase 1 — Foundations (1–2 days, zero visual regression) — ✅ DONE

> **As-built note (2026-05-27):** Teal accent shipped as `--color-portal-accent` / `bg-portal-accent` (NOT `--accent` — that name was already amber `#F59E0B` for admin). Surfaces are `portal-surface-1/2/3`. shadcn `ui` alias → `src/components/shadcn-ui`. `cn()` lives in `src/lib/utils.ts`. See [PORTAL_REVAMP_EXECUTION.md](PORTAL_REVAMP_EXECUTION.md) PR #1 for full deviation list.

**Scope:** Extract tokens, kill hex literals, install primitives.

**Tasks:**
- Extend `globals.css` with semantic tokens: `--accent`, `--accent-soft`, `--accent-hover`, `--surface-1/2/3`, `--ring-focus`, `--dur-fast/base/slow`, `--ease-out-pta`.
- Generate Tailwind theme entries so utilities like `bg-accent`, `bg-surface-2`, `duration-base`, `ease-pta` work.
- `grep -r "#14B8A6\|#080812" src/` → replace each with token utility. CI lint to keep it that way.
- Install `shadcn/ui` (init only, no components yet), `clsx`, `tailwind-merge`, `sonner`, `cmdk`, `@tanstack/react-table`.

**Best techniques to apply:**
- **OKLCH color space** for tokens (`color: oklch(74% 0.13 184)` for teal) — gives perceptually uniform light/dark variants for free.
- **CSS layer ordering** (`@layer base, tokens, components, utilities`) so Tailwind v4 never fights your overrides.
- **Cubic-bezier easing curve** modeled on Apple's: `--ease-out-pta: cubic-bezier(0.22, 1, 0.36, 1)`.
- **Container queries** (`@container`) for the cards — they re-flow based on slot width, not viewport, which matters when the right panel opens.
- **Lint guard:** `eslint-plugin-tailwindcss` + a custom regex rule blocking raw hex in `src/components/**` and `src/app/**` (allow only in `globals.css`).
- **`cn()` helper** = `twMerge(clsx(...))` — the standard composition shape; eliminates className conflicts.

**Exit criteria:** Zero hex literals outside `globals.css`. No pixel diff in screenshots.

---

## Phase 2 — Shared portal primitives (2–3 days) — ✅ DONE

> **As-built note (2026-05-27):** 9 primitives shipped (DeltaChip split out as standalone). Storybook v10 with `@storybook/nextjs-vite` framework — stories import from `@storybook/nextjs-vite`, not `@storybook/react`. `Slot` from `radix-ui` as `Slot.Root`. shadcn added 11 components to `src/components/shadcn-ui/`. `DataTable` carries one accepted React Compiler warning. See [PORTAL_REVAMP_EXECUTION.md](PORTAL_REVAMP_EXECUTION.md) PR #2 for full as-built notes.

**Scope:** Build the canonical component library in `src/components/portal/ui/`.

**Components:**
- `<PortalCard tone="default|elevated|tactical|loading">` — single card. `tactical` adds Michroma border-corners (HUD frame).
- `<StatTile>` — Outfit Black numeral + Michroma label + animated delta chip (`+12.4% ↑`).
- `<TacticalLabel>` — `font-mono uppercase tracking-[0.2em] text-foreground/40`; the HUD voice.
- `<SectionHeader>` — Outfit display headline, optional Michroma eyebrow, right-slot actions.
- `<DataTable>` — TanStack Table v8 wrapper with sticky header, density toggle, column visibility, URL-synced sort/filter.
- `<CommandPalette>` — ⌘K via shadcn `Command`; absorbs the inline search in [TopBar.tsx](src/components/portal/TopBar.tsx).
- `<DeltaChip>`, `<StatusPill>`, `<TacticalDivider>` (animated scan-line on mount).

**Best techniques:**
- **CVA (class-variance-authority)** for variants — every primitive uses it; type-safe `tone`/`size`/`density` props.
- **Compound component pattern** for `PortalCard` (`PortalCard.Header`, `.Body`, `.Footer`) — composable without prop bloat.
- **Headless first**: every primitive accepts `asChild` (Radix Slot) so consumers control the wrapper element. Critical for `Link`-wrapped tiles.
- **TanStack Table with server-side mode toggle** — same component works for in-memory and paged remote data; supports virtualization (`@tanstack/react-virtual`) once row counts pass ~200.
- **`useMemo` columns + `getRowId`** to prevent the classic TanStack remount bug.
- **`tabular-nums` + `font-variant-numeric: slashed-zero`** on every numeric tile — numbers don't dance during animation.
- **Storybook (CSF3) or Ladle** to document each primitive in isolation; pairs with Chromatic for visual regression.
- **A11y baked in**: every primitive has axe tests; focus-visible rings derived from `--ring-focus`.

**Exit criteria:** ✅ All 9 primitives shipped and barrel-exported. Storybook stories written (one per primitive, all variants). `npm run build` green, lint +1 warning (accepted). Visual Storybook verification pending manual run.

---

## Phase 3 — Shell modernization (2 days)

**Scope:** Refactor `PortalShell`, `TopBar`, `LeftSidebar`, `RightPanel`, `BottomNav`.

**Changes:**
- Replace mobile-sidebar overlay in [PortalShell.tsx:63-78](src/components/portal/PortalShell.tsx:63) with shadcn `Sheet`.
- Replace inline dropdowns in [TopBar.tsx](src/components/portal/TopBar.tsx) with Radix `DropdownMenu`.
- Lift search → `⌘K` palette; keep a "Search" button hint with the keyboard chord rendered in Michroma.
- Bump type scale: `text-[9px]/[10px]` → `text-xs (12px)` with proper line-height; reserve smaller sizes for Michroma labels only.
- Sidebar: collapse to **icon rail with hover-expand** + persistent expanded state in `localStorage`. Group items under Michroma section labels (OPERATIONS / ACCOUNT / ADMIN).
- Add a **Status Rail** under TopMomentumBar: `Operational • 28 LIVE • SYNCED 14:22:08 UTC` — the peace-time signature line.

**Best techniques:**
- **`useLayoutEffect` + CSS variables** for sidebar width (`--sidebar-w: 240px|64px`) — no layout flash on mount.
- **`useHotkeys` (react-hotkeys-hook)** for `⌘K`, `g h`, `g c`, `?` (shortcuts cheatsheet).
- **View Transitions API** (`document.startViewTransition`) for the sidebar collapse — native, GPU-accelerated, falls back gracefully.
- **Skeleton-while-fetching** pattern using React Suspense boundaries at the shell level — no spinner anywhere.
- **`next/navigation` `usePathname` for active states** combined with `prefers-reduced-motion`-aware highlight animation (Framer `layoutId`).
- **Optimistic notifications** via `useOptimistic` — mark-all-read updates instantly, server confirms async.
- **Intl.RelativeTimeFormat** for "2m ago" timestamps — locale-aware, replaces the hardcoded strings in [TopBar.tsx:26-29](src/components/portal/TopBar.tsx:26).

**Exit criteria:** Sidebar/topbar feel native on desktop + mobile; ⌘K works from any portal; status rail live.

---

## Phase 4 — Per-portal polish (3–4 days)

### Creator Portal (`/portal/*`)
- Home becomes a **3-column momentum grid**: Today's stats (StatTiles) / Live floor preview / Inbox & approvals.
- Replace existing ActivityRing with SVG ring animating from 0 on mount via Framer variants.
- Creative Studio: asset grid with **dnd-kit** for drag-to-reorder, lightbox on click.

**Best techniques:** Framer `LayoutGroup` for cross-card animations; **`next/image` with `placeholder="blur"`** for all creator thumbnails; **`useInView` + IntersectionObserver** to defer ring animations off-screen.

### CRM (`/(dashboard)/crm`)
- Unify into `DataTable` + slide-over detail (`Sheet`).
- Pipeline stage as Michroma chips with hover popovers.

**Best techniques:** **Optimistic stage updates** via server actions + `useOptimistic`; **URL state for filters** (nuqs library) so views are shareable; **keyboard navigation** (j/k to row, enter to open) for power users.

### Recruiters (`/recruiters`)
- Convert list to `DataTable`.
- Detail page → two-pane (profile rail + tabbed content with shadcn `Tabs`).

**Best techniques:** **`parallel routes`** for the list+detail layout so the list doesn't unmount on selection; **prefetch on hover** via `<Link prefetch>`.

### Admin (`/admin`)
- Wrap in PortalShell with **admin accent variant** — keep teal primary, reserve subtle red-orange for destructive confirmations only.
- Confirmation dialogs use shadcn `AlertDialog` with typed-name confirmation for destructive ops.

**Best techniques:** **RBAC guard at the layout** (server component), not per-page; **audit log toast** via `sonner` after each admin action; **double-submit prevention** on server actions via idempotency keys.

---

## Phase 5 — Motion, finish, accessibility (1 day)

**Scope:** Polish pass + verification.

- **Page transitions:** wrap each portal `layout.tsx` content in `motion.div` (fade + 4px y, 200ms, `ease-pta`).
- **Skeleton loaders** for every Suspense boundary — match real layout dimensions exactly (no CLS).
- **Focus ring audit:** visible `--ring-focus` on every interactive element.
- **`prefers-reduced-motion`** branch in Framer (`MotionConfig reducedMotion="user"`).

**Best techniques:**
- **`axe-core` + Playwright** automated a11y sweep across every portal route.
- **Lighthouse CI** budget in GitHub Actions: LCP < 2.0s, CLS < 0.05, INP < 200ms.
- **Bundle analyzer** (`@next/bundle-analyzer`) — flag any portal route > 200kb gzipped.
- **Real-device test** via BrowserStack on iOS Safari + Android Chrome (the actual creator demographic).
- **Visual regression** via Chromatic against Storybook stories — fail PR on unintended changes.

**Exit criteria:** Lighthouse ≥ 95 on Performance + Accessibility for all portal routes.

---

## Execution order

1. **PR #1 (Phase 1)** — token extraction + shadcn init + lint guard. Zero visual change.
2. **PR #2 (Phase 2)** — primitives library + Storybook.
3. **PR #3 (Phase 3)** — shell refactor + ⌘K palette.
4. **PR #4–7 (Phase 4)** — one PR per portal (Creator → CRM → Recruiters → Admin).
5. **PR #8 (Phase 5)** — motion / a11y / perf finish.

Every phase ships independently; no phase blocks on a later one.

---

## Phase checklist (tick as PRs land)

- [x] Phase 1 — Foundations (commit `85fa039`, pushed 2026-05-27; PR not yet merged)
- [x] Phase 2 — Shared primitives (commit `4545480`, pushed 2026-05-27; PR not yet merged)
- [ ] Phase 3 — Shell modernization
- [ ] Phase 4a — Creator Portal
- [ ] Phase 4b — CRM
- [ ] Phase 4c — Recruiters
- [ ] Phase 4d — Admin
- [ ] Phase 5 — Motion + a11y + perf
