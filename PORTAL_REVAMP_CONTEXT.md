# Portal Revamp — Context & Rationale

> **Purpose of this doc:** Background, audit findings, and design rationale for the portal revamp. The execution plan lives in [PORTAL_REVAMP_PLAN.md](PORTAL_REVAMP_PLAN.md). Read this first when picking up the work cold.

> **⚠️ As-built correction (Phase 1, 2026-05-27):** The teal `#14B8A6` / deep `#080812` palette is the **portal accent only** — it is now tokenized as `--color-portal-accent` / `--color-portal-surface-1`. The **global** brand in `globals.css` is actually coral `#FF3C5F` + violet `#A78BFA` on `#01020A`, and `--color-accent` is **amber `#F59E0B`** (admin). Don't conflate them or remap global `--color-primary`/`--color-accent`.

> **⚠️ As-built correction (Phase 2, 2026-05-27):** Storybook installed as `@storybook/nextjs-vite` (v10, Vite-based), **not** `@storybook/nextjs` (webpack). Story files must import `Meta`/`StoryObj` from `@storybook/nextjs-vite`, not `@storybook/react` (ESLint rule `storybook/no-renderer-packages` enforces this). `Slot` is imported from the unified `radix-ui` package as `Slot.Root`, not from `@radix-ui/react-slot`. `DataTable` carries one unavoidable lint warning (`react-hooks/incompatible-library`) due to TanStack Table's `useReactTable` not being memoizable by React Compiler — accepted baseline. Storybook boilerplate `src/stories/` directory was removed; only our stories in `src/components/portal/ui/` exist. shadcn added 11 files to `src/components/shadcn-ui/` (includes `input`, `input-group`, `textarea` as peer deps beyond the 8 explicitly requested).

> **⚠️ As-built correction (Phase 3, 2026-05-27):** The ⌘K palette needs **no `react-hotkeys-hook`** — `<CommandPalette>` self-mounts its own keydown listener, so the dep (installed per plan) is unused for now. shadcn `DropdownMenu`/`Sheet` render **unstyled by default** in this project: there are no `--color-popover` / `accent-foreground` tokens, and `--color-accent` is amber — so every shadcn overlay must get explicit `className` overrides (`bg-background-elevated border-border`, `focus:bg-portal-accent/[0.08] data-[highlighted]:…`). Search items now live in `src/components/portal/nav-targets.ts` (`NAV_TARGETS`), not inline in `TopBar`. Sidebar expanded state persists to `localStorage` key **`pta:sidebar-expanded`**. Sidebar sections are **OPERATIONS / ACCOUNT / ADMIN** (renamed from Departments / My Space). The mobile hamburger trigger in `TopBar` is genuinely new — the old mobile-overlay code had no trigger wired. Effects that set state (live clock, localStorage restore) must wrap the `setState` in a named local fn to satisfy `react-hooks/set-state-in-effect`. Full list: [PORTAL_REVAMP_EXECUTION.md](PORTAL_REVAMP_EXECUTION.md) PR #3.

---

## Goal

Modernize the four portals (Creator `/portal`, CRM `/(dashboard)/crm`, Recruiters, Admin) without breaking the brand. Keep the "Midnight-on-Rails" peace-time aesthetic — Outfit / Space Grotesk / Michroma type stack, teal `#14B8A6` accent, deep `#080812` surfaces — and push it from "competent dashboard" toward a polished, cinematic command-center feel.

---

## Audit findings (the honest baseline)

### What's already strong
- Solid token system (`bg-background-surface`, `border-border-subtle`, teal accent) and Tailwind v4 theme.
- Framer Motion is already wired into [PortalShell.tsx](src/components/portal/PortalShell.tsx) and [TopBar.tsx](src/components/portal/TopBar.tsx).
- Shell is responsive with desktop sidebar + mobile bottom nav.

