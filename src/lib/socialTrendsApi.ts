import { TrendPost, extractTopics } from './trendsApi';

const SUBS_INDIA = ['india', 'IndiaSpeaks', 'unitedstatesofindia'];
const SUBS_USA = ['popular', 'news', 'OutOfTheLoop'];

async function fetchSub(sub: string, limit = 10): Promise<TrendPost[]> {
  try {
    const res = await fetch(`https://www.reddit.com/r/${sub}/top.json?t=day&limit=${limit}`);
    if (!res.ok) throw new Error('fail');
    const json = await res.json();
    return (json.data?.children || [])
      .filter((c: any) => !c.data.removed_by_category && c.data.title && c.data.score > 50)
      .map((c: any) => ({
        id: c.data.id,
        title: c.data.title,
        source: `r/${sub}`,
        url: `https://reddit.com${c.data.permalink}`,
        score: c.data.score,
        comments: c.data.num_comments,
        timestamp: c.data.created_utc * 1000,
        thumbnail: c.data.thumbnail?.startsWith('http') ? c.data.thumbnail : undefined,
      })) as TrendPost[];
  } catch {
    return [];
  }
}

export async function fetchSocialIndia(): Promise<TrendPost[]> {
  const results = await Promise.all(SUBS_INDIA.map((s) => fetchSub(s, 10)));
  const flat = results.flat().sort((a, b) => (b.score || 0) - (a.score || 0));
  return flat.length ? flat : socialFallback('India');
}

export async function fetchSocialUSA(): Promise<TrendPost[]> {
  const results = await Promise.all(SUBS_USA.map((s) => fetchSub(s, 10)));
  const flat = results.flat().sort((a, b) => (b.score || 0) - (a.score || 0));
  return flat.length ? flat : socialFallback('USA');
}

export function getViralKeywords(posts: TrendPost[], limit = 12) {
  return extractTopics(posts.map((p) => p.title), limit);
}

function socialFallback(region: string): TrendPost[] {
  const now = Date.now();
  const items = region === 'India'
    ? [
        { title: 'IPL bidding controversy sparks debate on r/india', source: 'r/india', score: 4200 },
        { title: 'New EV startup from Bengaluru goes viral', source: 'r/IndiaSpeaks', score: 2800 },
        { title: 'Mumbai monsoon traffic memes flood timelines', source: 'r/india', score: 2100 },
        { title: 'Indie filmmaker hits 1M YouTube subs', source: 'r/IndiaSpeaks', score: 1900 },
      ]
    : [
        { title: 'AI tool tops Product Hunt for 3rd day', source: 'r/popular', score: 8200 },
        { title: 'NFL playoff upset trends across Reddit', source: 'r/popular', score: 5100 },
        { title: 'Viral TikTok recipe hits mainstream news', source: 'r/news', score: 3400 },
      ];
  return items.map((it, i) => ({
    id: `sf-${region}-${i}`, url: '#', timestamp: now - i * 1800_000, offline: true, ...it,
  }));
}
