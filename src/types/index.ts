export type Role = 'viewer' | 'admin';

export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Shopping'
  | 'Health'
  | 'Utilities'
  | 'Salary'
  | 'Freelance';

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export interface Filters {
  search: string;
  type: TransactionType | 'all';
  categories: Category[];
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'amount' | 'category';
  sortDir: 'asc' | 'desc';
}

export interface AppState {
  role: Role;
  theme: 'light' | 'dark';
  transactions: Transaction[];
  filters: Filters;
}

export type AppAction =
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'RESET_FILTERS' };
