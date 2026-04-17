// Free, no-key data sources for online earning trends + Indian biz news.

export interface TrendPost {
  id: string;
  title: string;
  source: string;
  url: string;
  score?: number;
  comments?: number;
  timestamp: number; // epoch ms
  thumbnail?: string;
  offline?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  timestamp: number;
  description?: string;
  offline?: boolean;
}

// ---------- REDDIT ----------
const SUBS = ['IndiaInvestments', 'passive_income', 'sidehustle', 'IndianStreetBets'];

export async function fetchRedditPosts(): Promise<TrendPost[]> {
  try {
    const results = await Promise.all(
      SUBS.map(async (sub) => {
        const res = await fetch(`https://www.reddit.com/r/${sub}/top.json?t=day&limit=8`);
        if (!res.ok) throw new Error('reddit fail');
        const json = await res.json();
        return (json.data?.children || []).map((c: any) => ({
          id: c.data.id,
          title: c.data.title,
          source: `r/${sub}`,
          url: `https://reddit.com${c.data.permalink}`,
          score: c.data.score,
          comments: c.data.num_comments,
          timestamp: c.data.created_utc * 1000,
        })) as TrendPost[];
      })
    );
    const flat = results.flat().sort((a, b) => (b.score || 0) - (a.score || 0));
    if (flat.length === 0) throw new Error('empty');
    return flat;
  } catch {
    return fallbackEarning();
  }
}

// ---------- HACKER NEWS ----------
export async function fetchHackerNews(): Promise<TrendPost[]> {
  try {
    const ids: number[] = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then((r) => r.json());
    const top = ids.slice(0, 12);
    const items = await Promise.all(
      top.map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json()))
    );
    return items
      .filter((i: any) => i && i.title)
      .map((i: any) => ({
        id: String(i.id),
        title: i.title,
        source: 'HackerNews',
        url: i.url || `https://news.ycombinator.com/item?id=${i.id}`,
        score: i.score,
        comments: i.descendants,
        timestamp: i.time * 1000,
      })) as TrendPost[];
  } catch {
    return [];
  }
}

// ---------- RSS NEWS (India) ----------
const RSS_FEEDS = [
  { url: 'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms', name: 'ET Tech' },
  { url: 'https://www.livemint.com/rss/money', name: 'Livemint Money' },
  { url: 'https://yourstory.com/feed', name: 'YourStory' },
];

export async function fetchIndiaNews(): Promise<NewsItem[]> {
  try {
    const results = await Promise.all(
      RSS_FEEDS.map(async (feed) => {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
        if (!res.ok) throw new Error('rss fail');
        const json = await res.json();
        return (json.items || []).slice(0, 10).map((it: any, idx: number) => ({
          id: `${feed.name}-${idx}-${it.guid || it.link}`,
          title: it.title,
          source: feed.name,
          url: it.link,
          timestamp: new Date(it.pubDate).getTime() || Date.now(),
          description: (it.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
        })) as NewsItem[];
      })
    );
    const flat = results.flat().sort((a, b) => b.timestamp - a.timestamp);
    if (flat.length === 0) throw new Error('empty');
    return flat;
  } catch {
    return fallbackNews();
  }
}

// ---------- KEYWORD EXTRACTION ----------
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'to', 'of', 'and', 'or', 'but',
  'in', 'on', 'at', 'for', 'with', 'about', 'as', 'by', 'from', 'this', 'that', 'these', 'those',
  'how', 'why', 'what', 'when', 'where', 'i', 'you', 'we', 'they', 'it', 'my', 'your', 'his', 'her',
  'will', 'can', 'should', 'would', 'could', 'has', 'have', 'had', 'do', 'does', 'did', 'not', 'no',
  'new', 'best', 'top', 'india', 'indian', 'rs', 'inr', 'lakh', 'crore', 'after', 'over', 'into',
]);

export function extractTopics(titles: string[], limit = 18): { word: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of titles) {
    const words = (t || '').match(/[A-Za-z][A-Za-z'-]{2,}/g) || [];
    for (const w of words) {
      const key = w.toLowerCase();
      if (STOPWORDS.has(key)) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

// ---------- FALLBACKS ----------
function fallbackEarning(): TrendPost[] {
  const now = Date.now();
  const items = [
    { title: 'How I made ₹40K/month freelancing on Upwork as a beginner', source: 'r/sidehustle', score: 1240, comments: 89 },
    { title: 'Dividend portfolio update — ₹15K/month passive income', source: 'r/IndiaInvestments', score: 980, comments: 142 },
    { title: 'Print-on-demand store hit ₹1L revenue in 90 days', source: 'r/passive_income', score: 870, comments: 67 },
    { title: 'Quant strategy backtest results for Nifty options', source: 'r/IndianStreetBets', score: 612, comments: 203 },
    { title: 'YouTube Shorts paid me ₹22K last month — full breakdown', source: 'r/sidehustle', score: 540, comments: 41 },
    { title: 'REITs vs index funds for Indian retail investors', source: 'r/IndiaInvestments', score: 488, comments: 76 },
  ];
  return items.map((it, i) => ({
    id: `fb-${i}`,
    url: '#',
    timestamp: now - i * 3600_000,
    offline: true,
    ...it,
  }));
}

function fallbackNews(): NewsItem[] {
  const now = Date.now();
  const items = [
    { title: 'Indian startups raise $2.1B in funding this quarter', source: 'ET Tech' },
    { title: 'RBI keeps repo rate steady — what it means for your savings', source: 'Livemint Money' },
    { title: 'Bangalore-based fintech crosses 10M users', source: 'YourStory' },
    { title: 'Sensex hits new high amid IT sector rally', source: 'ET Tech' },
    { title: 'New tax regime: should you switch?', source: 'Livemint Money' },
    { title: 'Mumbai D2C brand expands to 50 cities', source: 'YourStory' },
    { title: 'Delhi NCR coworking demand up 38% YoY', source: 'ET Tech' },
  ];
  return items.map((it, i) => ({
    id: `fbn-${i}`,
    url: '#',
    timestamp: now - i * 1800_000,
    offline: true,
    ...it,
  }));
}

export function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
