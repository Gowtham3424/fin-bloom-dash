import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndiaNews, fetchHackerNews } from '@/lib/trendsApi';
import { Radio } from 'lucide-react';

export function TrendingTicker() {
  const { data: news } = useQuery({ queryKey: ['india-news'], queryFn: fetchIndiaNews, staleTime: 15 * 60_000 });
  const { data: hn } = useQuery({ queryKey: ['hn-top'], queryFn: fetchHackerNews, staleTime: 15 * 60_000 });

  const headlines = [
    ...(news || []).slice(0, 6).map((n) => ({ label: n.source, text: n.title })),
    ...(hn || []).slice(0, 4).map((n) => ({ label: 'HN', text: n.title })),
  ];

  if (headlines.length === 0) {
    return (
      <div className="border-2 border-foreground/20 bg-card rounded-sm px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        Loading trends…
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground/20 bg-card rounded-sm overflow-hidden flex items-center">
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-accent text-accent-foreground shrink-0 border-r-2 border-foreground/20">
        <Radio className="h-3 w-3 animate-pulse" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">LIVE</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-8 animate-[marquee_60s_linear_infinite] whitespace-nowrap">
          {[...headlines, ...headlines].map((h, i) => (
            <div key={i} className="flex items-center gap-2 py-2.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {h.label}
              </span>
              <span className="font-mono text-xs text-foreground">{h.text}</span>
              <span className="text-foreground/30">●</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
