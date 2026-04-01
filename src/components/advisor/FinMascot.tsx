import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ChevronRight } from 'lucide-react';

const tips = [
  "Pack lunch 3x/week → save ~$200/mo 🍱",
  "Cancel unused subscriptions — audit monthly 🔍",
  "Use the 24-hour rule before impulse buys ⏳",
  "Switch to a no-fee bank account 🏦",
  "Batch cook on Sundays to cut food costs 🍲",
  "Use public transport 2x/week → save ~$150/mo 🚌",
  "Negotiate your phone/internet bill annually 📱",
  "Buy generic brands — same quality, 30% cheaper 🏷️",
  "Set up automatic savings — pay yourself first 💰",
  "Use cashback apps for everyday purchases 💳",
  "Bring your own coffee — save $100+/mo ☕",
  "Review insurance policies yearly for better rates 📋",
  "Use the library for books, movies & WiFi 📚",
  "Plan meals around weekly grocery sales 🛒",
  "Unplug electronics when not in use — save on utilities ⚡",
  "DIY cleaning products with vinegar & baking soda 🧹",
  "Walk or bike for trips under 2 miles 🚶",
  "Set spending limits per category and stick to them 📊",
  "Use free workout videos instead of a gym membership 🏋️",
  "Buy secondhand for furniture & electronics ♻️",
  "Track every expense — awareness = savings 📝",
  "Automate bill payments to avoid late fees ⏰",
  "Host potlucks instead of dining out with friends 🎉",
  "Use energy-efficient LED bulbs — save $75/yr 💡",
];

const categoryTips: Record<string, string[]> = {
  Food: ["Meal prep saves 40% on food costs", "Buy in bulk at wholesale stores"],
  Transport: ["Carpool to split fuel costs", "Consider an e-bike for commuting"],
  Shopping: ["Wait for seasonal sales", "Use price comparison tools before buying"],
  Entertainment: ["Free community events are everywhere", "Share streaming accounts with family"],
  Housing: ["Refinance if rates drop 0.5%+", "Use smart thermostats to cut heating bills"],
  Health: ["Preventive care saves thousands long-term", "Use generic medications when possible"],
  Utilities: ["Smart power strips cut phantom loads", "Wash clothes in cold water"],
};

function getDailyIndex(offset: number = 0): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return (seed + offset) % tips.length;
}

export function FinMascot() {
  const { state } = useApp();
  const [tipOffset, setTipOffset] = useState(0);

  const personalTip = useMemo(() => {
    const expenses = state.transactions.filter(t => t.type === 'expense');
    const catTotals: Record<string, number> = {};
    expenses.forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCat && categoryTips[topCat[0]]) {
      const catArr = categoryTips[topCat[0]];
      return catArr[getDailyIndex() % catArr.length];
    }
    return null;
  }, [state.transactions]);

  const currentTip = tips[getDailyIndex(tipOffset)];

  return (
    <div className="flex items-start gap-4">
      {/* Pixel-art FINBOT */}
      <div className="shrink-0">
        <svg width="80" height="96" viewBox="0 0 80 96" className="drop-shadow-sm">
          {/* Antenna */}
          <rect x="38" y="0" width="4" height="12" className="fill-foreground/60" />
          <circle cx="40" cy="4" r="4" className="fill-accent" />
          
          {/* Head */}
          <rect x="16" y="12" width="48" height="36" rx="2" className="fill-foreground stroke-foreground" strokeWidth="2" />
          <rect x="18" y="14" width="44" height="32" rx="1" className="fill-background" />
          
          {/* Eyes - blinking */}
          <rect x="26" y="24" width="8" height="8" rx="1" className="fill-accent animate-pulse" />
          <rect x="46" y="24" width="8" height="8" rx="1" className="fill-accent animate-pulse" />
          
          {/* Mouth */}
          <rect x="30" y="36" width="20" height="4" rx="1" className="fill-foreground/40" />
          <rect x="32" y="36" width="4" height="4" className="fill-income" />
          <rect x="38" y="36" width="4" height="4" className="fill-income" />
          <rect x="44" y="36" width="4" height="4" className="fill-income" />
          
          {/* Body */}
          <rect x="20" y="52" width="40" height="28" rx="2" className="fill-foreground stroke-foreground" strokeWidth="2" />
          <rect x="22" y="54" width="36" height="24" rx="1" className="fill-background" />
          
          {/* Body screen */}
          <rect x="28" y="58" width="24" height="16" rx="1" className="fill-foreground/10" />
          <rect x="30" y="60" width="6" height="3" className="fill-income/60" />
          <rect x="38" y="60" width="6" height="3" className="fill-expense/60" />
          <rect x="30" y="65" width="14" height="2" className="fill-foreground/20" />
          <rect x="30" y="69" width="10" height="2" className="fill-foreground/20" />
          
          {/* Legs */}
          <rect x="24" y="82" width="12" height="14" rx="2" className="fill-foreground" />
          <rect x="44" y="82" width="12" height="14" rx="2" className="fill-foreground" />
        </svg>
      </div>

      {/* Speech bubble */}
      <div className="flex-1 relative">
        <div className="border-2 border-foreground/20 bg-card p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">
            FINBOT // DAILY TIP
          </div>
          <p className="font-mono text-sm leading-relaxed text-foreground">
            {currentTip}
          </p>
          {personalTip && (
            <div className="mt-3 pt-3 border-t border-foreground/10">
              <div className="text-[10px] uppercase tracking-widest text-accent mb-1 font-bold">
                PERSONALIZED
              </div>
              <p className="font-mono text-xs text-foreground/80">{personalTip}</p>
            </div>
          )}
          <button
            onClick={() => setTipOffset(o => o + 1)}
            className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-accent hover:text-accent/80 transition-colors"
          >
            NEXT TIP <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        {/* Bubble arrow */}
        <div className="absolute left-[-8px] top-6 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-foreground/20" />
      </div>
    </div>
  );
}
