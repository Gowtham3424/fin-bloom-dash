import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRedditPosts, timeAgo } from '@/lib/trendsApi';
import { ExternalLink, ArrowUp, MessageSquare, Flame } from 'lucide-react';

interface Props {
  filter?: string;
}

export function HotEarningMethods({ filter }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['reddit-earning'],
    queryFn: fetchRedditPosts,
    staleTime: 15 * 60_000,
    refetchInterval: 15 * 60_000,
  });

  const posts = (data || []).filter((p) =>
    !filter ? true : p.title.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 12);

  return (
    <div className="border-2 border-foreground/20 bg-card rounded-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-foreground/20 bg-muted/30">
        <div className="flex items-center gap-2">
          <Flame className="h-3.5 w-3.5 text-accent" />
          <h3 className="label-uppercase text-xs">Hot Earning Methods</h3>
        </div>
        {data?.[0]?.offline && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground border border-foreground/20 px-1.5 py-0.5">
            offline
          </span>
        )}
      </div>
      <div className="divide-y-2 divide-foreground/10 max-h-[480px] overflow-y-auto">
        {isLoading && (
          <div className="p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Scanning…</div>
        )}
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
                <ArrowUp className="h-3 w-3 text-income" />
                <span className="font-mono text-[10px] font-bold">{p.score}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug group-hover:text-accent transition-colors">
                  {p.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="border border-foreground/20 px-1.5 py-0.5">{p.source}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-2.5 w-2.5" /> {p.comments}
                  </span>
                  <span>{timeAgo(p.timestamp)}</span>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground/50 shrink-0 mt-1" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
