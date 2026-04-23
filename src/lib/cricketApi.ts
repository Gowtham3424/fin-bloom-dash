import { NewsItem } from './trendsApi';

export interface IPLMatch {
  id: string;
  teamA: string;
  teamB: string;
  teamAShort: string;
  teamBShort: string;
  status: string;
  state: 'live' | 'upcoming' | 'completed';
  scoreA?: string;
  scoreB?: string;
  venue?: string;
  matchNumber?: string;
  startTime?: number;
  result?: string;
  url: string;
  offline?: boolean;
}

const IPL_FEEDS = [
  'https://www.cricbuzz.com/cricket-news/index/recent-news/rss',
  'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
];

const TEAM_MAP: Record<string, { full: string; short: string }> = {
  csk: { full: 'Chennai Super Kings', short: 'CSK' },
  mi: { full: 'Mumbai Indians', short: 'MI' },
  rcb: { full: 'Royal Challengers Bengaluru', short: 'RCB' },
  kkr: { full: 'Kolkata Knight Riders', short: 'KKR' },
  srh: { full: 'Sunrisers Hyderabad', short: 'SRH' },
  dc: { full: 'Delhi Capitals', short: 'DC' },
  pbks: { full: 'Punjab Kings', short: 'PBKS' },
  rr: { full: 'Rajasthan Royals', short: 'RR' },
  gt: { full: 'Gujarat Titans', short: 'GT' },
  lsg: { full: 'Lucknow Super Giants', short: 'LSG' },
};

const TEAM_PATTERN = new RegExp(
  `\\b(${Object.keys(TEAM_MAP).join('|')}|chennai super kings|mumbai indians|royal challengers|bengaluru|kolkata knight riders|sunrisers hyderabad|delhi capitals|punjab kings|rajasthan royals|gujarat titans|lucknow super giants)\\b`,
  'gi'
);

function normalizeTeam(raw: string): { full: string; short: string } | null {
  const k = raw.toLowerCase().trim();
  if (TEAM_MAP[k]) return TEAM_MAP[k];
  for (const [, v] of Object.entries(TEAM_MAP)) {
    if (v.full.toLowerCase().includes(k) || k.includes(v.full.toLowerCase())) return v;
  }
  if (k.includes('chennai')) return TEAM_MAP.csk;
  if (k.includes('mumbai')) return TEAM_MAP.mi;
  if (k.includes('bengaluru') || k.includes('bangalore') || k.includes('royal challengers')) return TEAM_MAP.rcb;
  if (k.includes('kolkata')) return TEAM_MAP.kkr;
  if (k.includes('hyderabad') || k.includes('sunrisers')) return TEAM_MAP.srh;
  if (k.includes('delhi')) return TEAM_MAP.dc;
  if (k.includes('punjab')) return TEAM_MAP.pbks;
  if (k.includes('rajasthan')) return TEAM_MAP.rr;
  if (k.includes('gujarat')) return TEAM_MAP.gt;
  if (k.includes('lucknow')) return TEAM_MAP.lsg;
  return null;
}

function isIPLContent(text: string): boolean {
  const t = text.toLowerCase();
  if (/\bipl\b|indian premier league|tata ipl/i.test(t)) return true;
  // Has at least 2 IPL teams mentioned
  const matches = t.match(TEAM_PATTERN) || [];
  const uniq = new Set(matches.map((m) => m.toLowerCase()));
  return uniq.size >= 2;
}

