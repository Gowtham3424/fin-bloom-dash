import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, ExternalLink, Radio, Clock, CheckCircle2 } from 'lucide-react';
import { fetchIPLData, IPLMatch } from '@/lib/cricketApi';
import { timeAgo } from '@/lib/trendsApi';

const STATE_META: Record<IPLMatch['state'], { label: string; cls: string; Icon: typeof Radio }> = {
  live: { label: 'LIVE', cls: 'text-destructive border-destructive/60 bg-destructive/10', Icon: Radio },
  upcoming: { label: 'UPCOMING', cls: 'text-accent border-accent/60 bg-accent/10', Icon: Clock },
  completed: { label: 'RESULT', cls: 'text-muted-foreground border-foreground/20 bg-card', Icon: CheckCircle2 },
};

export function CricketScores() {
  const { data, isLoading } = useQuery({
    queryKey: ['cricket-news'],
    queryFn: fetchIPLData,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const matches = data?.matches || [];
  const news = data?.news || [];
  const offline = matches[0]?.offline;

  const live = matches.filter((m) => m.state === 'live');
  const upcoming = matches.filter((m) => m.state === 'upcoming');
  const completed = matches.filter((m) => m.state === 'completed');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Trophy className="h-4 w-4 text-accent" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
          IPL 2026 // LIVE SCORES
        </span>
        <span className="font-mono text-[9px] uppercase font-bold text-destructive border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 rounded-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /> AUTO-REFRESH 60s
        </span>
        {offline && (
          <span className="text-[9px] uppercase font-bold text-muted-foreground border border-foreground/20 px-1.5 py-0.5 rounded-sm">
            OFFLINE
          </span>
        )}
      </div>

      {isLoading && !matches.length && (
        <div className="p-6 text-center font-mono text-xs text-muted-foreground animate-pulse border-2 border-dashed border-foreground/20 rounded-sm">
          FETCHING IPL SCORES…
        </div>
      )}

      {[
        { title: 'LIVE NOW', list: live },
        { title: 'UPCOMING', list: upcoming },
        { title: 'RECENT RESULTS', list: completed },
      ].map((sec) =>
        sec.list.length ? (
          <div key={sec.title}>
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
              {sec.title}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sec.list.map((m) => <MatchCard key={m.id} m={m} />)}
            </div>
          </div>
        ) : null
      )}

      {!isLoading && !matches.length && (
        <div className="p-6 text-center font-mono text-xs text-muted-foreground border-2 border-dashed border-foreground/20 rounded-sm">
          NO IPL MATCHES SCHEDULED RIGHT NOW. CHECK BACK SOON.
        </div>
      )}

      {news.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
            IPL HEADLINES
          </div>
          <div className="space-y-1.5">
            {news.slice(0, 10).map((n) => (
              <a
                key={n.id}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-foreground/15 bg-card px-3 py-2 rounded-sm hover:border-accent transition-colors"
              >
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
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({ m }: { m: IPLMatch }) {
  const meta = STATE_META[m.state];
  const Icon = meta.Icon;
  return (
    <a
      href={m.url}
      target={m.url === '#' ? undefined : '_blank'}
      rel="noopener noreferrer"
      className="border-2 border-foreground/20 bg-card p-3 rounded-sm hover:border-accent transition-colors group block"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border flex items-center gap-1 ${meta.cls}`}
        >
          {m.state === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />}
          <Icon className="h-2.5 w-2.5" />
          {meta.label}
        </span>
        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent" />
      </div>

      <div className="space-y-1.5 mb-2">
        <div className="flex items-center justify-between font-mono text-sm">
          <span className="font-bold uppercase">{m.teamAShort}</span>
          <span className="text-foreground/80 text-xs">{m.scoreA || '—'}</span>
        </div>
        <div className="flex items-center justify-between font-mono text-sm">
          <span className="font-bold uppercase">{m.teamBShort}</span>
          <span className="text-foreground/80 text-xs">{m.scoreB || '—'}</span>
        </div>
      </div>

      <div className="font-mono text-[10px] text-muted-foreground leading-snug line-clamp-2 border-t border-foreground/10 pt-1.5">
        {m.status}
      </div>
    </a>
  );
}
