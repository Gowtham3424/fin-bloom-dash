import { NewsItem } from './trendsApi';

const FEEDS = [
  { url: 'https://www.cricbuzz.com/cricket-news/index/recent-news/rss', name: 'Cricbuzz' },
  { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', name: 'ESPNCricinfo' },
];

export async function fetchCricketNews(): Promise<NewsItem[]> {
  try {
    const results = await Promise.all(
      FEEDS.map(async (feed) => {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
        if (!res.ok) throw new Error('fail');
        const json = await res.json();
        return (json.items || []).slice(0, 12).map((it: any, idx: number) => ({
          id: `${feed.name}-${idx}-${it.guid || it.link}`,
          title: it.title,
          source: feed.name,
          url: it.link,
          timestamp: new Date(it.pubDate).getTime() || Date.now(),
          description: (it.description || '').replace(/<[^>]+>/g, '').slice(0, 220),
        })) as NewsItem[];
      })
    );
    const flat = results.flat().sort((a, b) => b.timestamp - a.timestamp);
    if (!flat.length) throw new Error('empty');
    return flat;
  } catch {
    return cricketFallback();
  }
}

export interface MatchCard {
  id: string;
  teamA: string;
  teamB: string;
  status: string;
  scoreA?: string;
  scoreB?: string;
  format: string;
  url: string;
  offline?: boolean;
}

// Heuristic match parser from headlines
export function parseMatches(items: NewsItem[]): MatchCard[] {
  const matches: MatchCard[] = [];
  for (const it of items.slice(0, 20)) {
    const t = it.title;
    // patterns like "India vs Australia, 2nd Test" or "IND vs AUS"
    const m = t.match(/([A-Z][A-Za-z]{2,15})\s+v(?:s|\.)\s+([A-Z][A-Za-z]{2,15})/i);
    if (m) {
      matches.push({
        id: it.id,
        teamA: m[1],
        teamB: m[2],
        status: t.length > 80 ? t.slice(0, 80) + '…' : t,
        format: /test/i.test(t) ? 'TEST' : /odi/i.test(t) ? 'ODI' : /t20/i.test(t) ? 'T20' : 'MATCH',
        url: it.url,
        offline: it.offline,
      });
    }
    if (matches.length >= 6) break;
  }
  return matches;
}

function cricketFallback(): NewsItem[] {
  const now = Date.now();
  const items = [
    { title: 'India vs Australia, 3rd Test: Bumrah strikes early on Day 1', source: 'Cricbuzz' },
    { title: 'England vs New Zealand, 2nd ODI: Root scores classy 89', source: 'ESPNCricinfo' },
    { title: 'IPL 2025 auction: top buys & surprise picks recap', source: 'Cricbuzz' },
    { title: 'Pakistan vs South Africa, 1st T20: Babar leads chase', source: 'ESPNCricinfo' },
    { title: 'Women’s World Cup: India vs England preview', source: 'Cricbuzz' },
  ];
  return items.map((it, i) => ({
    id: `cf-${i}`, url: '#', timestamp: now - i * 1200_000, offline: true, ...it,
  }));
}
