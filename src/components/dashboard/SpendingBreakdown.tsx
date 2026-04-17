import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '@/contexts/AppContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { categoryColors, categoryIcons } from '@/data/mockData';
import { Category } from '@/types';

export function SpendingBreakdown() {
  const { state } = useApp();
  const { format: fmt } = useCurrency();

  const data = useMemo(() => {
    const catMap = new Map<Category, number>();
    state.transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
      });

    return Array.from(catMap.entries())
      .map(([category, amount]) => ({
        name: category,
        value: Math.round(amount),
        icon: categoryIcons[category],
        color: categoryColors[category],
      }))
      .sort((a, b) => b.value - a.value);
  }, [state.transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card-tactile p-4">
      <div className="label-uppercase mb-4">SPENDING BREAKDOWN</div>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '2px solid hsl(var(--foreground) / 0.2)',
                  borderRadius: '2px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                }}
                formatter={(value: number) => [fmt(value, { decimals: 0 }), '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs w-full">
          {data.map(d => (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span style={{ color: d.color }}>{d.icon}</span>
                <span className="truncate">{d.name}</span>
              </div>
              <span className="text-muted-foreground font-medium">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
