import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, ExternalLink } from 'lucide-react';
import { fetchCricketNews, parseMatches } from '@/lib/cricketApi';
import { timeAgo } from '@/lib/trendsApi';

export function CricketScores() {
  const { data, isLoading } = useQuery({
    queryKey: ['cricket-news'],
    queryFn: fetchCricketNews,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });

  const items = data || [];
  const matches = parseMatches(items);
  const offline = items[0]?.offline;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-accent" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">CRICKET // LIVE & RECENT</span>
        {offline && <span className="text-[9px] uppercase font-bold text-muted-foreground border border-foreground/20 px-1.5 py-0.5 rounded-sm">OFFLINE</span>}
      </div>

      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {matches.map((m) => (
            <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer" className="border-2 border-foreground/20 bg-card p-3 rounded-sm hover:border-accent transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent">{m.format}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent" />
              </div>
              <div className="flex items-center justify-between font-mono text-sm font-bold mb-2">
                <span className="uppercase">{m.teamA}</span>
                <span className="text-muted-foreground text-xs">vs</span>
                <span className="uppercase">{m.teamB}</span>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground leading-snug line-clamp-2">{m.status}</div>
            </a>
          ))}
        </div>
      )}

      <div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">HEADLINES</div>
        <div className="space-y-1.5">
          {items.slice(0, 12).map((n) => (
            <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className="block border border-foreground/15 bg-card px-3 py-2 rounded-sm hover:border-accent transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-foreground leading-snug truncate">{n.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-accent">{n.source}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">{timeAgo(n.timestamp)}</span>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
              </div>
            </a>
          ))}
          {isLoading && !items.length && (
            <div className="p-6 text-center font-mono text-xs text-muted-foreground animate-pulse">FETCHING SCORES…</div>
          )}
        </div>
      </div>
    </div>
  );
}
