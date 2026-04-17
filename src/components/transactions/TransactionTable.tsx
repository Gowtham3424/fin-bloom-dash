import { useApp } from '@/contexts/AppContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { categoryIcons } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Filters } from '@/types';

export function TransactionTable({ onEdit }: { onEdit?: (id: string) => void }) {
  const { state, dispatch, filteredTransactions } = useApp();
  const { format: fmt } = useCurrency();
  const isAdmin = state.role === 'admin';

  const toggleSort = (col: Filters['sortBy']) => {
    if (state.filters.sortBy === col) {
      dispatch({ type: 'SET_FILTERS', payload: { sortDir: state.filters.sortDir === 'asc' ? 'desc' : 'asc' } });
    } else {
      dispatch({ type: 'SET_FILTERS', payload: { sortBy: col, sortDir: 'desc' } });
    }
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="card-tactile p-8 text-center">
        <div className="text-4xl mb-3">◇</div>
        <div className="text-sm font-bold uppercase tracking-wider mb-1">NO TRANSACTIONS</div>
        <div className="text-xs text-muted-foreground">Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div className="card-tactile overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-2 border-foreground/20">
              <th
                className="text-left px-4 py-3 label-uppercase cursor-pointer hover:text-accent transition-colors"
                onClick={() => toggleSort('date')}
              >
                <span className="flex items-center gap-1">
                  DATE <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="text-left px-4 py-3 label-uppercase">DESCRIPTION</th>
              <th
                className="text-left px-4 py-3 label-uppercase cursor-pointer hover:text-accent transition-colors"
                onClick={() => toggleSort('category')}
              >
                <span className="flex items-center gap-1">
                  CATEGORY <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="text-left px-4 py-3 label-uppercase">TYPE</th>
              <th
                className="text-right px-4 py-3 label-uppercase cursor-pointer hover:text-accent transition-colors"
                onClick={() => toggleSort('amount')}
              >
                <span className="flex items-center gap-1 justify-end">
                  AMOUNT <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              {isAdmin && <th className="px-4 py-3 label-uppercase text-right">ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t, i) => (
              <tr
                key={t.id}
                className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                  {format(parseISO(t.date), 'MMM dd')}
                </td>
                <td className="px-4 py-2.5 font-medium">{t.description}</td>
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-1.5">
                    <span>{categoryIcons[t.category]}</span>
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    "inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-sm",
                    t.type === 'income'
                      ? "border-income/40 text-income"
                      : "border-expense/40 text-expense"
                  )}>
                    {t.type}
                  </span>
                </td>
                <td className={cn(
                  "px-4 py-2.5 text-right font-bold tabular-nums",
                  t.type === 'income' ? "text-income" : "text-expense"
                )}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </td>
                {isAdmin && (
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit?.(t.id)}
                        className="p-1.5 hover:bg-foreground/10 rounded-sm transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 hover:bg-expense/10 text-expense rounded-sm transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
