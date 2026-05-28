# Portal Revamp — Execution Guide

> **Companion docs:**
> - [PORTAL_REVAMP_CONTEXT.md](PORTAL_REVAMP_CONTEXT.md) — the why (audit, principles, brand anchors)
> - [PORTAL_REVAMP_PLAN.md](PORTAL_REVAMP_PLAN.md) — the what + how (5 phases, techniques, exit criteria)
> - **This doc** — the order of operations, PR-by-PR, with everything needed to execute cleanly

---

## How to use this guide

Each PR below is a self-contained unit of work. For each one you'll find:

- **Goal** — what shipping this PR achieves
- **Branch name** — naming convention `revamp/phase-N-short-desc`
- **Pre-flight** — what to verify before touching code
- **Files touched** — concrete paths
- **Steps** — ordered work
- **Verification** — how to prove it works before merging
- **Exit criteria** — the bar for "done"
- **Rollback plan** — how to back out if something breaks

**Universal rules:**
- Push only to `https://github.com/SATCORPG5/ptaph002` (testing remote).
- One phase per PR — don't bundle. Phase boundaries are review checkpoints.
- Every PR must pass `npm run lint`, `npm run build`, and visual diff (where applicable).
- Never skip hooks (`--no-verify`) or bypass signing.
- No new files outside the scope below without flagging in PR description.

---

## PR #1 — Phase 1: Foundations ✅ DONE (2026-05-27)

**Status:** Committed `85fa039` on `revamp/phase-1-foundations`, pushed to `testing` (SATCORPG5/ptaph002). PR to open: https://github.com/SATCORPG5/ptaph002/pull/new/revamp/phase-1-foundations

**Goal:** Token extraction + shadcn init + lint guard. **Zero visual change.**

**Branch:** `revamp/phase-1-foundations`

### What actually shipped (read before PR #2)
- **Token names deviate from this doc.** The teal accent is `--color-portal-accent` (OKLCH `74% 0.13 184` ≈ `#14B8A6`), **not** `--accent`. Reason: `--color-accent` already exists and is **amber `#F59E0B`**, consumed by admin (`AdminDashboard.tsx`, `GlobalSearch.tsx`, `AdminConfirm.tsx`, `creators-db.ts`). Overwriting it would break admin and violate zero-visual-change. Use these utilities going forward:
  - `bg-portal-accent` / `text-portal-accent` / `border-portal-accent` (+ `/opacity` modifiers, `from-`/`to-`/`via-`)
  - `bg-portal-surface-1` / `-2` / `-3`
  - `--color-portal-accent-soft`, `--color-portal-accent-hover`, `--color-portal-ring-focus`
  - motion: `--dur-fast` (120ms), `--dur-base` (200ms), `--dur-slow` (400ms), `--ease-out-pta`
- **The codebase brand is NOT teal/midnight.** `globals.css` base is coral `#FF3C5F` + violet `#A78BFA` on `#01020A`. Teal `#14B8A6` is the *portal-only* accent. The "Midnight-on-Rails" framing in the plan describes the target portal feel, not the global theme. Don't remap global `--color-primary`.
- **shadcn init partially reverted.** `npx shadcn@latest init` (v4.8.2) overwrote `globals.css`, `layout.tsx`, and `Button.tsx` with conflicting tokens (`--background`, `--foreground`, `* { @apply border-border }`) and a Geist font import. All three reverted. Kept: `components.json` + deps. **`components.json` `ui` alias points at `src/components/shadcn-ui`** (NOT `src/components/ui`, which holds existing `Button.tsx`, `Card.tsx`, etc.). So PR #2's `npx shadcn add <c>` will land components in `src/components/shadcn-ui/`.
- **Lint guard is className-scoped**, not all-literals. Selector targets `JSXAttribute[name.name='className']` Literals + TemplateElements matching `#(14B8A6|080812)`. Residual raw hex remains (and is allowed) in: `<input type="color">` defaults, and template-string alpha-concatenation like `${color}18` / `${color}22` — these can't be CSS vars.
- **Deps installed:** `class-variance-authority`, `sonner`, `cmdk`, `@tanstack/react-table` (clsx + tailwind-merge were already present; `cn()` lives in `src/lib/utils.ts`, not a new `src/lib/cn.ts`).
- **Verification done:** `npm run build` green; `npm run lint` no new errors (baseline 30094 problems identical to `main`); no `[#14B8A6]`/`[#080812]` left in Tailwind classes; marketing home renders clean. **Not done:** authenticated portal pixel-diff (routes are auth-gated — needs manual login).

