import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '@/contexts/AppContext';
import { categoryIcons, categoryColors } from '@/data/mockData';
import { Category } from '@/types';
import { format, parseISO } from 'date-fns';

export default function Insights() {
  const { state } = useApp();

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expenses: number }>();
    state.transactions.forEach(t => {
      const key = t.date.slice(0, 7);
      const e = map.get(key) || { income: 0, expenses: 0 };
      if (t.type === 'income') e.income += t.amount;
      else e.expenses += t.amount;
      map.set(key, e);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, v]) => ({
        month: format(parseISO(`${month}-01`), 'MMM yy'),
        Income: Math.round(v.income),
        Expenses: Math.round(v.expenses),
      }));
  }, [state.transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<Category, number>();
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries())
      .map(([cat, amount]) => ({ category: cat, amount: Math.round(amount) }))
      .sort((a, b) => b.amount - a.amount);
  }, [state.transactions]);

  const topCategory = categoryBreakdown[0];

  const topExpenses = useMemo(() =>
    [...state.transactions]
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3),
    [state.transactions]
  );

  // Auto-generated observations
  const observations = useMemo(() => {
    const obs: string[] = [];
    if (monthlyData.length >= 2) {
      const last = monthlyData[monthlyData.length - 1];
      const prev = monthlyData[monthlyData.length - 2];
      const expChange = prev.Expenses > 0
        ? ((last.Expenses - prev.Expenses) / prev.Expenses * 100).toFixed(1)
        : '0';
      if (parseFloat(expChange) > 0) {
        obs.push(`Spending increased ${expChange}% compared to last month.`);
      } else {
        obs.push(`Spending decreased ${Math.abs(parseFloat(expChange))}% compared to last month.`);
      }
      const incChange = prev.Income > 0
        ? ((last.Income - prev.Income) / prev.Income * 100).toFixed(1)
        : '0';
      if (parseFloat(incChange) > 0) {
        obs.push(`Income grew by ${incChange}% this month.`);
      }
    }
    if (topCategory) {
      const totalExp = categoryBreakdown.reduce((s, c) => s + c.amount, 0);
      const pct = ((topCategory.amount / totalExp) * 100).toFixed(0);
      obs.push(`${topCategory.category} accounts for ${pct}% of total spending.`);
    }
    return obs;
  }, [monthlyData, topCategory, categoryBreakdown]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-lg font-bold tracking-[0.2em] uppercase">INSIGHTS</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Highest spending category */}
        {topCategory && (
          <div className="card-tactile p-4 animate-bounce-in">
            <div className="label-uppercase mb-2">HIGHEST SPEND</div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{categoryIcons[topCategory.category]}</span>
              <span className="text-lg font-bold">{topCategory.category}</span>
            </div>
            <div className="text-2xl font-bold text-expense">${topCategory.amount.toLocaleString()}</div>
          </div>
        )}

        {/* Top 3 single expenses */}
        <div className="card-tactile p-4 animate-bounce-in" style={{ animationDelay: '80ms' }}>
          <div className="label-uppercase mb-3">TOP 3 EXPENSES</div>
          <div className="space-y-2">
            {topExpenses.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span className="font-medium truncate">{t.description}</span>
                </span>
                <span className="font-bold text-expense tabular-nums">${t.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="card-tactile p-4 animate-bounce-in" style={{ animationDelay: '160ms' }}>
          <div className="label-uppercase mb-3">OBSERVATIONS</div>
          <div className="space-y-2">
            {observations.map((obs, i) => (
              <div key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-accent shrink-0">▸</span>
                <span>{obs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="card-tactile p-4">
        <div className="label-uppercase mb-4">INCOME VS EXPENSES</div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '2px solid hsl(var(--foreground) / 0.2)',
                  borderRadius: '2px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="Income" fill="hsl(var(--income))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Expenses" fill="hsl(var(--expense))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category bars */}
      <div className="card-tactile p-4">
        <div className="label-uppercase mb-4">CATEGORY BREAKDOWN</div>
        <div className="space-y-3">
          {categoryBreakdown.map(c => {
            const max = categoryBreakdown[0].amount;
            const pct = (c.amount / max) * 100;
            return (
              <div key={c.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span>{categoryIcons[c.category]}</span>
                    {c.category}
                  </span>
                  <span className="tabular-nums text-muted-foreground">${c.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-foreground/10 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: categoryColors[c.category],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
