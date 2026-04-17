
The user wants a new page showing online earning trends + live news (India-focused, local→national), refreshed daily, using free open sources.

Key questions: data sources. Free options without API keys:
- Hacker News API (free, no key) — trending tech/startup
- Reddit JSON endpoints (free) — r/IndiaInvestments, r/passive_income, r/IndianStreetBets
- RSS feeds via rss2json.com (free tier) — for Indian news (Economic Times, Livemint, YourStory)
- GNews / NewsData.io require keys

I'll plan with free no-key sources + Reddit + HN, and offer Perplexity connector as optional upgrade for richer real-time summaries. Keep the retro aesthetic.

# Online Earning Trends — Live Dashboard

## New Page: `/earn-trends` ("EARN")

Add nav item "EARN" in `Sidebar.tsx` (Lucide `Sparkles` icon) and route in `App.tsx`.

## Layout (`src/pages/EarnTrends.tsx`)

```text
┌─ EARN // ONLINE INCOME RADAR ──────────────────┐
│  [Last sync: 14:32]  [↻ refresh]  [INDIA ▾]    │
├────────────────────────────────────────────────┤
│  TRENDING NOW (ticker, auto-scroll)            │
├──────────────────────┬─────────────────────────┤
│  HOT EARNING METHODS │  LIVE NEWS FEED         │
│  (Reddit + HN)       │  (Indian biz RSS)       │
│  • card list         │  • headline + source    │
│  • upvotes/score     │  • timestamp            │
├──────────────────────┴─────────────────────────┤
│  TRENDING TOPICS (tag cloud / chips)           │
├────────────────────────────────────────────────┤
│  REGIONAL PULSE: LOCAL → NATIONAL              │
│  [tabs: Mumbai | Delhi | Bangalore | National] │
└────────────────────────────────────────────────┘
```

## Components

1. **`TrendingTicker.tsx`** — horizontal marquee of top 10 headlines (reuses MarketTicker styling).
2. **`HotEarningMethods.tsx`** — fetches Reddit JSON from `r/IndiaInvestments`, `r/passive_income`, `r/sidehustle` top posts (last 24h). Displays as tactile cards: title, subreddit chip, score, comments, external link.
3. **`LiveNewsFeed.tsx`** — fetches Indian business RSS via `https://api.rss2json.com/v1/api.json?rss_url=...` (no key, free). Sources: Economic Times Tech, Livemint Money, YourStory. Shows headline, source badge, time-ago, link.
4. **`TrendingTopics.tsx`** — extracts keywords from fetched headlines (simple frequency count of capitalized terms / hashtags), renders as clickable chips that filter the feeds.
5. **`RegionalPulse.tsx`** — tabs for major Indian cities + National. Filters news/posts by city keyword match.

## Data Layer (`src/lib/trendsApi.ts`)

All client-side via React Query, no API keys, no edge functions:

| Source | Endpoint | Refresh |
|---|---|---|
| Reddit hot posts | `https://www.reddit.com/r/{sub}/top.json?t=day&limit=15` | 15 min |
| Hacker News | `https://hacker-news.firebaseio.com/v0/topstories.json` + item lookup | 15 min |
| Indian business RSS | `api.rss2json.com/v1/api.json?rss_url={feed}` | 30 min |

Feeds:
- ET Tech: `https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms`
- Livemint Money: `https://www.livemint.com/rss/money`
- YourStory: `https://yourstory.com/feed`

Graceful fallback: if a fetch fails (CORS/rate limit), show curated static fallback content with "offline" badge — mirrors `MarketTicker` pattern.

## Daily Freshness
React Query `staleTime: 15min`, `refetchInterval: 15min`, `refetchOnWindowFocus: true`. "Last updated" timestamp visible in header. Manual ↻ refresh button.

## Design
Retro-futurist — monospace, 2px borders, sharp corners, orange accents for "HOT/LIVE", green/red for trending up/down. Each card = tactile module like existing Advisor page.

## Optional Upgrade (mention to user, don't build now)
Connect **Perplexity** connector for AI-summarized "Today's top earning opportunity in India" daily brief (requires user approval to add connector + edge function).

## Files
- New: `src/pages/EarnTrends.tsx`, `src/components/earn/TrendingTicker.tsx`, `HotEarningMethods.tsx`, `LiveNewsFeed.tsx`, `TrendingTopics.tsx`, `RegionalPulse.tsx`, `src/lib/trendsApi.ts`
- Edited: `src/App.tsx` (add route), `src/components/layout/Sidebar.tsx` (add EARN nav)

No new dependencies.
