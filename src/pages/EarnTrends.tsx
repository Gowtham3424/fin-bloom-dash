import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Sparkles } from 'lucide-react';
import { TrendingTicker } from '@/components/earn/TrendingTicker';
import { HotEarningMethods } from '@/components/earn/HotEarningMethods';
import { LiveNewsFeed } from '@/components/earn/LiveNewsFeed';
import { TrendingTopics } from '@/components/earn/TrendingTopics';
import { RegionalPulse } from '@/components/earn/RegionalPulse';

export default function EarnTrends() {
  const qc = useQueryClient();
  const [lastSync, setLastSync] = React.useState(new Date());
  const [topic, setTopic] = React.useState<string | undefined>(undefined);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['india-news'] });
    qc.invalidateQueries({ queryKey: ['reddit-earning'] });
    qc.invalidateQueries({ queryKey: ['hn-top'] });
    setLastSync(new Date());
  };

  return (
    <div className="space-y-4 pb-20">
      <header className="flex items-center justify-between flex-wrap gap-3 border-b-2 border-foreground/20 pb-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-accent" />
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider">EARN // Online Income Radar</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Live trends · Reddit · Hacker News · Indian biz feeds
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Last sync: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground/20 hover:border-accent hover:text-accent transition-colors font-mono text-[10px] font-bold uppercase tracking-wider"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
      </header>

      <TrendingTicker />

      {topic && (
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
          <span className="text-muted-foreground">Filtering by:</span>
          <span className="px-2 py-0.5 bg-accent text-accent-foreground">#{topic}</span>
          <button onClick={() => setTopic(undefined)} className="text-muted-foreground hover:text-foreground underline">
            clear
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HotEarningMethods filter={topic} />
        <LiveNewsFeed filter={topic} />
      </div>

      <TrendingTopics active={topic} onSelect={setTopic} />

      <RegionalPulse />
    </div>
  );
}