### Pre-flight
- `git status` clean on `main`.
- Confirm `src/components/ui/` contents — note any name collisions with shadcn before init.
- Take baseline screenshots of every portal route (Creator home, CRM, Recruiters, Admin) for diff comparison.

### Files touched
- `src/app/globals.css` — add semantic tokens
- `tailwind.config.*` / `globals.css` `@theme` block — expose tokens as utilities
- `src/components/portal/**/*.tsx` — replace hex literals with token utilities
- `src/app/portal/**/*.tsx` — same
- `src/lib/cn.ts` (new) — `cn()` helper
- `eslint.config.mjs` — add no-raw-hex rule
- `package.json` — new deps

### Steps
1. Install: `npm i clsx tailwind-merge class-variance-authority sonner cmdk @tanstack/react-table`
2. Run `npx shadcn@latest init` — accept defaults; if `src/components/ui/` collision, configure alias to `src/components/shadcn-ui/`.
3. Add semantic tokens to `globals.css` using OKLCH:
   ```css
   @layer tokens {
     :root {
       --accent: oklch(74% 0.13 184);          /* #14B8A6 equivalent */
       --accent-soft: oklch(74% 0.13 184 / 0.1);
       --accent-hover: oklch(78% 0.13 184);
       --surface-1: oklch(12% 0.01 270);       /* #080812 equivalent */
       --surface-2: oklch(15% 0.01 270);
       --surface-3: oklch(18% 0.01 270);
       --ring-focus: oklch(74% 0.13 184 / 0.5);
       --dur-fast: 120ms;
       --dur-base: 200ms;
       --dur-slow: 400ms;
       --ease-out-pta: cubic-bezier(0.22, 1, 0.36, 1);
     }
   }
   ```
4. Expose as Tailwind utilities in the `@theme` block (`--color-accent`, `--color-surface-1`, etc.).
5. Create `src/lib/cn.ts`:
   ```ts
   import { clsx, type ClassValue } from 'clsx';
   import { twMerge } from 'tailwind-merge';
   export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
   ```
6. Find and replace literals:
   ```bash
   grep -rn "#14B8A6\|#080812" src/components/portal src/app/portal
   ```
   For each hit, swap to the token utility (`bg-accent`, `text-accent`, `bg-surface-1`).
7. Add ESLint rule blocking raw hex in `src/components/**` and `src/app/**`:
   ```js
   {
     files: ['src/components/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
     rules: {
       'no-restricted-syntax': ['error', {
         selector: "Literal[value=/#(14B8A6|080812)/i]",
         message: 'Use semantic tokens (bg-accent, bg-surface-1) — no raw brand hex.',
       }],
     },
   }
   ```

### Verification
- `npm run lint` passes.
- `npm run build` passes.
- Visual diff against baseline screenshots — **must be pixel-identical** (allow ±1 from sub-pixel rounding).
- `grep -rn "#14B8A6\|#080812" src/components src/app` returns zero results (only `globals.css` should match in a broader search).

### Exit criteria
- Zero hex literals outside `globals.css`.
- Lint rule active and green.
- Build green.
- No visual regression.

### Rollback
Single revert commit — no schema or routing changes to undo.

---

## PR #2 — Phase 2: Primitives Library ✅ DONE (2026-05-27)

**Status:** Committed `4545480` on `revamp/phase-2-primitives`, pushed to `testing` (SATCORPG5/ptaph002). PR to open: https://github.com/SATCORPG5/ptaph002/pull/new/revamp/phase-2-primitives

**Goal:** Build the canonical portal component library. Document in Storybook.

**Branch:** `revamp/phase-2-primitives`

