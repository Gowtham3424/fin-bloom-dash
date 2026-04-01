import React from 'react';
import { FinMascot } from '@/components/advisor/FinMascot';
import { LiveRatesCard } from '@/components/advisor/LiveRatesCard';
import { IncomeIdeas } from '@/components/advisor/IncomeIdeas';
import { MarketTicker } from '@/components/advisor/MarketTicker';

export default function Advisor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
          ADVISOR
        </h1>
        <p className="font-mono text-sm text-foreground/60">
          Your personal finance companion — tips, rates & ideas.
        </p>
      </div>

      {/* Market Ticker */}
      <MarketTicker />

      {/* FINBOT Mascot */}
      <FinMascot />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveRatesCard />
        <IncomeIdeas />
      </div>
    </div>
  );
}
