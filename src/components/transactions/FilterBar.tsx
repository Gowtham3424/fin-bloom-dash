import { Search, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Category, TransactionType } from '@/types';
import { cn } from '@/lib/utils';

const allCategories: Category[] = [
  'Food', 'Transport', 'Housing', 'Entertainment',
  'Shopping', 'Health', 'Utilities', 'Salary', 'Freelance',
];

export function FilterBar() {
  const { state, dispatch } = useApp();
  const f = state.filters;

  const setFilter = (partial: Partial<typeof f>) =>
    dispatch({ type: 'SET_FILTERS', payload: partial });

  const activeCount =
    (f.search ? 1 : 0) +
    (f.type !== 'all' ? 1 : 0) +
    f.categories.length +
    (f.dateFrom ? 1 : 0) +
    (f.dateTo ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Search + Type */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={f.search}
            onChange={e => setFilter({ search: e.target.value })}
            placeholder="Search transactions..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-background border-2 border-foreground/20 rounded-sm focus:outline-none focus:border-accent placeholder:text-muted-foreground font-mono"
          />
        </div>

        <div className="flex border-2 border-foreground/20 rounded-sm overflow-hidden shrink-0">
          {(['all', 'income', 'expense'] as (TransactionType | 'all')[]).map(type => (
            <button
              key={type}
              onClick={() => setFilter({ type })}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
                f.type === type
                  ? "bg-foreground text-background"
                  : "bg-transparent text-foreground/60 hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">From</span>
          <input
            type="date"
            value={f.dateFrom}
            onChange={e => setFilter({ dateFrom: e.target.value })}
            className="flex-1 h-9 px-2 text-xs bg-background border-2 border-foreground/20 rounded-sm focus:outline-none focus:border-accent font-mono"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">To</span>
          <input
            type="date"
            value={f.dateTo}
            onChange={e => setFilter({ dateTo: e.target.value })}
            className="flex-1 h-9 px-2 text-xs bg-background border-2 border-foreground/20 rounded-sm focus:outline-none focus:border-accent font-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {allCategories.map(cat => {
          const active = f.categories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => {
                const cats = active
                  ? f.categories.filter(c => c !== cat)
                  : [...f.categories, cat];
                setFilter({ categories: cats });
              }}
              className={cn(
                "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-2 rounded-sm transition-colors",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-foreground/15 text-foreground/50 hover:border-foreground/30"
              )}
            >
              {cat}
            </button>
          );
        })}

        {activeCount > 0 && (
          <button
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-expense flex items-center gap-1"
          >
            <X className="h-3 w-3" /> CLEAR ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}
