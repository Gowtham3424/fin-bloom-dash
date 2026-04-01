import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface TickerItem {
  label: string;
  value: string;
  change: number;
}

function generateTickerData(): TickerItem[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rand = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;

  return [
    { label: 'XAU/USD', value: (2640 + (rand(seed) - 0.5) * 60).toFixed(2), change: (rand(seed + 1) - 0.5) * 3 },
    { label: 'XAG/USD', value: (31 + (rand(seed + 2) - 0.5) * 2).toFixed(2), change: (rand(seed + 3) - 0.5) * 4 },
    { label: 'BTC/USD', value: (68000 + (rand(seed + 4) - 0.5) * 4000).toFixed(0), change: (rand(seed + 5) - 0.5) * 6 },
    { label: 'S&P 500', value: (5200 + (rand(seed + 6) - 0.5) * 100).toFixed(0), change: (rand(seed + 7) - 0.5) * 2 },
    { label: 'EUR/USD', value: (1.08 + (rand(seed + 8) - 0.5) * 0.02).toFixed(4), change: (rand(seed + 9) - 0.5) * 1 },
  ];
}

export function MarketTicker() {
  const { data: items } = useQuery({
    queryKey: ['market-ticker'],
    queryFn: () => Promise.resolve(generateTickerData()),
    staleTime: 5 * 60 * 1000,
  });

  const ticker = items || generateTickerData();

  return (
    <div className="border-2 border-foreground/20 bg-card rounded-sm overflow-hidden">
      <div className="flex items-center overflow-x-auto scrollbar-none">
        {ticker.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <div className="w-px h-8 bg-foreground/10 shrink-0" />}
            <div className="flex items-center gap-2 px-4 py-2.5 shrink-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
              <span className="font-mono text-xs font-bold text-foreground">{item.value}</span>
              <span className={cn(
                "font-mono text-[10px] font-bold",
                item.change >= 0 ? "text-income" : "text-expense"
              )}>
                {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
