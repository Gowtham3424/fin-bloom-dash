

# Plan: Multi-Currency System + Unified Advisor Page

## Part 1: Multi-Currency System (Default INR)

### New Currency Context
**New file: `src/contexts/CurrencyContext.tsx`**
- Manages selected currency (default: INR for Indian users)
- Fetches live FX rates from `https://open.er-api.com/v6/latest/USD` (free, no key, daily updates)
- Provides `convert(amountUSD)` and `format(amount)` helpers
- React Query with 1-hour stale time, fallback rates if API fails
- Persists selection to localStorage

### Supported Currencies
INR (default), USD, EUR, GBP, JPY, AUD, CAD, AED, SGD, CNY — each with symbol + locale formatting.

### Currency Selector in Header
**Modified: `src/components/layout/Header.tsx`**
- Add a dropdown next to role switcher showing flag + code (e.g. `🇮🇳 INR`)
- Live FX badge: shows `1 USD = 92.59 INR` style indicator
- Tactile retro styling (2px borders, monospace)

### Apply Conversion Across App
- **Transactions**: All app transaction amounts treated as base USD; display via `format(convert(amount))`. Components to update: `TransactionTable`, `TransactionForm`, `SummaryCard`, `BudgetTracker`, `BalanceTrendChart`, `SpendingBreakdown`.
- **Default base data**: Update `mockData.ts` doc comment — values stay numeric, formatting handled by currency context.
- **Excluded (stay USD)**: International markets — `MarketTicker` (BTC, S&P, EUR/USD), Reddit/HN posts, news feed text.

### Gold/Silver in INR
**Modified: `src/components/advisor/LiveRatesCard.tsx`**
- Convert XAU/XAG USD price → INR using live FX
- Display per gram (₹/g) for Indian market familiarity (1 oz = 31.1035 g)
- Show both: `₹X,XXX/g` primary, `$X,XXX/oz` secondary
- Auto-refresh daily

**Modified: `src/components/advisor/MarketTicker.tsx`**
- Gold/Silver values shown in INR/g; BTC/S&P/EUR/USD remain USD (international standard)

## Part 2: Merge EARN into Advisor

### Restructure Advisor Page
**Modified: `src/pages/Advisor.tsx`** — single scrollable page with sections:

```text
┌─ ADVISOR ───────────────────────────────────┐
│  MARKET TICKER (existing)                   │
│  FINBOT mascot + tips                       │
│  ┌─ LIVE RATES ──┬─ INCOME IDEAS ─┐         │
│  └───────────────┴────────────────┘         │
│  ─── EARN // TRENDS RADAR ───────           │
│  Tabbed module:                             │
│  [INCOME] [NEWS] [SOCIAL] [BRANDS] [CRICKET]│
│  Last sync · Refresh · Topic filter         │
│  Regional pulse                             │
└─────────────────────────────────────────────┘
```

### New Tabs Inside EARN Section
Use shadcn `Tabs` component matching site style:

1. **INCOME** — existing `HotEarningMethods` (Reddit r/sidehustle, r/passive_income, r/IndiaInvestments)
2. **NEWS** — existing `LiveNewsFeed` (ET Tech, Livemint, YourStory RSS)
3. **SOCIAL TRENDS** *(new)* — viral topics India + USA
   - Reddit r/IndiaSpeaks, r/india, r/popular (USA) top posts
   - Hashtag/keyword extraction → trending chips
4. **BRANDS** *(new)* — new launches & marketing trends
   - YourStory + Inc42 RSS (`https://inc42.com/feed/`) — startup launches, brand news
   - ProductHunt RSS (`https://www.producthunt.com/feed`) — new product launches
5. **CRICKET** *(new)* — live scores
   - Cricbuzz RSS (`https://www.cricbuzz.com/cricket-news/index/recent-news/rss`) for headlines
   - ESPNCricinfo RSS for match updates
   - Card layout: team vs team, status, score, fallback to recent headlines

### Anti-Fake-Data Filter
**Modified: `src/lib/trendsApi.ts`**
- Add `isLikelyFake(item)` heuristic: filter posts with deleted/removed authors, [removed] titles, very low scores from new accounts, spam keywords (`click here`, `free money`, `guaranteed`, `100%`)
- Only allow whitelisted source domains in news feeds
- Mark fallback/offline content with explicit `offline` badge (already implemented) so users distinguish

### New Source Modules
**New file: `src/lib/socialTrendsApi.ts`** — Reddit r/india + r/popular fetchers, viral influencer keyword extraction
**New file: `src/lib/brandsApi.ts`** — Inc42 + ProductHunt RSS via rss2json
**New file: `src/lib/cricketApi.ts`** — Cricbuzz + ESPNCricinfo RSS, match parsing

**New components** (in `src/components/earn/`):
- `SocialTrends.tsx`
- `BrandLaunches.tsx`
- `CricketScores.tsx`

### Cleanup
**Modified: `src/components/layout/Sidebar.tsx`** — remove "EARN" nav item (consolidated)
**Modified: `src/App.tsx`** — keep `/earn-trends` route as redirect to `/advisor`

## Technical Notes

- **No new dependencies** — Tailwind, React Query, Lucide, shadcn/ui all sufficient
- **Free APIs only**: `open.er-api.com` (FX), `rss2json.com` (RSS), Reddit JSON, HN, gold-api
- **CORS**: All chosen endpoints support browser CORS
- **Caching**: FX 1h, news 15m, cricket 5m (faster for live scores)
- **Retro design preserved**: 2px borders, JetBrains Mono, orange accents, sharp corners on all new UI

## Files Summary

**New (6)**: `CurrencyContext.tsx`, `socialTrendsApi.ts`, `brandsApi.ts`, `cricketApi.ts`, `SocialTrends.tsx`, `BrandLaunches.tsx`, `CricketScores.tsx`

**Modified (~12)**: `Header.tsx`, `Advisor.tsx`, `LiveRatesCard.tsx`, `MarketTicker.tsx`, `trendsApi.ts`, `Sidebar.tsx`, `App.tsx`, `main.tsx` (wrap CurrencyProvider), `TransactionTable.tsx`, `TransactionForm.tsx`, `SummaryCard.tsx`, `BudgetTracker.tsx`, `BalanceTrendChart.tsx`, `SpendingBreakdown.tsx`

**Deleted**: `src/pages/EarnTrends.tsx` (content merged into Advisor)

