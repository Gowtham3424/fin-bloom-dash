import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Category, Budget } from '@/types';
import { cn } from '@/lib/utils';

const expenseCategories: Category[] = [
  'Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 'Health', 'Utilities',
];

export function BudgetTracker() {
  const { state, dispatch } = useApp();
  const isAdmin = state.role === 'admin';
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySpending = state.transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const budgetMap = new Map(state.budgets.map(b => [b.category, b.limit]));

  const startEdit = (cat: Category, limit: number) => {
    setEditingCat(cat);
    setEditValue(String(limit));
  };

  const saveEdit = (cat: Category) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) {
      const updated = state.budgets.map(b =>
        b.category === cat ? { ...b, limit: val } : b
      );
      dispatch({ type: 'SET_BUDGETS', payload: updated });
    }
    setEditingCat(null);
  };

  return (
    <div className="card-tactile p-4 space-y-3">
      <h2 className="label-uppercase">BUDGETS</h2>
      <div className="space-y-2.5">
        {expenseCategories.map(cat => {
          const limit = budgetMap.get(cat) || 0;
          const spent = monthlySpending[cat] || 0;
          const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const overBudget = spent > limit && limit > 0;

          return (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-foreground/70">{cat}</span>
                <span className="flex items-center gap-1.5">
                  <span className={cn(
                    overBudget ? 'text-expense' : 'text-foreground/50'
                  )}>
                    ${spent.toFixed(0)}
                  </span>
                  <span className="text-foreground/30">/</span>
                  {editingCat === cat ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(cat)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(cat)}
                      className="w-16 h-5 px-1 text-[10px] bg-background border border-foreground/20 rounded-sm focus:outline-none focus:border-accent font-mono"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => isAdmin && startEdit(cat, limit)}
                      className={cn(
                        "text-foreground/50",
                        isAdmin && "hover:text-accent cursor-pointer"
                      )}
                    >
                      ${limit}
                    </button>
                  )}
                </span>
              </div>
              <div className="h-1.5 bg-foreground/10 rounded-sm overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-sm transition-all duration-500",
                    pct < 70 ? "bg-income" : pct < 90 ? "bg-accent" : "bg-expense"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
