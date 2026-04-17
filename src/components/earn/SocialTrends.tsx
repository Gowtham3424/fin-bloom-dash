import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, ExternalLink, MessageSquare, ArrowUp } from 'lucide-react';
import { fetchSocialIndia, fetchSocialUSA, getViralKeywords } from '@/lib/socialTrendsApi';
import { timeAgo } from '@/lib/trendsApi';
import { cn } from '@/lib/utils';

export function SocialTrends() {
  const [region, setRegion] = React.useState<'india' | 'usa'>('india');

  const india = useQuery({ queryKey: ['social-india'], queryFn: fetchSocialIndia, staleTime: 15 * 60_000, refetchInterval: 30 * 60_000 });
  const usa = useQuery({ queryKey: ['social-usa'], queryFn: fetchSocialUSA, staleTime: 15 * 60_000, refetchInterval: 30 * 60_000 });

  const active = region === 'india' ? india : usa;
  const posts = (active.data || []).slice(0, 12);
  const keywords = getViralKeywords(active.data || [], 14);
  const offline = posts[0]?.offline;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-accent" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">VIRAL POSTS</span>
          {offline && <span className="text-[9px] uppercase font-bold text-muted-foreground border border-foreground/20 px-1.5 py-0.5 rounded-sm">OFFLINE</span>}
        </div>
        <div className="flex border-2 border-foreground/20 rounded-sm overflow-hidden">
          {(['india', 'usa'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                'px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors',
                region === r ? 'bg-foreground text-background' : 'text-foreground/60 hover:text-foreground'
              )}
            >
              {r === 'india' ? '🇮🇳 INDIA' : '🇺🇸 USA'}
            </button>
          ))}
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((k) => (
            <span key={k.word} className="font-mono text-[10px] uppercase border border-foreground/20 px-2 py-0.5 rounded-sm text-foreground/70">
              #{k.word} <span className="text-accent">{k.count}</span>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {posts.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="border-2 border-foreground/20 bg-card p-3 rounded-sm hover:border-accent transition-colors group">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold">{p.source}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">{timeAgo(p.timestamp)}</span>
                </div>
                <div className="font-mono text-xs text-foreground leading-snug line-clamp-3">{p.title}</div>
                <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" />{p.score?.toLocaleString() || '—'}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{p.comments?.toLocaleString() || 0}</span>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent shrink-0" />
            </div>
          </a>
        ))}
        {active.isLoading && !posts.length && (
          <div className="col-span-full p-6 text-center font-mono text-xs text-muted-foreground animate-pulse">FETCHING SOCIAL FEEDS…</div>
        )}
      </div>
    </div>
  );
}