async function fetchIPLNews(): Promise<NewsItem[]> {
  try {
    const results = await Promise.all(
      IPL_FEEDS.map(async (url, fIdx) => {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('fail');
        const json = await res.json();
        return (json.items || [])
          .filter((it: any) => isIPLContent(`${it.title} ${it.description || ''}`))
          .slice(0, 20)
          .map((it: any, idx: number) => ({
            id: `ipl-${fIdx}-${idx}-${it.guid || it.link}`,
            title: it.title,
            source: fIdx === 0 ? 'Cricbuzz' : 'ESPNCricinfo',
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
    return iplNewsFallback();
  }
}

export async function fetchIPLData(): Promise<{ matches: IPLMatch[]; news: NewsItem[] }> {
  const news = await fetchIPLNews();
  const matches = parseIPLMatches(news);
  return { matches: matches.length ? matches : iplMatchesFallback(news[0]?.offline), news };
}

function parseIPLMatches(items: NewsItem[]): IPLMatch[] {
  const matches: IPLMatch[] = [];
  const seen = new Set<string>();

  for (const it of items) {
    const t = it.title;
    // Match team vs team patterns
    const vsMatch = t.match(
      /(chennai super kings|mumbai indians|royal challengers bengaluru|royal challengers|kolkata knight riders|sunrisers hyderabad|delhi capitals|punjab kings|rajasthan royals|gujarat titans|lucknow super giants|csk|mi|rcb|kkr|srh|dc|pbks|rr|gt|lsg)\s+v(?:s|\.)\s+(chennai super kings|mumbai indians|royal challengers bengaluru|royal challengers|kolkata knight riders|sunrisers hyderabad|delhi capitals|punjab kings|rajasthan royals|gujarat titans|lucknow super giants|csk|mi|rcb|kkr|srh|dc|pbks|rr|gt|lsg)/i
    );

    if (!vsMatch) continue;
    const a = normalizeTeam(vsMatch[1]);
    const b = normalizeTeam(vsMatch[2]);
    if (!a || !b || a.short === b.short) continue;

    const key = [a.short, b.short].sort().join('-');
    if (seen.has(key)) continue;
    seen.add(key);

    // Try to extract scores like "MI 187/4 (20) vs CSK 156/8"
    const scoreA = (t.match(new RegExp(`${a.short}\\s+(\\d{2,3}\\/\\d{1,2}(?:\\s*\\(\\d+(?:\\.\\d+)?\\))?)`, 'i')) || [])[1];
    const scoreB = (t.match(new RegExp(`${b.short}\\s+(\\d{2,3}\\/\\d{1,2}(?:\\s*\\(\\d+(?:\\.\\d+)?\\))?)`, 'i')) || [])[1];

    const isLive = /live|in progress|need|require|chase|innings/i.test(t);
    const isDone = /won by|beat|defeats?|defeated|secure|clinches?/i.test(t);

    matches.push({
      id: it.id,
      teamA: a.full,
      teamB: b.full,
      teamAShort: a.short,
      teamBShort: b.short,
      status: t.length > 90 ? t.slice(0, 90) + '…' : t,
      state: isDone ? 'completed' : isLive ? 'live' : 'upcoming',
      scoreA,
      scoreB,
      url: it.url,
      startTime: it.timestamp,
      offline: it.offline,
    });

    if (matches.length >= 8) break;
  }

  return matches;
}

function iplNewsFallback(): NewsItem[] {
  const now = Date.now();
  const items = [
    { title: 'IPL 2026: CSK vs MI — Chennai win toss, opt to bowl first at Chepauk', source: 'Cricbuzz' },
    { title: 'IPL 2026: RCB vs KKR — Bengaluru post 198/5 in 20 overs', source: 'ESPNCricinfo' },
    { title: 'IPL 2026: SRH vs GT — Hyderabad chasing 175 in must-win clash', source: 'Cricbuzz' },
    { title: 'IPL 2026: DC vs PBKS — Delhi won by 6 wickets at Kotla', source: 'ESPNCricinfo' },
    { title: 'IPL 2026: RR vs LSG — Rajasthan chase 189 with 2 balls to spare', source: 'Cricbuzz' },
    { title: 'IPL 2026 points table update after Match 24', source: 'ESPNCricinfo' },
  ];
  return items.map((it, i) => ({
    id: `iplf-${i}`,
    url: '#',
    timestamp: now - i * 1800_000,
    offline: true,
    ...it,
  }));
}

function iplMatchesFallback(offline?: boolean): IPLMatch[] {
  return [
    { id: 'f1', teamA: 'Chennai Super Kings', teamB: 'Mumbai Indians', teamAShort: 'CSK', teamBShort: 'MI', status: 'CSK won toss, opted to bowl', state: 'live', scoreA: '—', scoreB: '142/3 (15.2)', url: '#', offline },
    { id: 'f2', teamA: 'Royal Challengers Bengaluru', teamB: 'Kolkata Knight Riders', teamAShort: 'RCB', teamBShort: 'KKR', status: 'Bengaluru post 198/5 in 20 overs', state: 'live', scoreA: '198/5 (20)', scoreB: '67/1 (6.4)', url: '#', offline },
    { id: 'f3', teamA: 'Sunrisers Hyderabad', teamB: 'Gujarat Titans', teamAShort: 'SRH', teamBShort: 'GT', status: 'Tonight 7:30 PM IST · Hyderabad', state: 'upcoming', url: '#', offline },
    { id: 'f4', teamA: 'Delhi Capitals', teamB: 'Punjab Kings', teamAShort: 'DC', teamBShort: 'PBKS', status: 'DC won by 6 wickets', state: 'completed', scoreA: '178/4 (18.3)', scoreB: '176/8 (20)', url: '#', offline },
  ];
}