### What's holding it back
- ~~Heavy inline hex (`#14B8A6`, `#080812`) scattered across components~~ ✅ **Fixed in Phase 1** — migrated to `bg-portal-accent` / `bg-portal-surface-1` tokens; ESLint guard prevents re-introduction in classNames.
- ~~Type sizes are very small (`text-[9px]`, `text-[10px]`) and weights are uniformly black — visually flat, no clear hierarchy.~~ ✅ **Partly fixed in Phase 3** — shell `text-[8px]/[9px]` bumped to `text-[10px]/[11px]`; `text-[10px]` reserved for Michroma tactical labels. Per-portal page type still pending (Phase 4).
- ~~No shared primitives. `TopBar`, `RightPanel`, and admin pages all hand-roll their own dropdowns, cards, and pill chips.~~ ✅ **Fixed in Phase 2** — 9 primitives in `src/components/portal/ui/`: PortalCard, StatTile, TacticalLabel, SectionHeader, DataTable, CommandPalette, DeltaChip, StatusPill, TacticalDivider. Barrel-exported via `index.ts`. shadcn components (button, command, dialog, dropdown-menu, sheet, tabs, tooltip, alert-dialog) available in `src/components/shadcn-ui/`.
- ~~Mixed surfaces: `bg-foreground/[0.03]`, `bg-[#080812]`, `bg-background-elevated` — three ways to say "card."~~ ✅ **Fixed in Phase 2** — `PortalCard` is the single card primitive; `tone="default|elevated|tactical|loading"` CVA variants cover all cases.
- ~~Search/notifications/avatar are bespoke per portal. Recruiters and admin look like a different product.~~ ✅ **Fixed for the Creator shell in Phase 3** — search is now the global ⌘K `CommandPalette`; notifications + avatar use shadcn `DropdownMenu`. Recruiters/Admin still need their shells aligned (Phase 4c/4d).
- No motion language — animations are ad-hoc `duration: 0.15` per component. *(Phase 3 wrapped the shell in `MotionConfig reducedMotion="user"`; full motion-token sweep + page transitions remain a Phase 5 target.)*

---

## Design principles

1. **One system, four skins.** Same shell, same primitives — portal "personality" comes from accent saturation and density, not custom components.
2. **HUD, not dashboard.** Lean into the Michroma tactical accents the brand guide already calls out — stat labels, timestamps, IDs in mono with `tracking-[0.2em]`.
3. **Quieter surfaces, louder data.** Reduce surface contrast (one card style), increase numeric/headline contrast (Outfit Black at real sizes).
4. **Motion as feedback, not decoration.** Standardize on three durations (120ms micro, 200ms panel, 400ms route) and one easing curve.
5. **Touch the tokens, not the components.** All color/spacing changes happen in [globals.css](src/app/globals.css) tokens — components stay pure.

---

## Brand anchors (do not drift)

From [Brand_Font_Guidelines.md](Brand_Font_Guidelines.md):
- **Outfit** (Bold 700 / Black 900, tracking-tighter) — display + headlines + logo.
- **Space Grotesk** (Regular 400 / Medium 500) — body, navigation, buttons.
- **Michroma** (Regular 400, tracking-[0.2em]) — tactical HUD elements, stats labels, IDs.
- Tailwind v4 vars: `--font-sans: "Space Grotesk"`, `--font-display: "Outfit"`, `--font-mono: "Michroma"`.

Peace-time visual signature:
- Deep `#080812` base, near-black surfaces, teal `#14B8A6` as the only chromatic accent.
- Tactical mono labels (uppercase, wide-tracked) for any caption that isn't a sentence.
- Numbers always `tabular-nums` + `slashed-zero` — they don't dance during animation.

---

## Scope boundaries

**In scope:** Pure UI/UX revamp of portal routes. Token system. Shared primitives. Shell modernization. Motion/a11y polish.

**Out of scope:**
- Mock data (`mock-db.json`) shape — untouched.
- Auth flow — already stabilized in recent commits.
- Backend / API contracts.
- Marketing/public site (`src/app/page.tsx`, `/news`, `/apply`).

