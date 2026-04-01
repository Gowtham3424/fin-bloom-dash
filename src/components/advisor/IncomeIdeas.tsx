import React from 'react';
import { Briefcase, TrendingUp, ShoppingBag, Coins, Home, Palette, GraduationCap, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IncomeIdea {
  icon: React.ElementType;
  title: string;
  range: string;
  difficulty: 1 | 2 | 3;
  description: string;
}

const ideas: IncomeIdea[] = [
  {
    icon: Briefcase,
    title: 'Freelancing',
    range: '$500 – $5,000/mo',
    difficulty: 2,
    description: 'Leverage your skills on platforms like Upwork, Fiverr, or Toptal.',
  },
  {
    icon: TrendingUp,
    title: 'Dividend Investing',
    range: '$50 – $500/mo',
    difficulty: 1,
    description: 'Build passive income with dividend-paying stocks or ETFs.',
  },
  {
    icon: ShoppingBag,
    title: 'Sell Unused Items',
    range: '$100 – $1,000',
    difficulty: 1,
    description: 'Declutter and earn on eBay, Facebook Marketplace, or Poshmark.',
  },
  {
    icon: Coins,
    title: 'Cashback & Rewards',
    range: '$20 – $100/mo',
    difficulty: 1,
    description: 'Use cashback apps like Rakuten, Honey, or credit card rewards.',
  },
  {
    icon: Home,
    title: 'Rental Income',
    range: '$500 – $3,000/mo',
    difficulty: 3,
    description: 'Rent a spare room or property on Airbnb or long-term lease.',
  },
  {
    icon: Palette,
    title: 'Digital Products',
    range: '$100 – $2,000/mo',
    difficulty: 2,
    description: 'Create and sell templates, courses, eBooks, or design assets.',
  },
  {
    icon: GraduationCap,
    title: 'Online Tutoring',
    range: '$200 – $2,000/mo',
    difficulty: 2,
    description: 'Teach subjects you know on platforms like Wyzant or Preply.',
  },
  {
    icon: Smartphone,
    title: 'App-Based Gigs',
    range: '$300 – $1,500/mo',
    difficulty: 1,
    description: 'Drive, deliver, or complete tasks via DoorDash, TaskRabbit, etc.',
  },
];

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={cn(
            "w-2 h-2 rounded-full border border-foreground/30",
            i <= level ? "bg-accent" : "bg-transparent"
          )}
        />
      ))}
    </div>
  );
}

export function IncomeIdeas() {
  return (
    <div className="border-2 border-foreground/20 bg-card rounded-sm">
      <div className="p-4 border-b-2 border-foreground/20">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
          SECONDARY INCOME // IDEAS
        </span>
      </div>
      <div className="divide-y-2 divide-foreground/10 max-h-[480px] overflow-y-auto">
        {ideas.map(idea => (
          <div
            key={idea.title}
            className="p-4 hover:bg-foreground/5 transition-colors cursor-default group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 border-2 border-foreground/20 rounded-sm flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
                <idea.icon className="h-4 w-4 text-foreground/60 group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    {idea.title}
                  </span>
                  <DifficultyDots level={idea.difficulty} />
                </div>
                <div className="font-mono text-sm font-bold text-income mb-1">
                  {idea.range}
                </div>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                  {idea.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
