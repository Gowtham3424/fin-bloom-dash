import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { BalanceTrendChart } from '@/components/dashboard/BalanceTrendChart';
import { SpendingBreakdown } from '@/components/dashboard/SpendingBreakdown';
import { categoryIcons } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
  const { state } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    let totalIncome = 0, totalExpenses = 0;
    let thisIncome = 0, thisExpenses = 0;
    let lastIncome = 0, lastExpenses = 0;

    state.transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (t.type === 'income') {
        totalIncome += t.amount;
        if (m === thisMonth) thisIncome += t.amount;
        if (m === lastMonth) lastIncome += t.amount;
      } else {
        totalExpenses += t.amount;
        if (m === thisMonth) thisExpenses += t.amount;
        if (m === lastMonth) lastExpenses += t.amount;
      }
    });

    const balance = 10000 + totalIncome - totalExpenses;
    const savingsRate = thisIncome > 0 ? ((thisIncome - thisExpenses) / thisIncome * 100) : 0;

    const incomeChange = lastIncome > 0 ? ((thisIncome - lastIncome) / lastIncome * 100) : 0;
    const expenseChange = lastExpenses > 0 ? ((thisExpenses - lastExpenses) / lastExpenses * 100) : 0;

    return { balance, thisIncome, thisExpenses, savingsRate, incomeChange, expenseChange };
  }, [state.transactions]);

  const recentTxns = useMemo(() =>
    [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [state.transactions]
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-lg font-bold tracking-[0.2em] uppercase">OVERVIEW</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          label="Balance"
          value={`$${Math.round(stats.balance).toLocaleString()}`}
          icon="◈"
          delay={0}
        />
        <SummaryCard
          label="Income"
          value={`$${Math.round(stats.thisIncome).toLocaleString()}`}
          change={`${stats.incomeChange >= 0 ? '+' : ''}${stats.incomeChange.toFixed(1)}% vs last mo.`}
          changeType={stats.incomeChange >= 0 ? 'positive' : 'negative'}
          icon="▲"
          delay={80}
        />
        <SummaryCard
          label="Expenses"
          value={`$${Math.round(stats.thisExpenses).toLocaleString()}`}
          change={`${stats.expenseChange >= 0 ? '+' : ''}${stats.expenseChange.toFixed(1)}% vs last mo.`}
          changeType={stats.expenseChange <= 0 ? 'positive' : 'negative'}
          icon="▼"
          delay={160}
        />
        <SummaryCard
          label="Save Rate"
          value={`${stats.savingsRate.toFixed(1)}%`}
          changeType={stats.savingsRate > 0 ? 'positive' : 'negative'}
          icon="◉"
          delay={240}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <BalanceTrendChart />
        <SpendingBreakdown />
      </div>

      {/* Recent Transactions */}
      <div className="card-tactile p-4">
        <div className="label-uppercase mb-3">RECENT TRANSACTIONS</div>
        <div className="space-y-0">
          {recentTxns.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-2.5 border-b border-foreground/10 last:border-0 animate-slide-in-right"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm shrink-0">{categoryIcons[t.category]}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{t.description}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {t.category} · {format(parseISO(t.date), 'MMM d')}
                  </div>
                </div>
              </div>
              <span className={cn(
                "text-sm font-bold tabular-nums shrink-0",
                t.type === 'income' ? "text-income" : "text-expense"
              )}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
