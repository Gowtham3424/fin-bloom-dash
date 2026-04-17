import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface TickerItem {
  label: string;
  value: string;
  change: number;
}

const OZ_TO_GRAM = 31.1035;

function generateInternational(): { goldUSDperOz: number; silverUSDperOz: number; btc: number; sp: number; eur: number; goldChg: number; silverChg: number; btcChg: number; spChg: number; eurChg: number } {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const rand = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;
  return {
    goldUSDperOz: 2640 + (rand(seed) - 0.5) * 60,
    silverUSDperOz: 31 + (rand(seed + 2) - 0.5) * 2,
    btc: 68000 + (rand(seed + 4) - 0.5) * 4000,
    sp: 5200 + (rand(seed + 6) - 0.5) * 100,
    eur: 1.08 + (rand(seed + 8) - 0.5) * 0.02,
    goldChg: (rand(seed + 1) - 0.5) * 3,
    silverChg: (rand(seed + 3) - 0.5) * 4,
    btcChg: (rand(seed + 5) - 0.5) * 6,
    spChg: (rand(seed + 7) - 0.5) * 2,
    eurChg: (rand(seed + 9) - 0.5) * 1,
  };
}

export function MarketTicker() {
  const { data } = useQuery({
    queryKey: ['market-ticker'],
    queryFn: () => Promise.resolve(generateInternational()),
    staleTime: 5 * 60 * 1000,
  });

  const { rateUSDtoCurrent, currency, formatRaw } = useCurrency();
  const m = data || generateInternational();

  // Gold/Silver: convert to selected currency PER GRAM
  const goldLocalPerG = (m.goldUSDperOz / OZ_TO_GRAM) * rateUSDtoCurrent;
  const silverLocalPerG = (m.silverUSDperOz / OZ_TO_GRAM) * rateUSDtoCurrent;

  const ticker: TickerItem[] = [
    { label: `XAU/${currency.code}/g`, value: formatRaw(goldLocalPerG, currency.code, { decimals: 0 }), change: m.goldChg },
    { label: `XAG/${currency.code}/g`, value: formatRaw(silverLocalPerG, currency.code, { decimals: 2 }), change: m.silverChg },
    { label: 'BTC/USD', value: `$${m.btc.toFixed(0)}`, change: m.btcChg },
    { label: 'S&P 500', value: m.sp.toFixed(0), change: m.spChg },
    { label: 'EUR/USD', value: m.eur.toFixed(4), change: m.eurChg },
  ];

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
