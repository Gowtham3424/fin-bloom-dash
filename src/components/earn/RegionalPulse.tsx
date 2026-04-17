import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndiaNews, timeAgo } from '@/lib/trendsApi';
import { MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const REGIONS = [
  { id: 'mumbai', label: 'Mumbai', match: ['mumbai', 'maharashtra'] },
  { id: 'delhi', label: 'Delhi', match: ['delhi', 'ncr', 'gurgaon', 'noida'] },
  { id: 'bangalore', label: 'Bangalore', match: ['bangalore', 'bengaluru', 'karnataka'] },
  { id: 'hyderabad', label: 'Hyderabad', match: ['hyderabad', 'telangana'] },
  { id: 'national', label: 'National', match: [] },
];

export function RegionalPulse() {
  const [region, setRegion] = React.useState('national');
  const { data } = useQuery({ queryKey: ['india-news'], queryFn: fetchIndiaNews, staleTime: 15 * 60_000 });

  const current = REGIONS.find((r) => r.id === region)!;
  const items = (data || []).filter((n) => {
    if (current.match.length === 0) return true;
    const text = (n.title + ' ' + (n.description || '')).toLowerCase();
    return current.match.some((kw) => text.includes(kw));
  }).slice(0, 8);

  return (
    <div className="border-2 border-foreground/20 bg-card rounded-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-foreground/20 bg-muted/30">
        <MapPin className="h-3.5 w-3.5 text-accent" />
        <h3 className="label-uppercase text-xs">Regional Pulse // Local → National</h3>
      </div>

      <div className="flex border-b-2 border-foreground/20 overflow-x-auto">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={cn(
              'px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider border-r-2 border-foreground/20 transition-colors shrink-0',
              region === r.id ? 'bg-foreground text-background' : 'hover:bg-muted/40 text-muted-foreground'
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="divide-y-2 divide-foreground/10">
        {items.length === 0 && (
          <div className="p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">
            No signals from {current.label} right now.
          </div>
        )}
        {items.map((n) => (
          <a
            key={n.id}
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug group-hover:text-accent transition-colors">
                {n.title}
              </p>
              <div className="flex items-center gap-2 mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="border border-foreground/20 px-1.5 py-0.5">{n.source}</span>
                <span>{timeAgo(n.timestamp)} ago</span>
              </div>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground/50 shrink-0 mt-1" />
          </a>
        ))}
      </div>
    </div>
  );
}
