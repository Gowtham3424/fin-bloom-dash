import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndiaNews, timeAgo } from '@/lib/trendsApi';
import { ExternalLink, Newspaper } from 'lucide-react';

interface Props {
  filter?: string;
}

export function LiveNewsFeed({ filter }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['india-news'],
    queryFn: fetchIndiaNews,
    staleTime: 15 * 60_000,
    refetchInterval: 30 * 60_000,
  });

  const items = (data || []).filter((n) =>
    !filter ? true : (n.title + ' ' + (n.description || '')).toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 14);

  return (
    <div className="border-2 border-foreground/20 bg-card rounded-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-foreground/20 bg-muted/30">
        <div className="flex items-center gap-2">
          <Newspaper className="h-3.5 w-3.5 text-accent" />
          <h3 className="label-uppercase text-xs">Live News Feed // India</h3>
        </div>
        {data?.[0]?.offline && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground border border-foreground/20 px-1.5 py-0.5">
            offline
          </span>
        )}
      </div>
      <div className="divide-y-2 divide-foreground/10 max-h-[480px] overflow-y-auto">
        {isLoading && (
          <div className="p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Fetching feeds…</div>
        )}
        {items.map((n) => (
          <a
            key={n.id}
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug group-hover:text-accent transition-colors">
                  {n.title}
                </p>
                {n.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="border border-foreground/20 px-1.5 py-0.5">{n.source}</span>
                  <span>{timeAgo(n.timestamp)} ago</span>
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
