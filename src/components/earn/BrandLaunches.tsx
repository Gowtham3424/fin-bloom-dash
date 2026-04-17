import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Rocket, ExternalLink } from 'lucide-react';
import { fetchBrandLaunches } from '@/lib/brandsApi';
import { timeAgo } from '@/lib/trendsApi';

export function BrandLaunches() {
  const { data, isLoading } = useQuery({
    queryKey: ['brand-launches'],
    queryFn: fetchBrandLaunches,
    staleTime: 30 * 60_000,
    refetchInterval: 60 * 60_000,
  });

  const items = (data || []).slice(0, 16);
  const offline = items[0]?.offline;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Rocket className="h-4 w-4 text-accent" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">NEW LAUNCHES // BRANDS // MARKETING</span>
        {offline && <span className="text-[9px] uppercase font-bold text-muted-foreground border border-foreground/20 px-1.5 py-0.5 rounded-sm">OFFLINE</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((n) => (
          <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className="border-2 border-foreground/20 bg-card p-3 rounded-sm hover:border-accent transition-colors group flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold">{n.source}</span>
                <span className="font-mono text-[9px] text-muted-foreground">{timeAgo(n.timestamp)}</span>
              </div>
              <div className="font-mono text-xs text-foreground leading-snug font-bold mb-1">{n.title}</div>
              {n.description && <div className="font-mono text-[10px] text-muted-foreground line-clamp-2">{n.description}</div>}
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent shrink-0 mt-0.5" />
          </a>
        ))}
        {isLoading && !items.length && (
          <div className="col-span-full p-6 text-center font-mono text-xs text-muted-foreground animate-pulse">FETCHING LAUNCHES…</div>
        )}
      </div>
    </div>
  );
}
