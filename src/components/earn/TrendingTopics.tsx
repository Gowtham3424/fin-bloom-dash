import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndiaNews, fetchRedditPosts, fetchHackerNews, extractTopics } from '@/lib/trendsApi';
import { Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  active?: string;
  onSelect: (word: string | undefined) => void;
}

export function TrendingTopics({ active, onSelect }: Props) {
  const { data: news } = useQuery({ queryKey: ['india-news'], queryFn: fetchIndiaNews, staleTime: 15 * 60_000 });
  const { data: reddit } = useQuery({ queryKey: ['reddit-earning'], queryFn: fetchRedditPosts, staleTime: 15 * 60_000 });
  const { data: hn } = useQuery({ queryKey: ['hn-top'], queryFn: fetchHackerNews, staleTime: 15 * 60_000 });

  const titles = [
    ...(news || []).map((n) => n.title),
    ...(reddit || []).map((p) => p.title),
    ...(hn || []).map((p) => p.title),
  ];
  const topics = extractTopics(titles);

  return (
    <div className="border-2 border-foreground/20 bg-card rounded-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-foreground/20 bg-muted/30">
        <Hash className="h-3.5 w-3.5 text-accent" />
        <h3 className="label-uppercase text-xs">Trending Topics</h3>
      </div>
      <div className="p-4 flex flex-wrap gap-2">
        {topics.length === 0 && (
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">No topics yet…</span>
        )}
        {topics.map((t) => {
          const isActive = active === t.word;
          return (
            <button
              key={t.word}
              onClick={() => onSelect(isActive ? undefined : t.word)}
              className={cn(
                'font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border-2 transition-colors',
                isActive
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-foreground/20 hover:border-accent hover:text-accent'
              )}
            >
              #{t.word}
              <span className="ml-1.5 text-[9px] opacity-60">{t.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
