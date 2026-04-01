import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '@/contexts/AppContext';
import { format, parseISO } from 'date-fns';

export function BalanceTrendChart() {
  const { state } = useApp();

  const data = useMemo(() => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>();

    state.transactions.forEach(t => {
      const key = t.date.slice(0, 7); // YYYY-MM
      const entry = monthlyMap.get(key) || { income: 0, expenses: 0 };
      if (t.type === 'income') entry.income += t.amount;
      else entry.expenses += t.amount;
      monthlyMap.set(key, entry);
    });

    const sorted = Array.from(monthlyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    let balance = 10000; // starting balance

    return sorted.map(([month, vals]) => {
      balance += vals.income - vals.expenses;
      return {
        month: format(parseISO(`${month}-01`), 'MMM yy'),
        balance: Math.round(balance),
        income: Math.round(vals.income),
        expenses: Math.round(vals.expenses),
      };
    });
  }, [state.transactions]);

  return (
    <div className="card-tactile p-4">
      <div className="label-uppercase mb-4">BALANCE TREND</div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
            />
            <Area
              type="stepAfter"
              dataKey="balance"
              stroke="hsl(var(--highlight))"
              strokeWidth={2}
              fill="hsl(var(--highlight) / 0.1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
