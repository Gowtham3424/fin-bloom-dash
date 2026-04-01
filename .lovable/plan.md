

# Finance Mascot, Tips, Market Rates & Secondary Income Ideas

## Overview

Add a new **"Advisor"** page with a friendly finance mascot character that provides daily savings tips, market updates, live gold/silver rates, and secondary income ideas — all in the retro-futurist aesthetic.

## 1. Finance Mascot — "FINBOT"

**New file: `src/components/advisor/FinMascot.tsx`**
- A pixel-art style robot mascot rendered with CSS/SVG — boxy, monochrome with orange accent eyes (fits the Teenage Engineering aesthetic)
- Shows a speech bubble with rotating daily tips
- Subtle idle animation (blinking eyes, slight bobble)
- Cheerful, positive tone in all messaging

**Tips system:**
- A curated array of 20+ practical expense-reduction tips (e.g., "Pack lunch 3x/week → save ~$200/mo", "Cancel unused subscriptions", "Use the 24-hour rule before impulse buys")
- Tips rotate daily (seeded by date so all users see the same tip per day)
- User can click "Next tip" to cycle through more
- Tips are personalized based on the user's top spending categories from their transaction data

## 2. Market Updates & Trends

**New file: `src/components/advisor/MarketTicker.tsx`**
- A retro "stock ticker" style horizontal bar showing key market indicators
- Uses free public APIs (no auth needed):
  - **Gold & Silver**: via `https://api.metalpriceapi.com` or `https://metals-api.com` free tier — shows daily spot prices in USD per oz
  - Fallback: Use a curated set of realistic mock data with slight daily randomization if API is unavailable
- Displays: Gold $/oz, Silver $/oz, with daily change arrows (▲/▼) color-coded green/red
- Auto-refreshes every 5 minutes via React Query

**New file: `src/components/advisor/LiveRatesCard.tsx`**
- Larger card showing Gold and Silver rates with:
  - Current price, 24h change %, 7-day mini sparkline
  - "Last updated" timestamp
  - Styled as a tactile instrument panel readout

## 3. Secondary Income Ideas

**New file: `src/components/advisor/IncomeIdeas.tsx`**
- A carousel/list of secondary income suggestions, each as a tactile card:
  - Freelancing, dividend investing, selling unused items, cashback apps, rental income, digital products, tutoring, etc.
- Each card has: icon, title, estimated monthly range, difficulty level (●○○ easy → ●●● hard), and a one-liner description
- Cards styled as "program cards" — like selecting a mode on hardware

## 4. New Page & Navigation

**New file: `src/pages/Advisor.tsx`**
- Layout: Mascot + speech bubble at top, then a 2-column grid with LiveRatesCard and IncomeIdeas, market ticker at bottom
- Section headers in the usual `label-uppercase` style

**Modified: `src/components/layout/Sidebar.tsx`**
- Add "ADVSR" nav item with a `Bot` or `Lightbulb` icon from Lucide

**Modified: `src/App.tsx`**
- Add `/advisor` route

## 5. Data Fetching

**Modified: No edge function needed** — use free public APIs directly from the client:
- Gold/Silver rates: `https://api.gold-api.com/price/XAU` and `XAG` (free, no key)
- Fallback to realistic mock data with date-seeded randomization if API fails
- React Query with 5-min stale time for caching

## Technical Notes
- No new dependencies — uses existing React Query, Recharts, Lucide
- Mascot is pure CSS/SVG, no image assets needed
- Tips array is static data, no API needed
- Market data fetched client-side with graceful fallback to mock data
- All components follow the retro-futurist design system (monospace, tactile borders, color-as-utility)