### What actually shipped (read before PR #3)
- **9 primitives, not 8.** The plan listed 8 components but `DeltaChip` was originally listed as part of `StatTile` — shipped as a standalone component used by `StatTile` and exposed separately in `index.ts`. Full list: `PortalCard`, `StatTile`, `TacticalLabel`, `SectionHeader`, `DataTable`, `CommandPalette`, `DeltaChip`, `StatusPill`, `TacticalDivider`.
- **Storybook is `@storybook/nextjs-vite` (v10), not webpack.** The installed framework is `@storybook/nextjs-vite`, which changes the import path for story types. All stories import `Meta`/`StoryObj` from `@storybook/nextjs-vite` — **not** `@storybook/react` (ESLint rule `storybook/no-renderer-packages` blocks the latter). PR #3 and beyond must follow this.
- **`Slot` import:** `PortalCard.tsx` imports `Slot` from the unified `radix-ui` package (already in `package.json`). The component reference used in JSX is `Slot.Root`, not `Slot` directly. Do not install `@radix-ui/react-slot` separately — use `import { Slot } from 'radix-ui'`.
- **shadcn added 11 files to `src/components/shadcn-ui/`** — the 8 explicitly requested (button, command, dialog, dropdown-menu, sheet, tabs, tooltip, alert-dialog) plus `input`, `input-group`, and `textarea` (peer dependencies pulled in automatically). Import all of them from `@/components/shadcn-ui/<name>`.
- **`CommandPalette` is self-contained** — mounts its own `⌘K`/`Ctrl+K` `keydown` listener via `useEffect`. Place it once at the portal layout level. The `open`/`onOpenChange` props allow external control for PR #3's TopBar search button.
- **`DataTable` carries one accepted lint warning** — `react-hooks/incompatible-library` on `useReactTable` (TanStack Table's API returns functions React Compiler can't memoize). This is unavoidable and was confirmed acceptable. Lint total moved from 30,094 → 30,095 (+1 warning, 0 new errors).
- **Storybook boilerplate removed.** `npx storybook init` created a `src/stories/` directory with sample files; these were deleted. Stories live only in `src/components/portal/ui/*.stories.tsx`. Storybook config is in `.storybook/main.ts` + `.storybook/preview.tsx`. The preview imports `globals.css` and sets the default background to `#01020A` (portal dark).
- **`vitest.config.ts` and `vitest.shims.d.ts` added** by `@storybook/addon-vitest`. These are Storybook's test runner config — do not confuse with a standalone test suite. `npx vitest` runs Storybook stories as tests.
- **Verification done:** `npm run build` green; `npm run lint` +1 warning (baseline +1, no new errors); 9 primitives and 9 stories confirmed present. **Not done:** `npm run storybook` visual verification (requires dev session) and a11y addon zero-violations check — needs manual run after merging.

