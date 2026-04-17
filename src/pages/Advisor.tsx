import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Radar } from 'lucide-react';
import { FinMascot } from '@/components/advisor/FinMascot';
import { LiveRatesCard } from '@/components/advisor/LiveRatesCard';
import { IncomeIdeas } from '@/components/advisor/IncomeIdeas';
import { MarketTicker } from '@/components/advisor/MarketTicker';
import { TrendingTicker } from '@/components/earn/TrendingTicker';
import { HotEarningMethods } from '@/components/earn/HotEarningMethods';
import { LiveNewsFeed } from '@/components/earn/LiveNewsFeed';
import { TrendingTopics } from '@/components/earn/TrendingTopics';
import { RegionalPulse } from '@/components/earn/RegionalPulse';
import { SocialTrends } from '@/components/earn/SocialTrends';
import { BrandLaunches } from '@/components/earn/BrandLaunches';
import { CricketScores } from '@/components/earn/CricketScores';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Advisor() {
  const qc = useQueryClient();
  const [lastSync, setLastSync] = React.useState<Date>(new Date());
  const [topic, setTopic] = React.useState<string | undefined>();

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['india-news'] });
    qc.invalidateQueries({ queryKey: ['reddit-earning'] });
    qc.invalidateQueries({ queryKey: ['hn-top'] });
    qc.invalidateQueries({ queryKey: ['social-india'] });
    qc.invalidateQueries({ queryKey: ['social-usa'] });
    qc.invalidateQueries({ queryKey: ['brand-launches'] });
    qc.invalidateQueries({ queryKey: ['cricket-news'] });
    setLastSync(new Date());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">ADVISOR</h1>
        <p className="font-mono text-sm text-foreground/60">
          Your personal finance companion — tips, rates, ideas & live trends.
        </p>
      </div>

      <MarketTicker />
      <FinMascot />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveRatesCard />
        <IncomeIdeas />
      </div>

      {/* EARN // TRENDS RADAR */}
      <div className="border-2 border-foreground/20 bg-card rounded-sm">
        <div className="p-4 border-b-2 border-foreground/20 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-accent" />
            <span className="text-[11px] uppercase tracking-widest font-bold">EARN // TRENDS RADAR</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              LAST SYNC: {lastSync.toLocaleTimeString()}
            </span>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 border-2 border-foreground/20 rounded-sm px-2.5 py-1 font-mono text-[10px] font-bold uppercase hover:border-accent hover:text-accent transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> REFRESH
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <TrendingTicker />

          {topic && (
            <div className="flex items-center justify-between border border-accent/40 bg-accent/5 rounded-sm px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-wider">
                FILTER: <span className="text-accent">#{topic}</span>
              </span>
              <button
                onClick={() => setTopic(undefined)}
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                CLEAR ✕
              </button>
            </div>
          )}

          <Tabs defaultValue="income" className="w-full">
            <TabsList className="bg-transparent border-2 border-foreground/20 rounded-sm p-0 h-auto flex flex-wrap w-full justify-start">
              {[
                { v: 'income', label: 'INCOME' },
                { v: 'news', label: 'NEWS' },
                { v: 'social', label: 'SOCIAL' },
                { v: 'brands', label: 'BRANDS' },
                { v: 'cricket', label: 'CRICKET' },
              ].map((t) => (
                <TabsTrigger
                  key={t.v}
                  value={t.v}
                  className="font-mono text-[10px] font-bold uppercase tracking-wider rounded-none border-r-2 border-foreground/20 last:border-r-0 px-4 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="income" className="mt-4">
              <HotEarningMethods filter={topic} />
            </TabsContent>
            <TabsContent value="news" className="mt-4">
              <LiveNewsFeed filter={topic} />
            </TabsContent>
            <TabsContent value="social" className="mt-4">
              <SocialTrends />
            </TabsContent>
            <TabsContent value="brands" className="mt-4">
              <BrandLaunches />
            </TabsContent>
            <TabsContent value="cricket" className="mt-4">
              <CricketScores />
            </TabsContent>
          </Tabs>

          <TrendingTopics active={topic} onSelect={setTopic} />
          <RegionalPulse />
        </div>
      </div>
    </div>
  );
}
