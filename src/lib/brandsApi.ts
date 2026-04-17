import { NewsItem } from './trendsApi';

const FEEDS = [
  { url: 'https://inc42.com/feed/', name: 'Inc42' },
  { url: 'https://yourstory.com/feed', name: 'YourStory' },
  { url: 'https://www.producthunt.com/feed', name: 'ProductHunt' },
];

const ALLOWED_HOSTS = ['inc42.com', 'yourstory.com', 'producthunt.com'];

export async function fetchBrandLaunches(): Promise<NewsItem[]> {
  try {
    const results = await Promise.all(
      FEEDS.map(async (feed) => {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
        if (!res.ok) throw new Error('fail');
        const json = await res.json();
        return (json.items || [])
          .filter((it: any) => {
            try {
              const host = new URL(it.link).hostname.replace(/^www\./, '');
              return ALLOWED_HOSTS.some((h) => host.endsWith(h));
            } catch { return false; }
          })
          .slice(0, 8)
          .map((it: any, idx: number) => ({
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
    if (!flat.length) throw new Error('empty');
    return flat;
  } catch {
    return brandsFallback();
  }
}

function brandsFallback(): NewsItem[] {
  const now = Date.now();
  const items = [
    { title: 'Bengaluru D2C beauty brand raises $12M Series A', source: 'Inc42' },
    { title: 'New AI productivity app hits #1 on ProductHunt', source: 'ProductHunt' },
    { title: 'Mumbai fintech launches UPI-credit hybrid card', source: 'YourStory' },
    { title: 'Chennai SaaS startup expands to Southeast Asia', source: 'Inc42' },
    { title: 'Indie maker launches subscription analytics tool', source: 'ProductHunt' },
    { title: 'Delhi cloud kitchen brand opens 25th outlet', source: 'YourStory' },
  ];
  return items.map((it, i) => ({
    id: `bf-${i}`, url: '#', timestamp: now - i * 3600_000, offline: true, ...it,
  }));
}
