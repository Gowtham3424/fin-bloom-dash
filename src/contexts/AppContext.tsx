import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { AppState, AppAction, Filters, Role, Transaction, Budget, Category } from '@/types';
import { initialTransactions } from '@/data/mockData';

const defaultFilters: Filters = {
  search: '',
  type: 'all',
  categories: [],
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortDir: 'desc',
};

const defaultBudgets: Budget[] = [
  { category: 'Food' as Category, limit: 500 },
  { category: 'Transport' as Category, limit: 300 },
  { category: 'Housing' as Category, limit: 1500 },
  { category: 'Entertainment' as Category, limit: 200 },
  { category: 'Shopping' as Category, limit: 400 },
  { category: 'Health' as Category, limit: 200 },
  { category: 'Utilities' as Category, limit: 300 },
];

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('finboard-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        role: parsed.role || 'viewer',
        theme: parsed.theme || 'light',
        transactions: parsed.transactions || initialTransactions,
        filters: { ...defaultFilters, ...parsed.filters },
        budgets: parsed.budgets || defaultBudgets,
      };
    }
  } catch { /* ignore */ }
  return {
    role: 'viewer',
    theme: 'light',
    transactions: initialTransactions,
    filters: defaultFilters,
    budgets: defaultBudgets,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    default:
      return state;
  }
}

interface ContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  filteredTransactions: Transaction[];
  setRole: (role: Role) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('finboard-state', JSON.stringify({
      role: state.role,
      theme: state.theme,
      transactions: state.transactions,
    }));
  }, [state.role, state.theme, state.transactions]);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const filteredTransactions = useMemo(() => {
    let txns = [...state.transactions];
    const f = state.filters;

    if (f.search) {
      const q = f.search.toLowerCase();
      txns = txns.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (f.type !== 'all') {
      txns = txns.filter(t => t.type === f.type);
    }
    if (f.categories.length > 0) {
      txns = txns.filter(t => f.categories.includes(t.category));
    }
    if (f.dateFrom) {
      txns = txns.filter(t => t.date >= f.dateFrom);
    }
    if (f.dateTo) {
      txns = txns.filter(t => t.date <= f.dateTo);
    }

    txns.sort((a, b) => {
      let cmp = 0;
      if (f.sortBy === 'date') cmp = a.date.localeCompare(b.date);
      else if (f.sortBy === 'amount') cmp = a.amount - b.amount;
      else cmp = a.category.localeCompare(b.category);
      return f.sortDir === 'asc' ? cmp : -cmp;
    });

    return txns;
  }, [state.transactions, state.filters]);

  const setRole = useCallback((role: Role) => dispatch({ type: 'SET_ROLE', payload: role }), []);
  const toggleTheme = useCallback(() => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTransactions, setRole, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
