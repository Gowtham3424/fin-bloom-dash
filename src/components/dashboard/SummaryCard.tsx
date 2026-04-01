import { cn } from '@/lib/utils';

interface SummaryCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  delay?: number;
}

export function SummaryCard({ label, value, change, changeType = 'neutral', icon, delay = 0 }: SummaryCardProps) {
  return (
    <div
      className="card-tactile p-4 animate-bounce-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="label-uppercase">{label}</span>
        <span className="text-lg leading-none">{icon}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      {change && (
        <div className={cn(
          "text-xs font-medium",
          changeType === 'positive' && "text-income",
          changeType === 'negative' && "text-expense",
          changeType === 'neutral' && "text-muted-foreground",
        )}>
          {change}
        </div>
      )}
    </div>
  );
}