---

## Risk register

| Risk | Mitigation |
|---|---|
| Token migration breaks visual parity | ✅ Phase 1: build + lint green, marketing home clean. Portal pixel-diff still pending (auth-gated). Revert is a single commit (`85fa039`). |
| `shadcn` install collides with `src/components/ui/` | ✅ **Realized in Phase 1** — `shadcn init` overwrote `Button.tsx`/`globals.css`/`layout.tsx`; reverted. `ui` alias now `src/components/shadcn-ui`. |
| TanStack Table learning curve slows Phase 2 | ✅ `<DataTable>` built in Phase 2 — sortable, density toggle, filterable, typed. One unavoidable React Compiler warning accepted. |
| Server actions + `useOptimistic` regression in admin | RBAC tests run in CI on every PR touching `/admin` |
| Animation jank on low-end Android | ✅ Phase 3: shell wrapped in `MotionConfig reducedMotion="user"`. `will-change` audit on transforming elements still pending (Phase 5). |

---

## Tech additions (minimal, deliberate)

| Dep | Phase | Why |
|---|---|---|
| `shadcn/ui` | 1 ✅ | Accessible Radix primitives, owned source, brand-themeable. Installed; `ui` alias → `src/components/shadcn-ui`. Components added in Phase 2: button, command, dialog, dropdown-menu, sheet, tabs, tooltip, alert-dialog (+ input, input-group, textarea as peers). |
| `clsx` + `tailwind-merge` | 1 ✅ | `cn()` helper — already present; `cn()` lives in `src/lib/utils.ts`. |
| `class-variance-authority` | ~~2~~ 1 ✅ | Type-safe variants. Installed early in Phase 1; used in all 9 primitives in Phase 2. |
| `@tanstack/react-table` | ~~2~~ 1 ✅ | Powers `DataTable` primitive (Phase 2). Warning: `useReactTable` triggers `react-hooks/incompatible-library` from React Compiler — accepted. |
| `@tanstack/react-virtual` | 2 | Row virtualization (deferred until needed) |
| `cmdk` | ~~2~~ 1 ✅ | Powers `CommandPalette` primitive via shadcn `Command` (Phase 2). |
| `storybook` (v10, nextjs-vite) | 2 ✅ | Primitive documentation + a11y addon + vitest addon. `src/stories/` boilerplate removed; stories live alongside primitives in `src/components/portal/ui/`. |
| `react-hotkeys-hook` | 3 | Keyboard shortcuts |
| `nuqs` | 4 | URL-synced filter state |
| `sonner` | 1 ✅ | Single toast system. Installed in Phase 1 (not yet wired). |
| `dnd-kit` | 4 | Asset reordering in Creative Studio |
| `axe-core` + `@axe-core/playwright` | 5 | A11y CI (Playwright already installed as Storybook dep in Phase 2) |

No new font deps — Outfit / Space Grotesk / Michroma stay.

---

## Portal inventory (routes in play)

- **Creator Portal** — `src/app/portal/{home,creative-studio,collab-lounge,growth-academy,agency-ops,live-floor,profile,reports,my-team,my-creators,admin}/`
- **CRM** — `src/app/(dashboard)/crm/`
- **Creator Dashboard** — `src/app/(dashboard)/creator/`
- **Recruiters** — `src/app/recruiters/` + `src/app/recruiters/[id]/`
- **Admin** — `src/app/admin/`
- **Shell components** — `src/components/portal/{PortalShell,TopBar,TopMomentumBar,LeftSidebar,RightPanel,BottomNav,ActivityRing}.tsx`

---

## How to use this with the plan

1. Read this doc for the **why**.
2. Open [PORTAL_REVAMP_PLAN.md](PORTAL_REVAMP_PLAN.md) for the **what + how** — phased, PR-by-PR, with best techniques per phase.
3. Each phase ships independently. Don't merge phases out of order without flagging in the PR.
