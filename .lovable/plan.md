

# Financial Dashboard — Retro-Futurist Scandinavian Design

## Design Language

A Teenage Engineering-inspired aesthetic: stark monochromes, pixel-art accents, purposeful pops of high-contrast color (orange/amber for alerts, green for income, red for expenses), monospace typography, and chunky border-radius elements that feel tactile. The UI should feel like an instrument panel — every element has a purpose.

```text
┌──────────────────────────────────────────────────┐
│  ▣ FINBOARD          [Viewer ▾] [☀/☾]  [@]      │
├────────┬─────────────────────────────────────────┤
│ ☰ NAV  │                                         │
│        │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│ □ Dash │  │BAL  │ │INC  │ │EXP  │ │SAVE%│       │
│ □ Txns │  │▓▓▓▓ │ │▓▓▓▓ │ │▓▓▓▓ │ │▓▓▓▓ │       │
│ □ Stats│  └─────┘ └─────┘ └─────┘ └─────┘       │
│        │  ┌──────────────┐ ┌──────────────┐      │
│        │  │ BALANCE TREND│ │ SPEND DONUT  │      │
│        │  │  ╱‾‾╲__╱‾╲   │ │    ◉         │      │
│        │  └──────────────┘ └──────────────┘      │
│        │  ┌──────────────────────────────┐       │
│        │  │ RECENT TRANSACTIONS          │       │
│        │  └──────────────────────────────┘       │
└────────┴─────────────────────────────────────────┘
```

## Design System Overrides (`src/index.css`)

- **Font**: `"JetBrains Mono", "IBM Plex Mono", monospace` for all text — gives that instrument/terminal feel
- **Light mode**: Off-white `#F5F3EE` background, near-black foreground, borders as solid dark lines
- **Dark mode**: Deep charcoal `#1A1A1A`, warm white text
- **Accent colors**: Purposeful only — `--income: 142 71% 45%` (green), `--expense: 0 84% 60%` (red), `--highlight: 32 95% 55%` (orange, for focus/active states)
- **Border radius**: `--radius: 0.25rem` — sharp, boxy, tactile
- **Shadows**: None or minimal — rely on borders and contrast

## File Structure

```text
src/
├── contexts/AppContext.tsx        — Role, theme, transactions, filters
├── data/mockData.ts               — ~50 transactions, 8 categories, 6 months
├── types/index.ts                 — Transaction, Category, Role, Filter types
├── pages/
│   ├── Dashboard.tsx              — Summary + charts + recent txns
│   ├── Transactions.tsx           — Full table + filters + CRUD (admin)
│   └── Insights.tsx               — Spending analysis cards
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx           — Sidebar + header + content area
│   │   ├── Sidebar.tsx            — Pixel-art styled nav icons
│   │   └── Header.tsx             — Role switcher, theme toggle
│   ├── dashboard/
│   │   ├── SummaryCard.tsx        — Boxy card with label, value, mini sparkline
│   │   ├── BalanceTrendChart.tsx  — Area chart, monochrome with accent line
│   │   └── SpendingBreakdown.tsx  — Donut chart with blocky legend
│   ├── transactions/
│   │   ├── TransactionTable.tsx   — Sortable table with pixel-style category icons
│   │   ├── TransactionForm.tsx    — Modal form for add/edit (admin only)
│   │   └── FilterBar.tsx          — Search, category, type, date filters
│   └── insights/
│       ├── InsightCard.tsx        — Stat card with observation text
│       └── MonthlyComparison.tsx  — Bar chart, income vs expense
└── lib/utils.ts                   — Currency formatting, date helpers
```

## Key Design Decisions

**Typography & Spacing**: Monospace everywhere. Uppercase labels with letter-spacing for section headers (like hardware labels). Generous whitespace — Scandinavian breathing room.

**Color as Utility**: The base UI is essentially monochrome. Color only appears for:
- Green = income/positive
- Red = expense/negative  
- Orange/amber = interactive focus states, active nav, CTAs
- This makes status instantly scannable

**Tactile Elements**: Buttons have thick 2px borders and slight press-down transforms on click. Cards have hard borders instead of shadows. Toggle switches styled like physical sliders.

**Playful Touches**:
- Category icons as simple 8-bit pixel sprites (CSS/inline SVG)
- Subtle bounce animation on summary card values when data loads
- A small blinking cursor `▮` next to the active nav item
- Transaction amounts slide in from the right on load

**Responsive**: Sidebar collapses to a bottom tab bar on mobile. Summary cards stack to 2-column grid. Charts go full-width.

## Implementation Steps

1. **Types & Mock Data** — Define TypeScript interfaces and generate 50+ realistic transactions across categories (Food, Transport, Housing, Entertainment, Shopping, Health, Utilities, Salary, Freelance)

2. **AppContext** — React Context with `useReducer` for transactions CRUD, role switching, filter state, theme. LocalStorage persistence for transactions and preferences.

3. **Design System** — Update `index.css` with retro-futurist tokens (monospace font, sharp radius, high-contrast palette). Add custom animation keyframes (bounce-in for numbers, slide-in for rows, blink for cursor).

4. **Layout Shell** — AppShell with fixed sidebar (pixel-art nav icons, blinking active indicator) and header (role dropdown styled as a "mode selector" knob, theme toggle as a physical switch).

5. **Dashboard Page** — 4 summary cards (boxy, bordered, with mini ASCII-style sparklines via Recharts), balance trend area chart (monochrome fill, orange accent line), spending donut (high-contrast segments), recent 5 transactions list.

6. **Transactions Page** — FilterBar with chunky input fields and toggle buttons. Table with sortable columns, pixel-style category dots, amount color-coded. Admin: add/edit modal with form validation. CSV export button. Empty state with pixel art illustration.

7. **Insights Page** — Highest spending category highlight, month-over-month bar chart, top 3 expenses, auto-generated text observations, category comparison horizontal bars.

8. **Polish** — Dark mode, responsive breakpoints, empty states, loading states with pixel-art spinner, smooth transitions between pages.

## Technical Notes

- **No new dependencies needed** — Recharts, date-fns, Lucide, and shadcn/ui are already available
- Google Fonts import for JetBrains Mono in `index.html`
- All animations via Tailwind keyframes (no Framer Motion needed — keeping it lean)
- Role state drives conditional rendering of admin controls throughout

