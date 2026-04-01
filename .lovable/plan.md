

# Four Feature Additions

## 1. Budget Tracking

**New file: `src/components/dashboard/BudgetTracker.tsx`**
- Displays each expense category with a horizontal progress bar showing `spent / $limit`
- Color-coded: green (<70%), orange (70-90%), red (>90%)
- Admin can click a limit value to inline-edit it

**Modified: `src/types/index.ts`**
- Add `Budget` interface: `{ category: Category; limit: number }`
- Add `budgets: Budget[]` to `AppState`
- Add `SET_BUDGETS` action type

**Modified: `src/contexts/AppContext.tsx`**
- Initialize default budgets (one per expense category with sensible defaults like Food $500, Transport $300, etc.)
- Handle `SET_BUDGETS` reducer action
- Persist budgets to localStorage

**Modified: `src/pages/Dashboard.tsx`**
- Add `<BudgetTracker />` section below the charts grid

## 2. Page Transition Animations

**New file: `src/components/layout/PageTransition.tsx`**
- Wrapper component that applies `animate-fade-up` class on mount
- Uses `useLocation().pathname` as React `key` to re-trigger animation on route change

**Modified: `src/App.tsx`**
- Wrap each `<Route>` element content with `<PageTransition>` using location key

## 3. Date Range Filtering

**Modified: `src/components/transactions/FilterBar.tsx`**
- Add a row with two date inputs ("From" / "To") between the search row and category chips
- Styled consistently with the existing input pattern (border-2, monospace, etc.)
- Wire to existing `dateFrom` / `dateTo` filter state already supported by AppContext

## 4. High-Contrast Retro Background

**Modified: `src/index.css`**
- Add a subtle dot-grid background pattern to `body` using CSS `radial-gradient` — faint dark dots on the off-white background (light mode), faint light dots on charcoal (dark mode)
- Gives the "graph paper / instrument panel" retro feel without being distracting

**Modified: `src/components/layout/AppShell.tsx`**
- Add a 2px accent-colored (orange) top bar at the very top of the viewport for that hardware-panel stripe

## Technical Notes
- No new dependencies required
- The 429 build errors are transient npm registry rate limits — they resolve on retry
- All changes use existing design tokens and Tailwind utilities