### Pre-flight
- PR #1 merged.
- Confirm CVA available (`npm ls class-variance-authority`). ✅ installed in PR #1.
- **`npx shadcn add` lands in `src/components/shadcn-ui/`** (alias set in PR #1), not `src/components/ui/`. Import primitives from `@/components/shadcn-ui/*`.
- Use `portal-accent` / `portal-surface-*` token utilities (see PR #1 notes), not `accent`/`surface`. Numerals: `tabular-nums slashed-zero`.

### Files touched
- `src/components/portal/ui/` (new directory)
  - `PortalCard.tsx`
  - `StatTile.tsx`
  - `TacticalLabel.tsx`
  - `SectionHeader.tsx`
  - `DataTable.tsx`
  - `CommandPalette.tsx`
  - `DeltaChip.tsx`
  - `StatusPill.tsx`
  - `TacticalDivider.tsx`
  - `index.ts` (barrel export)
- `.storybook/` (new) — config
- `src/components/portal/ui/*.stories.tsx` — one story per primitive

### Steps
1. Install Storybook: `npx storybook@latest init --type nextjs`.
2. Add shadcn components needed: `npx shadcn@latest add button dropdown-menu dialog sheet tabs command tooltip alert-dialog`.
3. Build each primitive using **CVA for variants** and **Radix Slot (`asChild`)** pattern. Reference shape:
   ```tsx
   const cardVariants = cva('rounded-2xl border', {
     variants: { tone: { default: '...', elevated: '...', tactical: '...', loading: '...' } },
     defaultVariants: { tone: 'default' },
   });
   ```
4. `<DataTable>` wraps TanStack Table v8 — props: `columns`, `data`, `density`, `getRowId`, `enableUrlState`.
5. `<CommandPalette>` mounts globally; opens on `⌘K` / `Ctrl+K`. Use shadcn `Command` + `cmdk`.
6. Every numeric component: `tabular-nums slashed-zero` class on the numeral.
7. Write one Storybook story per primitive showing all variants.
8. Add axe-core check to Storybook (`@storybook/addon-a11y`).

### Verification
- `npm run storybook` — every primitive renders, all variants visible.
- A11y addon shows zero violations for every story.
- `npm run lint && npm run build` green.

### Exit criteria
- 9 primitives shipped + indexed.
- Storybook builds standalone.
- No primitive depends on portal-specific data.

### Rollback
Revert PR — no consumers yet, safe to remove.

---

## PR #3 — Phase 3: Shell Modernization

**Goal:** Refactor portal shell. ⌘K palette live. Status rail visible.

**Branch:** `revamp/phase-3-shell`

### Pre-flight
- PR #2 merged. Primitives available via `@/components/portal/ui`. shadcn components available via `@/components/shadcn-ui/*` (Sheet, DropdownMenu, Tabs, Dialog, AlertDialog, Command all present).
- Install: `npm i react-hotkeys-hook`.
- `CommandPalette` is already built — wire it in by importing from `@/components/portal/ui` and mounting in `PortalShell.tsx`. Pass `items` from the SEARCH_ITEMS array currently in `TopBar.tsx`.
- Stories import from `@storybook/nextjs-vite`, not `@storybook/react`. Keep this for any new stories added in PR #3.

### Files touched
- `src/components/portal/PortalShell.tsx`
- `src/components/portal/TopBar.tsx`
- `src/components/portal/LeftSidebar.tsx`
- `src/components/portal/RightPanel.tsx`
- `src/components/portal/BottomNav.tsx`
- `src/components/portal/StatusRail.tsx` (new)

### Steps
1. Replace mobile sidebar overlay (`PortalShell.tsx:63-78`) with shadcn `Sheet`.
2. Replace `TopBar` inline dropdowns (notif, avatar) with Radix `DropdownMenu` via shadcn.
3. Lift inline search → mount `<CommandPalette>` globally; replace search input with a button that shows `⌘K` chord in Michroma.
4. Bump `text-[9px]/[10px]` → `text-xs` with proper line-height. Reserve `text-[10px]` for Michroma labels only.
5. Sidebar: implement icon-rail + hover-expand. Persist expanded state to `localStorage` (`pta:sidebar-expanded`).
6. Group sidebar items under Michroma section headers: OPERATIONS / ACCOUNT / ADMIN.
7. New `<StatusRail>` under `TopMomentumBar`: `Operational • 28 LIVE • SYNCED HH:MM:SS UTC`. Tick clock every second; use `Intl.RelativeTimeFormat` for notification timestamps.
8. Use `useOptimistic` for "mark all read."
9. Wrap top-level Framer animations in `<MotionConfig reducedMotion="user">`.

### Verification
- Tab through every shell interactive element — focus ring visible on each.
- `⌘K` opens palette from every portal route; arrow keys + enter navigate.
- Sidebar collapse persists across page reloads.
- Mobile sheet opens/closes without scroll-jacking the page.
- Run app, screenshot Creator + Admin home, compare to PR #1 baseline — improvements expected, no broken layouts.

### Exit criteria
- All shell components consume primitives + tokens — no hex, no hand-rolled dropdowns.
- ⌘K works globally.
- Status rail live with second-accurate clock.

### Rollback
Revert. Token system + primitives stay; portal pages still work with old shell.

---

## PR #4 — Phase 4a: Creator Portal

**Goal:** Modernize `/portal/*` consumer-facing pages.

**Branch:** `revamp/phase-4a-creator-portal`

### Pre-flight
- PR #3 merged. Install: `npm i @dnd-kit/core @dnd-kit/sortable`.

### Files touched
- `src/app/portal/home/page.tsx`
- `src/app/portal/creative-studio/page.tsx`
- `src/app/portal/collab-lounge/page.tsx`
- `src/app/portal/growth-academy/page.tsx`
- `src/app/portal/live-floor/page.tsx`
- `src/app/portal/profile/page.tsx`
- `src/components/portal/ActivityRing.tsx`

### Steps
1. **Home** → 3-column grid: `StatTile` row (Today's momentum) / Live floor preview card / Inbox & approvals.
2. Replace `ActivityRing` with SVG ring — animate `strokeDashoffset` from full → target on mount via Framer `useInView`.
3. **Creative Studio**: asset grid with `dnd-kit` for reorder; lightbox dialog (shadcn `Dialog`) on click.
4. Every image → `next/image` with `placeholder="blur"`.
5. All cards → `<PortalCard>`. All stat tiles → `<StatTile>`. All section headings → `<SectionHeader>`.

### Verification
- Run `npm run dev`, walk every `/portal/*` route as a Creator user.
- Drag-reorder works in Creative Studio; order persists in mock-db (or session, whichever already wired).
- Lighthouse on `/portal/home` ≥ 90 Performance, ≥ 95 Accessibility.
- Reduced-motion: set OS to reduce motion, confirm ring + transitions respect it.

### Exit criteria
- All Creator portal pages use only primitives; no hand-rolled cards.
- Lighthouse thresholds met.

### Rollback
Revert. Other portals unaffected.

---

## PR #5 — Phase 4b: CRM

**Goal:** Modernize `/(dashboard)/crm`.

**Branch:** `revamp/phase-4b-crm`

### Pre-flight
- PR #4 merged. Install: `npm i nuqs`.

### Files touched
- `src/app/(dashboard)/crm/**/*.tsx`

### Steps
1. List view → `<DataTable>` with sortable columns + density toggle.
2. Pipeline stage → Michroma chip; hover popover (shadcn `Tooltip`) shows stage details.
3. Row click → slide-over detail via shadcn `Sheet`.
4. Filter/search state → URL via `nuqs` (shareable views).
5. Stage updates via server action + `useOptimistic` — instant UI, server confirms.
6. Keyboard shortcuts: `j/k` row nav, `Enter` open, `/` focus search.

### Verification
- Copy a filtered URL, open in a new tab — same view loads.
- Drag stage on a row → UI updates immediately; throttle network, confirm no flicker on confirmation.
- Tab + arrow nav reachable everywhere.

### Exit criteria
- CRM is a single `<DataTable>` + `<Sheet>` pair.
- URL state functional.

### Rollback
Revert; other portals unaffected.

---

## PR #6 — Phase 4c: Recruiters

**Goal:** Modernize `/recruiters` list + detail.

**Branch:** `revamp/phase-4c-recruiters`

### Pre-flight
- PR #5 merged.

### Files touched
- `src/app/recruiters/page.tsx`
- `src/app/recruiters/RecruitersClient.tsx`
- `src/app/recruiters/[id]/**`
- `src/app/recruiters/@list/` + `src/app/recruiters/@detail/` (new parallel routes)

### Steps
1. Convert to **Next.js parallel routes** (`@list` + `@detail`) so list doesn't unmount on selection.
2. List → `<DataTable>` with photo column.
3. Detail page → two-pane: profile rail (left, sticky) + tabbed content (`Tabs`: Overview / Reels / Stats / Notes).
4. `<Link prefetch>` on every row — detail loads instant on click.

### Verification
- Click a recruiter — list stays mounted, only detail pane updates.
- Browser back/forward navigates detail without full reload.
- Hover a row → network tab shows prefetch.

### Exit criteria
- Parallel routes functional.
- Two-pane layout responsive (stacks on mobile).

### Rollback
Revert; parallel route folders removable cleanly.

---

## PR #7 — Phase 4d: Admin

**Goal:** Modernize `/admin` with safety rails.

**Branch:** `revamp/phase-4d-admin`

### Pre-flight
- PR #6 merged.

### Files touched
- `src/app/admin/page.tsx`
- `src/app/admin/actions.ts`
- `src/app/admin/layout.tsx` (new, with RBAC guard)

### Steps
1. Wrap admin pages in `PortalShell` with admin accent variant — teal primary, red-orange reserved for destructive actions.
2. New `layout.tsx` as server component — RBAC check before render; redirect non-admins.
3. Destructive ops → shadcn `AlertDialog` with **typed-name confirmation** ("type DELETE to confirm").
4. Every server action emits a `sonner` toast on success/failure.
5. Server actions accept idempotency key in body — reject duplicates in 5s window.

### Verification
- Sign in as non-admin → `/admin` redirects.
- Delete an item → must type confirmation; toast confirms; double-click submit doesn't double-execute.
- Audit toast lists action + actor + timestamp.

### Exit criteria
- RBAC enforced at layout level.
- All destructive ops gated.
- Idempotency confirmed via duplicate-submit test.

### Rollback
Revert. Note: if any admin actions were taken in production during this PR's life, audit before reverting.

---

## PR #8 — Phase 5: Motion, A11y, Performance Finish

**Goal:** Polish pass + verification automation.

**Branch:** `revamp/phase-5-finish`

### Pre-flight
- PR #7 merged. Install: `npm i -D @axe-core/playwright @next/bundle-analyzer`.

### Files touched
- `src/app/portal/layout.tsx` (+ each portal layout) — page transitions
- Every Suspense boundary — skeleton loaders
- `.github/workflows/lighthouse.yml` (new) — Lighthouse CI
- `playwright.config.ts` + `tests/a11y.spec.ts` (new) — axe sweep
- `next.config.ts` — wrap with `@next/bundle-analyzer`

### Steps
1. Wrap each portal layout content in `motion.div` (fade + 4px y, 200ms, `ease-pta`).
2. Skeleton component per data surface — match real layout dimensions exactly (zero CLS).
3. Focus ring audit — visible `--ring-focus` on every interactive element. Manual tab-through every route.
4. Playwright + axe-core test that hits every portal route — must report zero violations.
5. Lighthouse CI workflow with budget: LCP < 2.0s, CLS < 0.05, INP < 200ms, Performance ≥ 95, A11y ≥ 95.
6. Bundle analyzer report — flag any route > 200kb gzipped, optimize (dynamic import heavy components like 3D / dnd-kit).
7. Real-device smoke test: iOS Safari + Android Chrome via BrowserStack.

### Verification
- CI green on Lighthouse + Playwright a11y + build.
- Bundle analyzer report attached to PR.
- BrowserStack screenshots attached for both devices.

### Exit criteria
- Lighthouse ≥ 95 Performance + Accessibility on every portal route.
- Zero axe violations.
- No portal route bundle exceeds 200kb gzipped.

### Rollback
Revert. Motion + skeletons remove cleanly; CI workflows can be disabled instead of deleted.

---

## Cross-PR cheatsheet

| Command | When |
|---|---|
| `npm run lint` | Before every commit |
| `npm run build` | Before pushing each PR |
| `npm run dev` | Manual verification |
| `npm run storybook` | After PR #2 — verify primitives |
| `npx playwright test` | PR #8 — a11y sweep |
| `grep -rn "#14B8A6\|#080812" src/components src/app` | After PR #1 — must return 0 |
| `npx shadcn@latest add <component>` | Whenever a new Radix primitive is needed |

---

## Decision log (fill in as you execute)

| PR | Date merged | Notes / deviations |
|---|---|---|
| #1 | pushed 2026-05-27 (commit `85fa039`, not yet merged) | Teal token namespaced `portal-accent` (not `accent` — amber collision). shadcn `globals.css`/`layout.tsx`/`Button.tsx` overwrites reverted; `ui` alias → `src/components/shadcn-ui`. Lint guard className-scoped. `cn()` in `src/lib/utils.ts`. |
| #2 | pushed 2026-05-27 (commit `4545480`, not yet merged) | Storybook 10 (nextjs-vite). Stories import from `@storybook/nextjs-vite` (not `@storybook/react`). `Slot` imported from `radix-ui` as `Slot.Root`. shadcn-ui/ has 11 components (button, command, dialog, dropdown-menu, sheet, tabs, tooltip, alert-dialog + input, input-group, textarea added as peer deps). One TanStack Table React Compiler warning in DataTable.tsx — unavoidable, accepted. |
| #3 | | |
| #4 | | |
| #5 | | |
| #6 | | |
| #7 | | |
| #8 | | |

---

## When to escalate (stop and ask)

- Visual diff in PR #1 is non-zero — token mapping is wrong, do not merge.
- `shadcn` collision with `src/components/ui/` — get alias confirmation before init.
- RBAC test fails in PR #7 — security issue, escalate immediately.
- Lighthouse budget fails repeatedly in PR #8 — may need scope reduction, not bypass.
